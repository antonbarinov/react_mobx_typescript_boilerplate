export type anyObject = { [k: string]: any };
export type anyClass<T> = { new (): T };

export interface EventDOM extends Event {
    target: HTMLElement;
}
