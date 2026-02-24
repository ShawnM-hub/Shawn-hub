import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, context: any) {
  // Use `await` for dynamic keys in Next.js 15+ if needed, but for robust backwards compat:
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    const list = await prisma.list.findUnique({
      where: { id },
      include: {
        restaurants: {
          include: { tags: true, dishes: true }
        },
        users: true
      }
    });

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const formattedRestaurants = list.restaurants.map(r => ({
      ...r,
      tags: r.tags.map(t => t.name),
      dishes: r.dishes.map(d => d.name)
    }));

    return NextResponse.json({
      id: list.id,
      name: list.name,
      restaurants: formattedRestaurants,
      users: list.users,
      updatedAt: list.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Fetch list error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
