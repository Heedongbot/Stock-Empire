'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserTier = 'FREE' | 'VIP' | 'VVIP';

interface User {
    id: string;
    name: string;
    email: string;
    tier: UserTier;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, tier?: UserTier) => void;
    logout: () => void;
    updateTier: (tier: UserTier) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load auth from localStorage on mount
        const savedUser = localStorage.getItem('stock-empire-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, tier: UserTier = 'FREE') => {
        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            name: email.split('@')[0],
            email: email,
            tier: tier,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
        setUser(newUser);
        localStorage.setItem('stock-empire-user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('stock-empire-user');
    };

    const updateTier = (tier: UserTier) => {
        if (user) {
            const updatedUser = { ...user, tier };
            setUser(updatedUser);
            localStorage.setItem('stock-empire-user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateTier, isLoading }}>
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
