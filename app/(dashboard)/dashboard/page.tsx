"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Calendar, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import { Client } from '@/lib/types';
import { FUNNEL_STAGES } from '@/lib/types';
import { Logo } from '@/components/logo';

interface DashboardStats {
  totalClients: number;
  funnelCounts: Record<string, number>;
  contractsThisYear: number;
  inactiveClients: Client[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    funnelCounts: {},
    contractsThisYear: 0,
    inactiveClients: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/clients/mock');
      const clients: Client[] = await response.json();

      const funnelCounts = FUNNEL_STAGES.reduce((acc, stage) => {
        acc[stage] = clients.filter(client => client.funnel_status === stage).length;
        return acc;
      }, {} as Record<string, number>);

      const contractsThisYear = clients.filter(client => 
        client.funnel_status === 'Contrato' &&
        new Date(client.updated_at).getFullYear() === new Date().getFullYear()
      ).length;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const inactiveClients = clients.filter(client => 
        new Date(client.updated_at) < sevenDaysAgo &&
        client.funnel_status !== 'Contrato'
      ).slice(0, 5);

      setStats({
        totalClients: clients.length,
        funnelCounts,
        contractsThisYear,
        inactiveClients
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Logo size="sm" showText={false} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>
      </div>

      {/* Funil de Vendas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Funil de Vendas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FUNNEL_STAGES.map((stage) => (
            <Card key={stage} className="bg-tertiary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stage}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.funnelCounts[stage] || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Métricas de Desempenho */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Este Ano</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.contractsThisYear}
            </div>
            <p className="text-xs text-muted-foreground">
              Contratos fechados em {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas do Dia</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Agendamentos para hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clientes Inativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Clientes sem atualização há mais de 7 dias
          </CardTitle>
          <CardDescription>
            Clientes que precisam de follow-up
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.inactiveClients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Todos os clientes estão atualizados! 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {stats.inactiveClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{client.full_name}</p>
                    <p className="text-sm text-gray-600">{client.phone}</p>
                    <Badge variant="outline" className="mt-1">
                      {client.funnel_status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {client.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openWhatsApp(client.phone!)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
