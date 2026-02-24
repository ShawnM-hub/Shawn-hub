import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, restaurants = [], users = [] } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing list ID' }, { status: 400 });
    }

    // 1. Ensure all restaurants exist in DB before linking
    for (const r of restaurants) {
      await prisma.restaurant.upsert({
        where: { id: r.id },
        update: {
          name: r.name,
          address: r.address,
          lat: r.lat || 0,
          lng: r.lng || 0,
          avgPrice: r.avgPrice,
          rating: r.rating,
          imageUrl: r.imageUrl,
          source: r.source,
        },
        create: {
          id: r.id,
          name: r.name || 'Unknown',
          address: r.address || '',
          lat: r.lat || 0,
          lng: r.lng || 0,
          avgPrice: r.avgPrice,
          rating: r.rating,
          imageUrl: r.imageUrl,
          source: r.source,
        }
      });
    }

    // 2. Upsert the List and link restaurants
    const list = await prisma.list.upsert({
      where: { id },
      update: {
        name: name,
        restaurants: {
          // Sync relation: set matches the exact array passed
          set: restaurants.map((r: any) => ({ id: r.id }))
        }
      },
      create: {
        id,
        name: name || '新共享列表',
        restaurants: {
          connect: restaurants.map((r: any) => ({ id: r.id }))
        }
      },
      include: {
        restaurants: {
          include: { tags: true, dishes: true }
        },
        users: true
      }
    });

    // We format tags and dishes to string arrays to match frontend's expected format
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
    console.error('Create list error:', error);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}
