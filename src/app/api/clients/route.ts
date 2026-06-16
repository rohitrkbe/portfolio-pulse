import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';
import type { Client } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const riskProfile = searchParams.get('riskProfile');
    const requiresRebalancing = searchParams.get('requiresRebalancing');

    let clients: Client[] = [...MOCK_CLIENTS] as Client[];

    if (riskProfile && riskProfile !== 'All') {
      clients = clients.filter((c) => c.riskProfile === riskProfile);
    }

    if (requiresRebalancing === 'true') {
      clients = clients.filter((c) => c.requiresRebalancing);
    }

    await new Promise<void>((r) => setTimeout(r, 120));

    return NextResponse.json({ clients, total: clients.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
