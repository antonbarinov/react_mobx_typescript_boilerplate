import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

/**
 * Wrap react functional components inside function to save context and don't loose optimisations
 */
export default function useWrappedComponent(
    Component: React.FunctionComponent,
): React.FunctionComponent {
    const [c] = useState(() => observer(Component));
    return c;
}
