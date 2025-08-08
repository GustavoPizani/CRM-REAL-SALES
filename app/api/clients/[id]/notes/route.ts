import { NextRequest, NextResponse } from 'next/server';

// Mock data para notas
const mockNotes = [
  {
    id: '1',
    client_id: '1',
    user_id: '4',
    user_name: 'Pedro Corretor',
    note: 'Cliente demonstrou interesse em apartamentos com varanda. Prefere região do Itaim Bibi.',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    client_id: '1',
    user_id: '4',
    user_name: 'Pedro Corretor',
    note: 'Agendada visita para próxima terça-feira às 15h. Cliente confirmou presença.',
    created_at: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    client_id: '2',
    user_id: '4',
    user_name: 'Pedro Corretor',
    note: 'Cliente tem orçamento de até R$ 1.5M. Procura casa com quintal para os filhos.',
    created_at: '2024-01-14T11:00:00Z'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const clientNotes = mockNotes.filter(note => note.client_id === id);
  return NextResponse.json(clientNotes);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { note } = await request.json();
  
  const newNote = {
    id: Date.now().toString(),
    client_id: id,
    user_id: '1', // Mock user
    user_name: 'Admin User',
    note,
    created_at: new Date().toISOString()
  };
  
  return NextResponse.json(newNote, { status: 201 });
}
