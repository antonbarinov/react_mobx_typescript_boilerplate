import React, { useEffect } from 'react';

// how much we need to swipe to trigger cb
export const minSwipeOffset = 100;

/**
 * Swipe
 */
export function useSwipe(
    elRef: React.RefObject<HTMLElement>,
    direction: 'up' | 'down' | 'left' | 'right',
    cb: (e: TouchEvent) => any,
) {
    useEffect(() => {
        const el = elRef.current;

        let startX = 0;
        let startY = 0;
        let cbFires = false;

        const wrappedCb = (e: TouchEvent) => {
            if (cbFires) return;
            cbFires = true;
            cb(e);
        };

        function handleStart(e: TouchEvent) {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            cbFires = false;
        }

        function handleMove(e: TouchEvent) {
            const x = e.changedTouches[0].pageX;
            const y = e.changedTouches[0].pageY;

            const xDiff = x - startX;
            const yDiff = y - startY;

            if (direction === 'right' && xDiff > 0 && xDiff >= minSwipeOffset) wrappedCb(e);
            if (direction === 'left' && xDiff < 0 && xDiff * -1 >= minSwipeOffset) wrappedCb(e);

            if (direction === 'up' && yDiff < 0 && yDiff * -1 >= minSwipeOffset) wrappedCb(e);
            if (direction === 'down' && yDiff > 0 && yDiff >= minSwipeOffset) wrappedCb(e);
        }

        el.addEventListener('touchstart', handleStart, false);
        el.addEventListener('touchmove', handleMove, false);

        return () => {
            el.removeEventListener('touchstart', handleStart, false);
            el.removeEventListener('touchmove', handleMove, false);
        };
    }, []);
}
