import React from 'react';
import HirerDashboard from './HirerDashboard';
import SeekerDashboard from './SeekerDashboard';
import AdminPanel from './AdminPanel';

import { Page } from '../types';

interface DashboardProps {
  user: any;
  onNavigate: (page: Page) => void;
  onViewApplication?: (appId: string) => void;
}

export default function Dashboard({ user, onNavigate, onViewApplication }: DashboardProps) {
  if (user?.role === 'hirer') {
    return <HirerDashboard user={user} onNavigate={onNavigate} onViewApplication={onViewApplication!} />;
  }

  if (user?.role === 'admin') {
    return <AdminPanel onBack={() => onNavigate('landing')} />;
  }

  return <SeekerDashboard user={user} onNavigate={onNavigate} />;
}
