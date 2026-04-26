'use client';

import { useEffect, useState } from 'react';

export function Timestamp() {
  const [timestamp, setTimestamp] = downToHydratedTime();

  function downToHydratedTime() {
    // Memulai dengan null agar sesuai dengan hasil SSR (hydration aman)
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
      setTime(new Date().toLocaleTimeString());
    }, []);

    return [time, setTime] as const;
  }

  if (!timestamp) {
    return <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded"></span>;
  }

  return <span>{timestamp}</span>;
}
