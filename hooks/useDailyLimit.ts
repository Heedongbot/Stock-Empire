'use client';

import { useState, useEffect } from 'react';

const DAILY_LIMIT = 3;

export function useDailyLimit() {
    const [count, setCount] = useState(0);
    const [isLimited, setIsLimited] = useState(false);

    useEffect(() => {
        // Reset limit if it's a new day
        const lastDate = localStorage.getItem('stock-empire-last-date');
        const today = new Date().toDateString();

        if (lastDate !== today) {
            localStorage.setItem('stock-empire-limit-count', '0');
            localStorage.setItem('stock-empire-last-date', today);
            setCount(0);
        } else {
            const savedCount = parseInt(localStorage.getItem('stock-empire-limit-count') || '0');
            setCount(savedCount);
            if (savedCount >= DAILY_LIMIT) {
                setIsLimited(true);
            }
        }
    }, []);

    const incrementCount = () => {
        const newCount = count + 1;
        setCount(newCount);
        localStorage.setItem('stock-empire-limit-count', newCount.toString());
        if (newCount >= DAILY_LIMIT) {
            setIsLimited(true);
        }
        return newCount;
    };

    return { count, isLimited, incrementCount, visibleLimit: DAILY_LIMIT };
}
