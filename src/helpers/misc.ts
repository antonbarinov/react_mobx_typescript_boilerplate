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

export function сlosest(currentElem: HTMLElement, elemToFind: HTMLElement) {
    if (currentElem === elemToFind) return true;

    let parent = currentElem.parentNode;
    while (parent) {
        if (parent === elemToFind) return true;

        parent = parent.parentNode;
    }

    return false;
}