import { NextResponse } from 'next/server';
import { MOCK_PERFORMANCE } from '@/lib/mockData/performance';
import { MOCK_CLIENTS } from '@/lib/mockData/clients';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const client = MOCK_CLIENTS.find((c) => c.id === id);
    if (!client) {
      return NextResponse.json({ message: `Client '${id}' not found` }, { status: 404 });
    }

    const performance = MOCK_PERFORMANCE[id];
    if (!performance) {
      return NextResponse.json(
        { message: `Performance data for client '${id}' not found` },
        { status: 404 }
      );
    }

    await new Promise((r) => setTimeout(r, 100));

    return NextResponse.json({ performance }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
