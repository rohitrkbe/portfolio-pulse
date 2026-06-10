import { NextResponse } from 'next/server';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const riskProfile = searchParams.get('riskProfile');
    const requiresRebalancing = searchParams.get('requiresRebalancing');

    let clients = [...MOCK_CLIENTS];

    if (riskProfile && riskProfile !== 'All') {
      clients = clients.filter((c) => c.riskProfile === riskProfile);
    }

    if (requiresRebalancing === 'true') {
      clients = clients.filter((c) => c.requiresRebalancing);
    }

    // Simulate realistic API latency
    await new Promise((r) => setTimeout(r, 120));

    return NextResponse.json(
      { clients, total: clients.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
