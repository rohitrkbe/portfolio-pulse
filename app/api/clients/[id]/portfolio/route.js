import { NextResponse } from 'next/server';
import { MOCK_PORTFOLIOS } from '@/lib/mockData/portfolios';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';
import { generateRebalancingRecommendations } from '@/lib/rebalancingEngine';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const client = MOCK_CLIENTS.find((c) => c.id === id);
    if (!client) {
      return NextResponse.json({ message: `Client '${id}' not found` }, { status: 404 });
    }

    const portfolio = MOCK_PORTFOLIOS[id];
    if (!portfolio) {
      return NextResponse.json({ message: `Portfolio for client '${id}' not found` }, { status: 404 });
    }

    // Attach rebalancing recommendations if needed
    const recommendations =
      portfolio.rebalancingStatus === 'pending'
        ? generateRebalancingRecommendations(portfolio)
        : [];

    await new Promise((r) => setTimeout(r, 150));

    return NextResponse.json(
      { portfolio: { ...portfolio, client, recommendations } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
