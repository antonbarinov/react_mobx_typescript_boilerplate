import { WithBooleanFlag } from 'compositions/WithBooleanFlag';

export function sleep(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function cn(classesObj = {}) {
    const result = [];
    for (const [className, value] of Object.entries(classesObj)) {
        if (value) result.push(className);
    }
    return result.join(' ');
}

export function closest(currentElem: HTMLElement, elemToFind: HTMLElement) {
    if (currentElem === elemToFind) return true;

    let parent = elemToFind.parentNode;
    while (parent) {
        if (parent === currentElem) return true;

        parent = parent.parentNode;
    }

    return false;
}

export function bind<T extends Function>(
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> | void {
    if (!descriptor || typeof descriptor.value !== 'function') {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }

    return {
        configurable: true,
        get(this: T): T {
            const bound: T = descriptor.value!.bind(this);
            // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true,
            });
            return bound;
        },
    };
}

export function isTargetInWeakSet(weakSet: WeakSet<any>, target: any) {
    if (weakSet.has(target)) return true;

    let parent = target.parentNode;
    while (parent) {
        if (weakSet.has(parent)) return true;

        parent = parent.parentNode;
    }

    return false;
}

export function numberFormat(number: number, thousandsSeparator = ' ', decimals = 3, decPoint = '.') {
    const floatedNumber = parseFloat(number + '');
    if (isNaN(floatedNumber)) return NaN;

    const numChunks = floatedNumber.toString().split('.');

    let integerNumberString = numChunks[0];
    let decimalNumberString = numChunks[1];
    let formattedNumberArray = [];

    while (integerNumberString.length > 0) {
        let sliceLength = integerNumberString.length;
        if (sliceLength > 3) sliceLength = 3;
        formattedNumberArray.push(integerNumberString.slice(sliceLength * -1));
        integerNumberString = integerNumberString.slice(0, sliceLength * -1);
    }

    let resultNumber = formattedNumberArray.reverse().join(thousandsSeparator);

    if (decimalNumberString && decimals > 0) {
        resultNumber += decPoint + decimalNumberString.slice(0, decimals);
    }

    return resultNumber;
}

/**
 * Get absolute element position X, Y from document.body
 */
export function getScreenCoordinates(el: HTMLElement) {
    const position = {
        x: el.offsetLeft,
        y: el.offsetTop,
    };

    let parent = el.offsetParent as HTMLElement;

    while (parent) {
        position.x += parent.offsetLeft;
        position.y += parent.offsetTop;
        if (parent == document.body) {
            break;
        } else {
            parent = parent.offsetParent as HTMLElement;
        }
    }

    return position;
}

export function getBool(bool: WithBooleanFlag | boolean) {
    if (bool instanceof WithBooleanFlag) {
        return bool.value;
    } else {
        return bool;
    }
}
