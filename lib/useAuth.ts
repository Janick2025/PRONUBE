'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nombre: string;
  cedula: string;
  email?: string;
  role: 'ADMIN' | 'USUARIO' | 'VISUALIZADOR';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login');
    }
  };

  const requireRole = (roles: string[]) => {
    if (!loading && (!user || !roles.includes(user.role))) {
      router.push('/');
    }
  };

  return { user, loading, logout, requireAuth, requireRole };
}
