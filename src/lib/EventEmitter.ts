type FN = () => Promise<any> | any;

export class EventEmitter {
    events: { [k: string]: Set<any> } = {};
    logEmits: boolean = false;
    on: (eventName: string | string[], fn: FN) => void;
    off: (eventName: string | string[], fn: FN) => void;

    constructor() {
        this.on = this.subscribe;
        this.off = this.unsubscribe;
    }

    // eventName can be also array of event names
    emit(eventName: string | string[], ...restParams) {
        let eventNames = eventName;
        if (!Array.isArray(eventName)) eventNames = [eventName];

        for (const eventName of eventNames) {
            const events = this.events[eventName];

            if (this.logEmits) {
                let subscribersCount = 0;
                if (events) subscribersCount = events.size;

                console.log(`EventEmitter emits: "${eventName}", subscribers: ${subscribersCount}`);
            }

            if (events) {
                events.forEach((fn) => {
                    fn.call(null, ...restParams);
                });
            }
        }
    }

    // eventName can be also array of event names
    subscribe(eventName: string | string[], fn: FN) {
        let eventNames = eventName;
        if (!Array.isArray(eventName)) eventNames = [eventName];

        for (const eventName of eventNames) {
            if (!this.events[eventName]) {
                this.events[eventName] = new Set();
            }

            const events = this.events[eventName];

            events.add(fn);
        }

        // or use unsubscribe function
        return this.unsubscribe.bind(this, eventName, fn);
    }

    // eventName can be also array of event names
    unsubscribe(eventName: string | string[], fn: FN) {
        let eventNames = eventName;
        if (!Array.isArray(eventName)) eventNames = [eventName];

        for (const eventName of eventNames) {
            const events = this.events[eventName];

            if (events) events.delete(fn);
        }
    }
}

export const globalEventEmitter = new EventEmitter();
