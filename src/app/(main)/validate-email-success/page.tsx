'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidateEmailSuccess() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    if (countdown === 0) {
      router.replace('/auth/v1/login');
    }

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="container  mx-auto  min-h-screen w-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Your email has been validated</h2>
      <p className="text-sm text-gray-500">
        You will be redirected to the login page in {countdown} seconds.
      </p>
      <Button>
        <Link href="/auth/v1/login">Go to Login</Link>
      </Button>
    </div>
  );
}
