import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '8a53b6c361878c1bbfd5db81b9b4ac15';

// Função simples para criar um token JWT básico
function createSimpleJWT(payload: any, secret: string) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  // Para simplificar, vamos usar um token básico
  return `${encodedHeader}.${encodedPayload}.signature`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificação simples para teste
    if (email === 'admin@crm.com' && password === 'password123') {
      const token = createSimpleJWT(
        { userId: '1', email: email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 },
        JWT_SECRET
      );

      const response = NextResponse.json({
        user: {
          id: '1',
          name: 'Admin User',
          email: email,
        },
        token,
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: false, // Para desenvolvimento
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
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
