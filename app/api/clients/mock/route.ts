import { NextResponse } from 'next/server';

// Dados mock para teste com hierarquia
const mockClients = [
  {
    id: '1',
    full_name: 'João Silva',
    phone: '11999887766',
    email: 'joao@email.com',
    funnel_status: 'Contato',
    notes: 'Cliente interessado em apartamento no Itaim',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user_id: '4', // Pedro Corretor
    property_of_interest_id: '1',
    property_title: 'Apartamento 3 quartos Itaim Bibi',
    property_address: 'Rua Joaquim Floriano, 1000 - Itaim Bibi, São Paulo',
    property_price: 850000,
    assigned_user: {
      id: '4',
      name: 'Pedro Corretor',
      role: 'corretor'
    }
  },
  {
    id: '2',
    full_name: 'Maria Santos',
    phone: '11988776655',
    email: 'maria@email.com',
    funnel_status: 'Diagnóstico',
    notes: 'Procura casa com quintal, orçamento até 1.5M',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    user_id: '4', // Pedro Corretor
    property_of_interest_id: '2',
    property_title: 'Casa 4 quartos Vila Madalena',
    property_address: 'Rua Harmonia, 500 - Vila Madalena, São Paulo',
    property_price: 1200000,
    assigned_user: {
      id: '4',
      name: 'Pedro Corretor',
      role: 'corretor'
    }
  },
  {
    id: '3',
    full_name: 'Pedro Oliveira',
    phone: '11977665544',
    email: 'pedro@email.com',
    funnel_status: 'Agendado',
    notes: 'Visita agendada para sábado às 14h',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
    user_id: '5', // Ana Corretor
    property_of_interest_id: null,
    property_title: null,
    property_address: null,
    property_price: null,
    assigned_user: {
      id: '5',
      name: 'Ana Corretor',
      role: 'corretor'
    }
  },
  {
    id: '4',
    full_name: 'Ana Costa',
    phone: '11966554433',
    email: 'ana@email.com',
    funnel_status: 'Visitado',
    notes: 'Gostou do apartamento, aguardando proposta',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    user_id: '5', // Ana Corretor
    property_of_interest_id: '1',
    property_title: 'Apartamento 3 quartos Itaim Bibi',
    property_address: 'Rua Joaquim Floriano, 1000 - Itaim Bibi, São Paulo',
    property_price: 850000,
    assigned_user: {
      id: '5',
      name: 'Ana Corretor',
      role: 'corretor'
    }
  },
  {
    id: '5',
    full_name: 'Carlos Ferreira',
    phone: '11955443322',
    email: 'carlos@email.com',
    funnel_status: 'Proposta',
    notes: 'Proposta enviada, aguardando resposta',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
    user_id: '6', // Carlos Corretor
    property_of_interest_id: '3',
    property_title: 'Cobertura Jardins',
    property_address: 'Alameda Santos, 2000 - Jardins, São Paulo',
    property_price: 2500000,
    assigned_user: {
      id: '6',
      name: 'Carlos Corretor',
      role: 'corretor'
    }
  }
];

export async function GET() {
  return NextResponse.json(mockClients);
}
