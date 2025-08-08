import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Testar conexão básica
    const result = await sql`SELECT NOW() as current_time`;
    
    // Testar se as tabelas existem
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'clients', 'properties')
    `;
    
    // Testar se há usuários
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    
    return NextResponse.json({
      status: 'success',
      database_time: result[0].current_time,
      tables_found: tables.map(t => t.table_name),
      user_count: userCount[0].count,
      environment_vars: {
        has_database_url: !!process.env.DATABASE_URL,
        has_jwt_secret: !!process.env.JWT_SECRET,
        jwt_secret_length: process.env.JWT_SECRET?.length || 0
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      environment_vars: {
        has_database_url: !!process.env.DATABASE_URL,
        has_jwt_secret: !!process.env.JWT_SECRET,
        jwt_secret_length: process.env.JWT_SECRET?.length || 0
      }
    }, { status: 500 });
  }
}
