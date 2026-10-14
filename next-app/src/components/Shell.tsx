'use client';
import Sidebar from '@/components/Sidebar';
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] md:flex bg-[#F7F6F3]">
      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
