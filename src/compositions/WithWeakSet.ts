export class WithWeakSet {
    set = new WeakSet<HTMLElement>();

    addRef = (ref: HTMLElement) => {
        if (ref !== null) {
            this.set.add(ref);
        }
    };
}
