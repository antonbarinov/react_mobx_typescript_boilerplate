type anyFunction = (...args: any[]) => any;

const rcMap = new WeakMap();

export function noRaceCondition(functionLink: anyFunction): () => boolean {
    const counter = rcMap.get(functionLink) || 0;
    const currentCounter = counter + 1;
    rcMap.set(functionLink, currentCounter);

    return () => {
        return rcMap.get(functionLink) === currentCounter;
    };
}

const debounceMap = new WeakMap();

export function debouncer(functionLink: anyFunction): (delayInMs: number) => Promise<boolean> {
    const counter = debounceMap.get(functionLink) || 0;
    const currentValue = counter + 1;
    debounceMap.set(functionLink, currentValue);

    return (delayInMs = 300) => new Promise((resolve) => {
        setTimeout(() => {
            resolve(currentValue === debounceMap.get(functionLink));
        }, delayInMs);
    });
}
