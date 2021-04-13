import React, { useEffect, useRef } from 'react';

interface ISvgIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    icon: string;
    color: string;
}

export const SvgIcon = (props: ISvgIconProps) => {
    const { color, icon, ...rest } = props;
    const iconRef = useRef<HTMLSpanElement>();

    useEffect(() => {
        getAllDomElementChildren(iconRef.current, (el) => {
            const element = el as HTMLElement;
            const styles = getComputedStyle(el);
            const currentStroke = styles.getPropertyValue('stroke');
            const currentFill = styles.getPropertyValue('fill');

            if (currentStroke !== 'none' && currentStroke !== '') {
                element.style.stroke = color;
            }

            if (currentFill !== 'none' && currentFill !== '') {
                element.style.fill = color;
            }
        });
    }, [color]);

    return <span ref={iconRef} dangerouslySetInnerHTML={{ __html: icon }} {...rest} />;
};

function getAllDomElementChildren(el: Element, cb: (el: Element) => any) {
    for (let i = 0; i < el.children.length; i++) {
        const element = el.children[i];
        if (element.children.length) {
            getAllDomElementChildren(element, cb);
        }

        cb(element);
    }
}
