import { EVENT_EMITTERS_CALLBACKS_PARAMS } from 'constants/eventEmitterEmits';

// Extract keys from EVENT_EMITTERS_CALLBACKS_PARAMS
type KeysOfEmitters<T> = T extends keyof EVENT_EMITTERS_CALLBACKS_PARAMS ? T : never;
// Extract type by key of EVENT_EMITTERS_CALLBACKS_PARAMS[key] (in this case type is callback function)
type EmitterFunction<T> = EVENT_EMITTERS_CALLBACKS_PARAMS[KeysOfEmitters<T>];
// Extract EVENT_EMITTERS_CALLBACKS_PARAMS[key] callback function arguments
type EmitterFunctionArguments<T> = Parameters<EmitterFunction<T>>;

interface IEvents {
    [k: string]: Set<any>;
}

export class EventEmitter {
    events: IEvents = {};
    logEmits: boolean = false;

    emit<P1>(eventName: KeysOfEmitters<P1>, ...restParams: EmitterFunctionArguments<P1>) {
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

    on<P1>(eventName: KeysOfEmitters<P1>, fn: EmitterFunction<P1>): () => void {
        if (!this.events[eventName]) {
            this.events[eventName] = new Set();
        }

        const events = this.events[eventName];

        events.add(fn);

        // or use unsubscribe function
        return this.off.bind(this, eventName, fn);
    }

    off<P1>(eventName: KeysOfEmitters<P1>, fn: EmitterFunction<P1>) {
        const events = this.events[eventName];

        if (events) events.delete(fn);
    }
}

export const globalEventEmitter = new EventEmitter();
