import React, { useEffect } from 'react';
import { EventDOM } from 'declarations/types';

/**
 * Execute callback function when click outside `elemRef`
 */
export function useOutSideClick(elemRef: React.RefObject<HTMLElement> | WeakSet<HTMLElement>, cb: (e: EventDOM) => any) {
    useEffect(() => {
        const handleClick = (e: EventDOM) => {
            if (elemRef instanceof WeakSet) {
                if (elemRef.has(e.target)) return false;

                let parent = e.target.parentNode as HTMLElement;
                while (parent) {
                    if (elemRef.has(parent)) return false;

                    parent = parent.parentNode as HTMLElement;
                }

                cb(e);
            } else {
                if (elemRef.current && !elemRef.current.contains(e.target)) cb(e);
            }
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);
}
