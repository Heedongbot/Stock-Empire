'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

type UserTier = 'FREE' | 'PRO';

interface User {
    id: string;
    name: string;
    email: string;
    tier: UserTier;
    role: 'USER' | 'ADMIN';
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    login: (tier?: UserTier) => void;
    logout: () => void;
    updateTier: (tier: UserTier) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const clerk = useClerk();
    const [localTier, setLocalTier] = useState<UserTier>('FREE');

    // Persist tier in local storage for demo purposes (hybrid approach)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTier = localStorage.getItem('stock-empire-tier');
            if (savedTier) setLocalTier(savedTier as UserTier);
        }
    }, []);

    const user: User | null = isSignedIn && clerkUser ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || 'Investor',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        // Use local tier override OR metadata if available (future proofing)
        tier: localTier,
        role: clerkUser.publicMetadata.role as 'ADMIN' | 'USER' || 'USER',
        avatar: clerkUser.imageUrl,
    } : null;

    // 특수 계정 권한 설정 (Special Account Permissions)
    if (user) {
        if (user.email === '66683300hd@gmail.com') {
            user.role = 'ADMIN';
            user.tier = 'PRO';
        } else if (user.email === 'lgh425@gmail.com') {
            user.role = 'USER';
            user.tier = 'PRO';
        }
    }

    const login = (tier?: UserTier) => {
        // Redirect to Clerk Sign In
        clerk.openSignIn();
    };

    const logout = () => {
        clerk.signOut();
        localStorage.removeItem('stock-empire-tier');
        setLocalTier('FREE');
    };

    const updateTier = (tier: UserTier) => {
        setLocalTier(tier);
        localStorage.setItem('stock-empire-tier', tier);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateTier, isLoading: !isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
