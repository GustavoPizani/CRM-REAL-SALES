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

    const properties = await sql`
      SELECT * FROM properties 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propriedades' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    const data = await request.json();

    const { title, description, address, price, type, status } = data;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Título e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO properties (
        title, description, address, price, type, status, user_id
      )
      VALUES (
        ${title}, ${description || null}, ${address || null}, 
        ${price || null}, ${type}, ${status || 'Disponível'}, ${userId}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar propriedade' },
      { status: 500 }
    );
  }
}
