"use client";

import { useEffect, useState } from "react";

export function TimestampDisplay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a stable value during SSR and initial hydration
  const timestamp = mounted ? new Date().toISOString() : "Loading...";

  return (
    <div className="inline-block bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg min-h-[40px]">
      <p className="text-sm text-blue-900 dark:text-blue-100">
        <strong>Current Time:</strong> {timestamp}
      </p>
    </div>
  );
}
