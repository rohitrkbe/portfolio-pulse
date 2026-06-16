import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';
import type { Recommendation } from '@/types';

interface RebalanceBody {
  recommendations: Recommendation[];
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;

    const client = MOCK_CLIENTS.find((c) => c.id === id);
    if (!client) {
      return NextResponse.json({ message: `Client '${id}' not found` }, { status: 404 });
    }

    const body = (await request.json()) as RebalanceBody;
    const { recommendations } = body;

    if (!Array.isArray(recommendations)) {
      return NextResponse.json(
        { message: 'Invalid payload: recommendations must be an array' },
        { status: 400 }
      );
    }

    await new Promise<void>((r) => setTimeout(r, 200));

    const reviewedAt = new Date().toISOString();

    return NextResponse.json(
      {
        message: 'Rebalancing marked as reviewed',
        clientId: id,
        status: 'reviewed',
        reviewedAt,
        actionsCount: recommendations.length,
        recommendations,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
