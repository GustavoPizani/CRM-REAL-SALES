import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sql } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '8a53b6c361878c1bbfd5db81b9b4ac15';

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Configuração do banco de dados não encontrada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('Attempting login for:', email);

    // Para teste inicial, vamos usar verificação simples
    // Em produção, você deve usar hash de senha adequado
    if (email === 'admin@crm.com' && password === 'password123') {
      // Create JWT token
      const token = jwt.sign(
        { userId: '1', email: email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        user: {
          id: '1',
          name: 'Admin User',
          email: email,
        },
        token,
      });

      // Set HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
