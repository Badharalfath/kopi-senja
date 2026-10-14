'use client';
import Link from 'next/link';

export default function EmptyState({
  title,
  desc,
  actionHref,
  actionLabel,
}: {
  title: string;
  desc: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-black/15 p-10 text-center">
      <div aria-hidden className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-[#F7F6F3] border border-black/[0.06] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-stone-500 mt-1 max-w-[320px] mx-auto leading-relaxed">{desc}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="btn-press inline-block mt-5 px-6 py-2.5 rounded-full bg-[#111] text-white text-sm font-semibold min-h-[44px]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
