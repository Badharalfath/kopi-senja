import Header from '@/components/Header';
import { AppProvider } from '@/lib/context';
import './globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-[100dvh] bg-[#F7F6F3]">
        {children}
      </div>
    </AppProvider>
  );
}
