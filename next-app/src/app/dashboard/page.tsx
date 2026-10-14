'use client';
import Shell from '@/components/Shell';
import { useApp } from '@/lib/context';
import OwnerDashboardView from '@/components/OwnerDashboardView';
import CashierDashboardView from '@/components/CashierDashboardView';

export default function DashboardPage() {
  const { role } = useApp();
  return (
    <Shell>
      {role === 'owner' ? <OwnerDashboardView /> : <CashierDashboardView />}
    </Shell>
  );
}
