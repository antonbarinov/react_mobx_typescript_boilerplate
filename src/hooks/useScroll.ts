import React, { useEffect } from 'react';
import { EventDOM } from 'declarations/types';

/**
 * Handle scroll event on element with helpers calculations
 */
export function useScroll(
    scrollContainerRef: React.RefObject<HTMLElement>,
    cb: (e?: EventDOM, maxScrollTop?: number, scrollTop?: number) => any,
) {
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        const handleScroll = (e: EventDOM) => {
            const target = e.target;
            const { scrollTop } = target;
            const maxScrollTop = target.scrollHeight - target.offsetHeight;

            cb(e, maxScrollTop, scrollTop);
        };

        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);
}
