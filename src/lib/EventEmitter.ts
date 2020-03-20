import { EVENT_EMITTERS_CALLBACKS_PARAMS } from 'constants/eventEmitterEmits';

export class EventEmitter {
    events: { [k: string]: Set<any> } = {};
    logEmits: boolean = false;

    // eventName can be also array of event names
    emit<
        T extends keyof EVENT_EMITTERS_CALLBACKS_PARAMS,
        P extends EVENT_EMITTERS_CALLBACKS_PARAMS
    >(eventName: T, ...restParams: Parameters<P[T]>) {
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

    // eventName can be also array of event names
    on<T extends keyof EVENT_EMITTERS_CALLBACKS_PARAMS, P extends EVENT_EMITTERS_CALLBACKS_PARAMS>(
        eventName: T,
        fn: P[T],
    ): () => void {
        if (!this.events[eventName]) {
            this.events[eventName] = new Set();
        }

        const events = this.events[eventName];

        events.add(fn);

        // or use unsubscribe function
        return this.off.bind(this, eventName, fn);
    }

    // eventName can be also array of event names
    off<T extends keyof EVENT_EMITTERS_CALLBACKS_PARAMS, P extends EVENT_EMITTERS_CALLBACKS_PARAMS>(
        eventName: T,
        fn: P[T],
    ) {
        const events = this.events[eventName];

        if (events) events.delete(fn);
    }
}

export const globalEventEmitter = new EventEmitter();
