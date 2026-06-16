// ─── Types ───────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

export interface RequestConfig<TBody = unknown> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  /** Milliseconds before the request is aborted. Default: 15 000. */
  timeoutMs?: number;
  /** Pass an external AbortSignal to cancel the request from outside. */
  signal?: AbortSignal;
}

// ─── Error class ─────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    /** HTTP status code, or 0 for network-level failures, 408 for timeouts. */
    public readonly status: number,
    message: string,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError()  { return this.status === 0; }
  get isTimeout()       { return this.status === 408; }
  get isClientError()   { return this.status >= 400 && this.status < 500; }
  get isServerError()   { return this.status >= 500; }
  get isUnauthorized()  { return this.status === 401; }
  get isForbidden()     { return this.status === 403; }
  get isNotFound()      { return this.status === 404; }
}

// ─── Internals ────────────────────────────────────────────────────────────────

const VALID_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
const NO_BODY_METHODS: HttpMethod[] = ['GET', 'HEAD'];
const NO_CONTENT_STATUSES = new Set([204, 205]);

function validateRequest<TBody>(method: HttpMethod, body: TBody | undefined): void {
  if (!VALID_METHODS.includes(method)) {
    throw new TypeError(
      `Invalid HTTP method "${method}". Allowed: ${VALID_METHODS.join(', ')}.`,
    );
  }
  if (body !== undefined && NO_BODY_METHODS.includes(method)) {
    throw new TypeError(
      `HTTP method "${method}" must not include a request body.`,
    );
  }
}

function buildBody<TBody>(body: TBody | undefined, headers: Record<string, string>): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData || body instanceof URLSearchParams || typeof body === 'string') {
    return body as BodyInit;
  }
  // JSON object/array — serialise and auto-set Content-Type
  headers['Content-Type'] ??= 'application/json';
  return JSON.stringify(body);
}

async function extractErrorMessage(res: Response): Promise<string> {
  const ct = res.headers.get('Content-Type') ?? '';
  try {
    if (ct.includes('application/json')) {
      const json = await res.json() as Record<string, unknown>;
      return String(json['message'] ?? json['error'] ?? res.statusText);
    }
    const text = await res.text();
    return text || res.statusText;
  } catch {
    return res.statusText;
  }
}

// ─── Core request function ────────────────────────────────────────────────────

/**
 * Generic HTTP client. Validates the request before sending and the response
 * before returning, throwing a typed `ApiError` on any failure.
 *
 * @example
 * const data = await apiRequest<{ clients: Client[] }>({ url: '/api/clients' });
 * const result = await apiRequest<RebalanceResponse, RebalanceBody>({
 *   url: '/api/clients/c001/rebalance',
 *   method: 'POST',
 *   body: { recommendations },
 * });
 */
export async function apiRequest<TResponse, TBody = unknown>(
  config: RequestConfig<TBody>,
): Promise<TResponse> {
  const {
    url,
    method = 'GET',
    body,
    headers = {},
    timeoutMs = 15_000,
    signal: externalSignal,
  } = config;

  const upperMethod = method.toUpperCase() as HttpMethod;

  // ── Request validation ────────────────────────────────────────────────────
  validateRequest(upperMethod, body);

  // ── Build fetch options ───────────────────────────────────────────────────
  const resolvedHeaders: Record<string, string> = { ...headers };
  const resolvedBody = buildBody(body, resolvedHeaders);

  // Timeout via AbortController; merged with any caller-supplied signal
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  // If the caller passes their own signal, abort ours when theirs fires
  externalSignal?.addEventListener('abort', () => timeoutController.abort(), { once: true });

  try {
    const res = await fetch(url, {
      method: upperMethod,
      headers: resolvedHeaders,
      body: resolvedBody,
      signal: timeoutController.signal,
    });

    clearTimeout(timeoutId);

    // ── Response validation ─────────────────────────────────────────────────
    if (!res.ok) {
      const message = await extractErrorMessage(res);
      throw new ApiError(res.status, message, url);
    }

    // 204/205 No Content or HEAD — nothing to parse
    if (NO_CONTENT_STATUSES.has(res.status) || upperMethod === 'HEAD') {
      return undefined as TResponse;
    }

    const ct = res.headers.get('Content-Type') ?? '';
    if (ct.includes('application/json')) {
      return res.json() as Promise<TResponse>;
    }

    // Non-JSON success (e.g. plain-text or CSV)
    return res.text() as unknown as TResponse;

  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      const timedOut = !externalSignal?.aborted;
      throw new ApiError(
        timedOut ? 408 : 0,
        timedOut ? `Request timed out after ${timeoutMs}ms` : 'Request cancelled',
        url,
      );
    }

    throw new ApiError(0, (err as Error).message || 'Network error', url);
  }
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

type OmitCore<TBody> = Omit<RequestConfig<TBody>, 'url' | 'method' | 'body'>;

export const get = <TResponse>(url: string, config?: OmitCore<never>) =>
  apiRequest<TResponse>({ ...config, url, method: 'GET' });

export const post = <TResponse, TBody = unknown>(url: string, body: TBody, config?: OmitCore<TBody>) =>
  apiRequest<TResponse, TBody>({ ...config, url, method: 'POST', body });

export const put = <TResponse, TBody = unknown>(url: string, body: TBody, config?: OmitCore<TBody>) =>
  apiRequest<TResponse, TBody>({ ...config, url, method: 'PUT', body });

export const patch = <TResponse, TBody = unknown>(url: string, body: TBody, config?: OmitCore<TBody>) =>
  apiRequest<TResponse, TBody>({ ...config, url, method: 'PATCH', body });

export const del = <TResponse>(url: string, config?: OmitCore<never>) =>
  apiRequest<TResponse>({ ...config, url, method: 'DELETE' });
