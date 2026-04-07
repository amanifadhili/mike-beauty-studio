'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function ReportFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStart = searchParams.get('start') || '';
  const currentEnd = searchParams.get('end') || '';

  const [start, setStart] = useState(currentStart);
  const [end, setEnd] = useState(currentEnd);

  const applyRange = (s: string, e: string) => {
    setStart(s);
    setEnd(e);
    if (!s || !e) {
      router.push('/admin/reports');
    } else {
      router.push(`/admin/reports?start=${s}&end=${e}`);
    }
  };

  const handleApply = () => {
    if (start && end) {
      router.push(`/admin/reports?start=${start}&end=${end}`);
    }
  };

  const handleClear = () => {
    setStart('');
    setEnd('');
    router.push('/admin/reports');
  };

  // Helper presets
  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    applyRange(firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]);
  };
  
  const setLastMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
    applyRange(firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]);
  };

  const setThisYear = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    applyRange(firstDay.toISOString().split('T')[0], lastDay.toISOString().split('T')[0]);
  };

  return (
    <div className="admin-surface border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end mb-8 shadow-lg">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">Start Date</label>
        <input 
          type="date" 
          value={start} 
          onChange={e => setStart(e.target.value)} 
          className="admin-input px-3 py-2 text-sm bg-black/40 text-white border border-white/10 rounded w-full focus:border-gold outline-none transition-colors"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">End Date</label>
        <input 
          type="date" 
          value={end} 
          onChange={e => setEnd(e.target.value)} 
          className="admin-input px-3 py-2 text-sm bg-black/40 text-white border border-white/10 rounded w-full focus:border-gold outline-none transition-colors"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={handleApply} className="bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide transition-all">
          Apply Filter
        </button>
        <button onClick={handleClear} className="bg-white/5 text-gray-300 hover:text-white border border-transparent hover:border-white/10 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide transition-all">
          Clear
        </button>
      </div>

      <div className="w-px h-8 bg-white/10 hidden md:block mx-2"></div>
      
      <div className="flex gap-2">
        <button onClick={setThisMonth} className="text-xs text-blue-400 hover:text-blue-300 underline tracking-wide font-sans">This Month</button>
        <button onClick={setLastMonth} className="text-xs text-blue-400 hover:text-blue-300 underline tracking-wide font-sans">Last Month</button>
        <button onClick={setThisYear} className="text-xs text-blue-400 hover:text-blue-300 underline tracking-wide font-sans">This Year</button>
      </div>
    </div>
  );
}
