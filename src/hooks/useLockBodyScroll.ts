import { useLayoutEffect } from 'react';

/**
 * On component mount set body overflow to 'hidden'
 *
 * On component unmount return original body overflow
 */
export function useLockBodyScroll() {
    useLayoutEffect(() => {
        // Get original body overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';
        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);
}
