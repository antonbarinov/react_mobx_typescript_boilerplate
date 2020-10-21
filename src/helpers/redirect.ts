import { redirect } from 'lib/Router';

export function smartRedirect(to: string) {
    const redirectTo = window.localStorage.getItem('redirect');
    if (redirectTo) {
        window.localStorage.removeItem('redirect');
        redirect(redirectTo);
    } else {
        redirect(to);
    }
}
