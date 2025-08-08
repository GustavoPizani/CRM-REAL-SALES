"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle, Phone, Building, Calendar, User, Plus } from 'lucide-react';
import { Client, ClientNote, FUNNEL_STAGES } from '@/lib/types';

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingClient, setEditingClient] = useState(false);
  const [clientForm, setClientForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    funnel_status: 'Contato',
    notes: ''
  });

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const [clientRes, notesRes] = await Promise.all([
        fetch('/api/clients/mock'),
        fetch(`/api/clients/${clientId}/notes`)
      ]);
      
      const clients = await clientRes.json();
      const clientData = clients.find((c: Client) => c.id === clientId);
      const notesData = await notesRes.json();
      
      if (clientData) {
        setClient(clientData);
        setClientForm({
          full_name: clientData.full_name,
          phone: clientData.phone || '',
          email: clientData.email || '',
          funnel_status: clientData.funnel_status,
          notes: clientData.notes || ''
        });
      }
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAddingNote(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: newNote }),
      });

      if (response.ok) {
        const note = await response.json();
        setNotes(prev => [note, ...prev]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar atualização do cliente
    setEditingClient(false);
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Contato': 'bg-blue-100 text-blue-800',
      'Diagnóstico': 'bg-yellow-100 text-yellow-800',
      'Agendado': 'bg-purple-100 text-purple-800',
      'Visitado': 'bg-orange-100 text-orange-800',
      'Proposta': 'bg-indigo-100 text-indigo-800',
      'Contrato': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cliente não encontrado</h1>
          <Button onClick={() => router.push('/pipeline')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Pipeline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/pipeline')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Pipeline
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.full_name}</h1>
            <p className="text-gray-600">Detalhes e histórico do cliente</p>
          </div>
        </div>
        <div className="flex gap-2">
          {client.phone && (
            <Button
              variant="outline"
              onClick={() => openWhatsApp(client.phone!)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
          <Button
            onClick={() => setEditingClient(!editingClient)}
            className="bg-secondary hover:bg-secondary/90"
          >
            {editingClient ? 'Cancelar' : 'Editar Cliente'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingClient ? (
                <form onSubmit={handleUpdateClient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={clientForm.full_name}
                        onChange={(e) => setClientForm(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="funnel_status">Status</Label>
                      <Select
                        value={clientForm.funnel_status}
                        onValueChange={(value) => setClientForm(prev => ({ ...prev, funnel_status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FUNNEL_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={clientForm.notes}
                      onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingClient(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <p className="font-medium">{client.full_name}</p>
                    </div>
                    <div>
                      <Label>Status no Funil</Label>
                      <Badge className={getStatusColor(client.funnel_status)}>
                        {client.funnel_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefone</Label>
                      <div className="flex items-center gap-2">
                        <p>{client.phone || 'Não informado'}</p>
                        {client.phone && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openWhatsApp(client.phone!)}
                          >
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <p>{client.email || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Corretor Responsável</Label>
                    <p className="font-medium">{client.assigned_user?.name}</p>
                  </div>
                  
                  {client.notes && (
                    <div>
                      <Label>Observações Iniciais</Label>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">{client.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Imóvel de Interesse */}
          {client.property_title && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Imóvel de Interesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">{client.property_title}</h3>
                  {client.property_address && (
                    <p className="text-sm text-gray-600">{client.property_address}</p>
                  )}
                  {client.property_price && (
                    <p className="text-lg font-semibold text-green-600">
                      R$ {client.property_price.toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Interações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Interações
              </CardTitle>
              <CardDescription>
                Todas as anotações e interações com este cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Formulário para nova nota */}
                <form onSubmit={handleAddNote} className="space-y-3">
                  <div>
                    <Label htmlFor="new_note">Nova Anotação</Label>
                    <Textarea
                      id="new_note"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Adicione uma nova anotação sobre este cliente..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newNote.trim() || isAddingNote}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isAddingNote ? 'Adicionando...' : 'Adicionar Anotação'}
                  </Button>
                </form>

                <Separator />

                {/* Lista de notas */}
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma anotação registrada ainda.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{note.user_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(note.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações adicionais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Data de Cadastro</Label>
                <p className="text-sm">
                  {new Date(client.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label>Última Atualização</Label>
                <p className="text-sm">
                  {new Date(client.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label>Total de Anotações</Label>
                <p className="text-sm font-medium">{notes.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => openWhatsApp(client.phone!)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${client.phone}`, '_self')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${client.email}`, '_self')}
              >
                Enviar E-mail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
