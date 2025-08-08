"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Home, Building, Kanban, Settings, LogOut, Bell, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban },
  { name: 'Imóveis', href: '/properties', icon: Building },
  { name: 'Usuários', href: '/users', icon: Users, roles: ['diretor', 'gerente'] },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role || 'corretor')
  );

  return (
    <div className="bg-primary text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <Logo size="md" showText={true} className="text-white" />
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-white"
                      : "text-gray-300 hover:bg-tertiary hover:text-white"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-tertiary">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">
                {user?.role === 'diretor' ? 'Diretor' : 
                 user?.role === 'gerente' ? 'Gerente' : 'Corretor'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-tertiary hover:text-white"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
