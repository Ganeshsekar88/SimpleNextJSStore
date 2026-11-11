'use client';

import { useEffect, useState } from 'react';

function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? '2026'}</>;
}

export default CurrentYear;