import React from 'react';

interface KpiTilesProps {
  data: {
    active_students?: number;
    hours?: number;
    avg_score?: number;
    low_mastery?: number;
  };
}

export function KpiTiles({ data }: KpiTilesProps) {
  const card = "edge flex flex-col p-5 gap-1 w-full";
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className={card}>
        <span className="text-sm">Progress</span>
        <span className="text-2xl font-bold">
          {data.low_mastery ? `${Math.round((1 - data.low_mastery) * 100)}%` : '—'}
        </span>
      </div>
      <div className={card}>
        <span className="text-sm">Session Hours</span>
        <span className="text-2xl font-bold">
          {data.hours ? `${Math.round(data.hours / 3600)}h` : '—'}
        </span>
      </div>
      <div className={card}>
        <span className="text-sm">Completion</span>
        <span className="text-2xl font-bold">
          {data.avg_score ? `${Math.round(data.avg_score)}%` : '—'}
        </span>
      </div>
      <div className={card}>
        <span className="text-sm">Active Students</span>
        <span className="text-2xl font-bold">
          {data.active_students || '—'}
        </span>
      </div>
    </div>
  );
} 