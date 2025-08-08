import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sql } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    throw new Error('Token não encontrado');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request);
    const data = await request.json();
    const { id } = params;

    const { title, description, address, price, type, status } = data;

    const result = await sql`
      UPDATE properties 
      SET 
        title = ${title},
        description = ${description || null},
        address = ${address || null},
        price = ${price || null},
        type = ${type},
        status = ${status}
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar propriedade' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserFromToken(request);
    const { id } = params;

    const result = await sql`
      DELETE FROM properties 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Propriedade não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Propriedade removida com sucesso' });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json(
      { error: 'Erro ao remover propriedade' },
      { status: 500 }
    );
  }
}
