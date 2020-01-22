export type anyObject = { [k: string]: any };
export type anyClass<T> = { new (): T };

export interface EventDOM extends Event {
    target: HTMLElement;
}

export type ReactChangeEventFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
) => any;

export type ReactChangeEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
