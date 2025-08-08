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

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);

    const clients = await sql`
      SELECT 
        c.*,
        p.title as property_title,
        p.address as property_address,
        p.price as property_price
      FROM clients c
      LEFT JOIN properties p ON c.property_of_interest_id = p.id
      WHERE c.user_id = ${userId}
      ORDER BY c.updated_at DESC
    `;

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const data = await request.json();

    const { full_name, phone, email, funnel_status, notes, property_of_interest_id } = data;

    if (!full_name) {
      return NextResponse.json(
        { error: 'Nome completo é obrigatório' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO clients (
        full_name, phone, email, funnel_status, notes, 
        property_of_interest_id, user_id, updated_at
      )
      VALUES (
        ${full_name}, ${phone || null}, ${email || null}, 
        ${funnel_status || 'Contato'}, ${notes || null},
        ${property_of_interest_id || null}, ${userId}, NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    );
  }
}
