import { useState } from 'react';

type anyClass<T> = { new (): T };

export function useLocalState<T>(c: anyClass<T>): T {
    const [state] = useState(() => new c());
    return state;
}
