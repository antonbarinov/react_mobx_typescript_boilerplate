import { useLayoutEffect } from 'react';

/**
 * On component mount set body overflow to 'hidden'
 *
 * On component unmount return original body overflow
 */
export function useLockBodyScroll() {
    useLayoutEffect(() => {
        const scrollTop = window.pageYOffset || window.scrollY;
        // Get original body overflow
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.bottom = '0';
        document.body.style.top = (scrollTop * -1) + 'px';
        // Re-enable scrolling when component unmounts

        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.position = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.top = '';
            document.body.style.bottom = '';

            window.scrollTo(0, scrollTop);
        };
    }, []);
}
