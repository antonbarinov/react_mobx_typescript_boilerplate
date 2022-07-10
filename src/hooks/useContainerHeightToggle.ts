import React, { useCallback, useEffect, useRef, useState } from 'react';

/*
CSS styles for containerRef:
transition: max-height .3s ease;
max-height: 0;
overflow: hidden;
 */
export function useContainerHeightToggle(containerRef: React.MutableRefObject<HTMLDivElement>, initialOpened = false): [() => void, boolean] {
    const [opened, setOpened] = useState(initialOpened);
    const ref = useRef({ opened: initialOpened });

    useEffect(() => {
        const el = containerRef.current;

        function onTransitionEnd() {
            if (ref.current.opened) {
                el.style.maxHeight = 'none';
            }
        }

        if (el) {
            el.addEventListener('transitionend', onTransitionEnd);
        }

        return () => {
            el && el.removeEventListener('transitionend', onTransitionEnd);
        };
    }, [containerRef.current]);

    const toggleHeightFn = useCallback(() => {
        const el = containerRef.current;

        if (ref.current.opened) {
            el.style.maxHeight = el.clientHeight + 'px';
            el.clientHeight; // Read this param, to make browser do recalc
            el.style.maxHeight = '';
        } else {
            el.style.overflowY = 'auto';
            const { scrollHeight, clientHeight } = el;
            el.style.overflowY = '';

            el.style.maxHeight = scrollHeight + clientHeight + 'px';
        }

        setOpened(!opened);
        ref.current.opened = !opened;
    }, [opened]);

    return [toggleHeightFn, opened];
}
