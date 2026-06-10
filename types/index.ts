export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';
export type RebalancingStatus = 'pending' | 'reviewed' | 'not_required';
export type TradeAction = 'BUY' | 'SELL';
export type SortDirection = 'asc' | 'desc';
export type Theme = 'dark' | 'light';
export type DriftDirection = 'overweight' | 'underweight' | 'balanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  loginAt: string;
  clientCount?: number;
  firmName?: string;
}

export interface Client {
  id: string;
  clientId: string;
  name: string;
  city: string;
  aum: number;
  returnOneMonth: number;
  returnYTD: number;
  riskProfile: RiskProfile;
  requiresRebalancing: boolean;
  joinedAt: string;
  currency?: string;
  phone?: string;
  email?: string;
  lastReviewedAt?: string;
  rmId?: string;
}

export interface Holding {
  id: string;
  instrumentName: string;
  ticker: string;
  assetClass: string;
  currentValue: number;
  purchaseValue?: number;
  gainLossAbs: number;
  gainLossPct: number;
  weightPct: number;
}

export interface AssetAllocation {
  assetClass: string;
  currentPct: number;
  targetPct: number;
  currentValue?: number;
}

export interface Recommendation {
  id: string;
  action: TradeAction;
  instrumentName: string;
  ticker?: string;
  assetClass?: string;
  amount: number;
  drift?: number;
  reason: string;
}

export interface Portfolio {
  client: Client;
  clientId: string;
  totalValue: number;
  lastRebalancedAt: string;
  rebalancingStatus: RebalancingStatus;
  assetAllocation: AssetAllocation[];
  holdings: Holding[];
  recommendations: Recommendation[];
}

export interface PerformanceDataPoint {
  label: string;
  date: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  portfolioValue: number;
}

export interface PerformanceData {
  clientId: string;
  benchmark: string;
  dataPoints: PerformanceDataPoint[];
}

export interface DriftResult extends AssetAllocation {
  drift: number;
  driftDirection: DriftDirection;
  requiresAction: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  totalCurrent: number;
  totalTarget: number;
}

// Redux state shapes
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginError: string | null;
}

export interface ClientFilters {
  riskProfile: string;
  requiresRebalancing: boolean;
  searchQuery: string;
}

export interface SortConfig {
  field: string;
  order: SortDirection;
}

export interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  filters: ClientFilters;
  sort: SortConfig;
}

export interface PortfolioState {
  currentClientId: string | null;
  data: Portfolio | null;
  performance: PerformanceData | null;
  portfolioLoading: boolean;
  performanceLoading: boolean;
  rebalanceLoading: boolean;
  portfolioError: string | null;
  performanceError: string | null;
  rebalanceError: string | null;
  rebalanceSuccess: boolean;
}

export interface RootState {
  auth: AuthState;
  clients: ClientsState;
  portfolio: PortfolioState;
}

export interface ClientsSummary {
  totalClients: number;
  totalAUM: number;
  alertCount: number;
  avgReturnYTD: number;
}

// Used in mock data (portfolio without client/recommendations — those are attached at API time)
export type MockPortfolioData = Omit<Portfolio, 'client' | 'recommendations'>;
