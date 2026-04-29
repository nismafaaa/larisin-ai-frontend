import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${UPSTREAM}/${path.join('/')}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      // cache for 1 hour on the edge — province/regency data rarely changes
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Upstream error', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wilayah data' }, { status: 502 });
  }
}
