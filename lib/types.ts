export interface User {
  id: string;
  name: string;
  email: string;
  role: 'diretor' | 'gerente' | 'corretor';
  manager_id?: string; // ID do gerente/diretor responsável
  created_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  funnel_status: 'Contato' | 'Diagnóstico' | 'Agendado' | 'Visitado' | 'Proposta' | 'Contrato';
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string; // Corretor responsável
  property_of_interest_id?: string;
  property_of_interest?: Property;
  property_title?: string;
  property_address?: string;
  property_price?: number;
  assigned_user?: User; // Dados do corretor responsável
}

export interface ClientNote {
  id: string;
  client_id: string;
  user_id: string;
  note: string;
  created_at: string;
  user_name: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  address?: string;
  price?: number;
  type: string;
  status: 'Disponível' | 'Reservado' | 'Vendido';
  created_at: string;
  user_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateClientData {
  full_name: string;
  phone?: string;
  email?: string;
  funnel_status?: string;
  notes?: string;
  property_of_interest_id?: string;
  user_id?: string; // Corretor responsável
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'diretor' | 'gerente' | 'corretor';
  manager_id?: string;
}

export interface CreatePropertyData {
  title: string;
  description?: string;
  address?: string;
  price?: number;
  type: string;
  status?: string;
}

export const FUNNEL_STAGES = [
  'Contato',
  'Diagnóstico', 
  'Agendado',
  'Visitado',
  'Proposta',
  'Contrato'
] as const;

export const PROPERTY_TYPES = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Terreno',
  'Comercial'
] as const;

export const PROPERTY_STATUS = [
  'Disponível',
  'Reservado', 
  'Vendido'
] as const;

export const USER_ROLES = [
  'diretor',
  'gerente',
  'corretor'
] as const;

export const USER_ROLE_LABELS = {
  diretor: 'Diretor',
  gerente: 'Gerente',
  corretor: 'Corretor'
} as const;
