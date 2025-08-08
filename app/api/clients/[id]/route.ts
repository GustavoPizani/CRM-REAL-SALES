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

    const { full_name, phone, email, funnel_status, notes, property_of_interest_id } = data;

    const result = await sql`
      UPDATE clients 
      SET 
        full_name = ${full_name},
        phone = ${phone || null},
        email = ${email || null},
        funnel_status = ${funnel_status},
        notes = ${notes || null},
        property_of_interest_id = ${property_of_interest_id || null},
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
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
      DELETE FROM clients 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json(
      { error: 'Erro ao remover cliente' },
      { status: 500 }
    );
  }
}
