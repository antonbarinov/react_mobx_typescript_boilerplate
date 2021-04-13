import { useState } from 'react';
import { WithBooleanFlag } from 'compositions/WithBooleanFlag';

export function useBoolean(initialValue = false) {
    const [state] = useState(() => new WithBooleanFlag(initialValue));

    return state;
}
