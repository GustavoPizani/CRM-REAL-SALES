import { NextResponse } from 'next/server';

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@crm.com',
    role: 'diretor',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'João Gerente',
    email: 'joao.gerente@crm.com',
    role: 'gerente',
    manager_id: '1',
    created_at: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    name: 'Maria Gerente',
    email: 'maria.gerente@crm.com',
    role: 'gerente',
    manager_id: '1',
    created_at: '2024-01-03T10:00:00Z'
  },
  {
    id: '4',
    name: 'Pedro Corretor',
    email: 'pedro.corretor@crm.com',
    role: 'corretor',
    manager_id: '2',
    created_at: '2024-01-04T10:00:00Z'
  },
  {
    id: '5',
    name: 'Ana Corretor',
    email: 'ana.corretor@crm.com',
    role: 'corretor',
    manager_id: '2',
    created_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '6',
    name: 'Carlos Corretor',
    email: 'carlos.corretor@crm.com',
    role: 'corretor',
    manager_id: '3',
    created_at: '2024-01-06T10:00:00Z'
  }
];

export async function GET() {
  return NextResponse.json(mockUsers);
}
