import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PORTFOLIOS } from '@/lib/mockData/portfolios';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';
import { generateRebalancingRecommendations } from '@/lib/rebalancingEngine';
import type { MockPortfolioData } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;

    const client = MOCK_CLIENTS.find((c) => c.id === id);
    if (!client) {
      return NextResponse.json({ message: `Client '${id}' not found` }, { status: 404 });
    }

    const portfolioData = (MOCK_PORTFOLIOS as Record<string, MockPortfolioData | undefined>)[id];
    if (!portfolioData) {
      return NextResponse.json({ message: `Portfolio for client '${id}' not found` }, { status: 404 });
    }

    const recommendations =
      portfolioData.rebalancingStatus === 'pending'
        ? generateRebalancingRecommendations(portfolioData)
        : [];

    await new Promise<void>((r) => setTimeout(r, 150));

    return NextResponse.json(
      { portfolio: { ...portfolioData, client, recommendations } as unknown },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
