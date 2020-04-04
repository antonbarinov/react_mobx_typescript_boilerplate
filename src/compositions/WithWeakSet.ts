export class WithWeakSet {
    set = new WeakSet();

    addRef = (ref: any) => {
        if (ref !== null) {
            this.set.add(ref);
        }
    };
}
