import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, context: any) {
    const params = await context.params;
    const id = params?.id;

    if (!id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { userId, userName } = body;

        // Ensure the list exists mapping Express logic
        await prisma.list.upsert({
            where: { id },
            update: {},
            create: {
                id,
                name: '共享列表'
            }
        });

        if (userId && userName) {
            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    name: userName,
                    listId: id,
                },
                create: {
                    id: userId,
                    name: userName,
                    listId: id
                }
            });
        }

        const updatedList = await prisma.list.findUnique({
            where: { id },
            include: {
                restaurants: {
                    include: { tags: true, dishes: true }
                },
                users: true
            }
        });

        if (!updatedList) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        const formattedRestaurants = updatedList.restaurants.map(r => ({
            ...r,
            tags: r.tags.map(t => t.name),
            dishes: r.dishes.map(d => d.name)
        }));

        return NextResponse.json({
            id: updatedList.id,
            name: updatedList.name,
            restaurants: formattedRestaurants,
            users: updatedList.users,
            updatedAt: updatedList.updatedAt.toISOString()
        });

    } catch (error) {
        console.error('Join list error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
