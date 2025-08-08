import { NextResponse } from 'next/server';

const mockProperties = [
  {
    id: '1',
    title: 'Apartamento 3 quartos Itaim Bibi',
    description: 'Apartamento moderno com 3 quartos, 2 banheiros e varanda',
    address: 'Rua Joaquim Floriano, 1000 - Itaim Bibi, São Paulo',
    price: 850000,
    type: 'Apartamento',
    status: 'Disponível',
    created_at: '2024-01-15T10:00:00Z',
    user_id: '1'
  },
  {
    id: '2',
    title: 'Casa 4 quartos Vila Madalena',
    description: 'Casa térrea com quintal e garagem para 2 carros',
    address: 'Rua Harmonia, 500 - Vila Madalena, São Paulo',
    price: 1200000,
    type: 'Casa',
    status: 'Disponível',
    created_at: '2024-01-14T10:00:00Z',
    user_id: '1'
  },
  {
    id: '3',
    title: 'Cobertura Jardins',
    description: 'Cobertura duplex com terraço e piscina',
    address: 'Alameda Santos, 2000 - Jardins, São Paulo',
    price: 2500000,
    type: 'Cobertura',
    status: 'Reservado',
    created_at: '2024-01-13T10:00:00Z',
    user_id: '1'
  }
];

export async function GET() {
  return NextResponse.json(mockProperties);
}
