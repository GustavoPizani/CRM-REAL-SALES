"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MessageCircle, Building, Eye, Filter, Search } from 'lucide-react';
import { Client, Property, User, FUNNEL_STAGES } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';

export default function PipelinePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedUserFilter, setAssignedUserFilter] = useState('');
  const [newClient, setNewClient] = useState({
    full_name: '',
    phone: '',
    email: '',
    funnel_status: 'Contato',
    notes: '',
    property_of_interest_id: '',
    user_id: user?.role === 'corretor' ? user.id : ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, propertiesRes, usersRes] = await Promise.all([
        fetch('/api/clients/mock'),
        fetch('/api/properties/mock'),
        fetch('/api/users/mock')
      ]);
      
      const clientsData = await clientsRes.json();
      const propertiesData = await propertiesRes.json();
      const usersData = await usersRes.json();
      
      // Filtrar clientes baseado na hierarquia
      const filteredClients = filterClientsByHierarchy(clientsData, user, usersData);
      
      setClients(filteredClients);
      setProperties(propertiesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClientsByHierarchy = (clients: Client[], currentUser: User | null, allUsers: User[]) => {
    if (!currentUser) return [];

    if (currentUser.role === 'diretor') {
      // Diretor vê todos os clientes
      return clients;
    } else if (currentUser.role === 'gerente') {
      // Gerente vê clientes dos seus corretores
      const subordinateIds = allUsers
        .filter(u => u.manager_id === currentUser.id)
        .map(u => u.id);
      return clients.filter(c => subordinateIds.includes(c.user_id));
    } else {
      // Corretor vê apenas seus próprios clientes
      return clients.filter(c => c.user_id === currentUser.id);
    }
  };

  const getFilteredClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (assignedUserFilter && assignedUserFilter !== "__all__") {
      filtered = filtered.filter(client => client.user_id === assignedUserFilter);
    }

    return filtered;
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as Client['funnel_status'];
    
    try {
      const response = await fetch(`/api/clients/${draggableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clients.find(c => c.id === draggableId),
          funnel_status: newStatus,
        }),
      });

      if (response.ok) {
        setClients(prev => 
          prev.map(client => 
            client.id === draggableId 
              ? { ...client, funnel_status: newStatus }
              : client
          )
        );
      }
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const client = await response.json();
        setClients(prev => [...prev, client]);
        setNewClient({
          full_name: '',
          phone: '',
          email: '',
          funnel_status: 'Contato',
          notes: '',
          property_of_interest_id: '',
          user_id: user?.role === 'corretor' ? user.id : ''
        });
        setShowAddClient(false);
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const getClientsForStage = (stage: string) => {
    return getFilteredClients().filter(client => client.funnel_status === stage);
  };

  const getAvailableUsers = () => {
    if (user?.role === 'diretor') {
      return users.filter(u => u.role === 'corretor');
    } else if (user?.role === 'gerente') {
      return users.filter(u => u.manager_id === user.id);
    } else {
      return users.filter(u => u.id === user?.id);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h1>
          <p className="text-gray-600">Gerencie seus clientes através do funil de vendas</p>
        </div>
        
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  value={newClient.full_name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {(user?.role === 'diretor' || user?.role === 'gerente') && (
                <div>
                  <Label htmlFor="assigned_user">Corretor Responsável</Label>
                  <Select
                    value={newClient.user_id}
                    onValueChange={(value) => setNewClient(prev => ({ ...prev, user_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um corretor" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableUsers().map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="property">Imóvel de Interesse</Label>
                <Select
                  value={newClient.property_of_interest_id || "__none__"}
                  onValueChange={(value) => setNewClient(prev => ({ ...prev, property_of_interest_id: value === "__none__" ? "" : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhum</SelectItem>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newClient.notes}
                  onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Adicione observações sobre o cliente..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddClient(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                  Adicionar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {(user?.role === 'diretor' || user?.role === 'gerente') && (
              <div className="w-48">
                <Select value={assignedUserFilter} onValueChange={setAssignedUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por corretor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Todos os corretores</SelectItem>
                    {getAvailableUsers().map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(searchTerm || assignedUserFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setAssignedUserFilter('');
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto">
          {FUNNEL_STAGES.map((stage) => (
            <div key={stage} className="min-w-[280px]">
              <div className="bg-tertiary text-white p-3 rounded-t-lg">
                <h3 className="font-semibold text-center">{stage}</h3>
                <p className="text-center text-sm opacity-80">
                  {getClientsForStage(stage).length} cliente(s)
                </p>
              </div>
              
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-2 bg-gray-50 rounded-b-lg border-2 border-dashed ${
                      snapshot.isDraggingOver ? 'border-secondary bg-secondary/10' : 'border-gray-200'
                    }`}
                  >
                    {getClientsForStage(stage).map((client, index) => (
                      <Draggable key={client.id} draggableId={client.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 cursor-move ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{client.full_name}</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/client/${client.id}`);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {client.phone && (
                                <p className="text-xs text-gray-600 mb-1">{client.phone}</p>
                              )}
                              
                              {client.assigned_user && (
                                <p className="text-xs text-blue-600 mb-1">
                                  {client.assigned_user.name}
                                </p>
                              )}
                              
                              {client.property_title && (
                                <div className="flex items-center gap-1 mb-2">
                                  <Building className="h-3 w-3 text-gray-500" />
                                  <p className="text-xs text-gray-600 truncate">
                                    {client.property_title}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-xs">
                                  {new Date(client.updated_at).toLocaleDateString('pt-BR')}
                                </Badge>
                                {client.phone && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openWhatsApp(client.phone!);
                                    }}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
