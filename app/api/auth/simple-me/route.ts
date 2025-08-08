import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 401 }
      );
    }

    // Para simplificar, vamos retornar o usuário padrão se o token existir
    return NextResponse.json({
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@crm.com',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }
}
