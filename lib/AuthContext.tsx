'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserTier = 'FREE' | 'VIP' | 'VVIP';

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
    login: (email: string, password?: string, tier?: UserTier) => { success: boolean, message?: string };
    logout: () => void;
    updateTier: (tier: UserTier) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('stock-empire-user');
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = (email: string, password?: string, tier: UserTier = 'FREE') => {
        // 관리자 특수 로그인 처리
        if (email === '66683300hd@gmail.com') {
            if (password !== 'gmlehd05') {
                return { success: false, message: 'Invalid Admin Password' };
            }

            const adminUser: User = {
                id: 'admin_root',
                name: 'Commander Heedong',
                email: email,
                tier: 'VVIP',
                role: 'ADMIN',
                avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=admin`,
            };
            setUser(adminUser);
            localStorage.setItem('stock-empire-user', JSON.stringify(adminUser));
            return { success: true };
        }

        // 일반 사용자 (현재는 비밀번호 없이 로그인 허용하는 Mock 모드)
        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            name: email.split('@')[0],
            email: email,
            tier: tier,
            role: 'USER',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };
        setUser(newUser);
        localStorage.setItem('stock-empire-user', JSON.stringify(newUser));
        return { success: true };
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
