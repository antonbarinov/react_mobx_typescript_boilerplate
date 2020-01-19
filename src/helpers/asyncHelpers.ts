interface IContextObj {
    [key: string]: any;
    __asyncHelpers?: object;
}

interface IContextHelper {
    value: number;
}

function contextHelper(context: IContextObj, key: string): IContextHelper {
    if (!context.__asyncHelpers) context.__asyncHelpers = {};
    if (!context.__asyncHelpers[key]) context.__asyncHelpers[key] = { value: 0 };

    return context.__asyncHelpers[key];
}

function debounceFunc(context: IContextObj, key: string): (delayInMs?: number) => Promise<boolean> {
    key += '__debounce';
    const contextData = contextHelper(context, key);

    return (delayInMs = 300) => {
        const currentValue = ++contextData.value;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(currentValue === contextData.value);
            }, delayInMs);
        });
    };
}

class CustomError extends Error {
    nonActual = false;
}

function stillActualChecker(context: IContextObj, key: string): () => boolean {
    key += '__stillActualChecker';
    const contextData = contextHelper(context, key);
    const currentValue = ++contextData.value;

    return () => {
        const isActual = currentValue === contextData.value;
        if (!isActual) {
            const err = new CustomError('Not actual any more');
            err.nonActual = true;
            throw err;
        }

        return isActual;
    };
}

/**
 * Don't exec "func" if other "func" in progress yet
 */
export function noRaceConditions(context: IContextObj, key: string, func: () => Promise<any>) {
    (async () => {
        key += '__withOnlyOneInTime';
        const contextData = contextHelper(context, key);
        if (contextData.value === 1) return false;

        contextData.value = 1;

        try {
            await func();
        } catch (e) {
            throw e;
        } finally {
            contextData.value = 0;
        }
    })();
}

interface helperFnProps {
    stillActualCheckpoint: () => boolean;
    debounce: (delayInMs?: number) => Promise<boolean>;
}
type helperFn = (params: helperFnProps) => Promise<any>;
/**
 * Use helpers for typical async operations
 */
export function withAsyncHelpers(context: IContextObj, key: string, func: helperFn): void {
    (async () => {
        const stillActualCheckpoint = stillActualChecker(context, key);
        const debounce = debounceFunc(context, key);

        try {
            await func({
                stillActualCheckpoint,
                debounce,
            });
        } catch (e) {
            if (!e.nonActual) throw e;
        }
    })();
}
