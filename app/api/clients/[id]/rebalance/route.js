import { NextResponse } from 'next/server';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const client = MOCK_CLIENTS.find((c) => c.id === id);
    if (!client) {
      return NextResponse.json({ message: `Client '${id}' not found` }, { status: 404 });
    }

    const body = await request.json();
    const { recommendations } = body;

    if (!Array.isArray(recommendations)) {
      return NextResponse.json(
        { message: 'Invalid payload: recommendations must be an array' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 200));

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
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
