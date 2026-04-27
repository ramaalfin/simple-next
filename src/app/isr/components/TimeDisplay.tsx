'use client';

import { useEffect, useState } from 'react';

export function TimeDisplay() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    // Diatur di client untuk menghindari hydration mismatch dan build errors di Next.js 15+
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (!time) return <span className="opacity-0">00:00:00</span>;

  return <strong>{time}</strong>;
}
