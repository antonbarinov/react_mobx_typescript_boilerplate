import { useEffect } from 'react';
import { EventDOM } from 'declarations/types';

/**
 * Execute callback function when click outside `elemRef`
 */
export default function useOutSideClick(
    elemRef: React.RefObject<HTMLElement>,
    cb: (e: EventDOM) => any,
) {
    useEffect(() => {
        const handleClick = (e: EventDOM) => {
            if (elemRef.current && !elemRef.current.contains(e.target)) cb(e);
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);
}
