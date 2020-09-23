import React, { useCallback, useEffect, useState } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import { observable, reaction } from 'mobx';
import pathToRegexp from 'path-to-regexp';
import { mutateObject } from 'helpers/mutateObject';
import { anyObject } from 'declarations/types';
import { EventEmitter } from 'lib/EventEmitter';

type RouterEvents = {
    navigate: () => any;
};
const eventEmitter = new EventEmitter<RouterEvents>();

function exec(re: RegExp, str: string, keys = []) {
    const match = re.exec(str);

    if (match === null) return null;

    const paramsValues = match.slice(1);
    let result = {};
    for (let i = 0; i < paramsValues.length; i++) {
        const paramValue = paramsValues[i];
        const paramName = keys[i].name;

        result[paramName] = paramValue;
    }

    return result;
}

export function redirect(to: string, replace = false, title = '') {
    const currentFullPath = window.location.href.substr(window.location.origin.length);
    if (currentFullPath === to) return;

    if (currentRoute.hashMode) to = '#' + to;

    if (replace) {
        history.replaceState({}, title, to);
    } else {
        history.pushState({}, title, to);
    }

    currentRoute.setCurrentRoute();
}

class CurrentRoute {
    @observable currentLocation = {
        path: '',
        fullPath: '',
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            port: '',
            protocol: '',
            search: '',
        },
    };
    @observable fullPath = window.location.pathname + window.location.search;
    @observable routeParams: anyObject = {};
    @observable.ref currentRegExp: RegExp = null;
    @observable searchParams: anyObject = {};
    @observable hashMode = false;

    constructor() {
        this.setCurrentRoute();

        window.addEventListener('popstate', this.setCurrentRoute);
        window.addEventListener('hashchange', this.setCurrentRoute);

        reaction(
            () => {
                return JSON.stringify(this.currentLocation);
            },
            () => {
                eventEmitter.emit('navigate');
            },
        );
    }

    setCurrentRoute = () => {
        const windowLocation = JSON.parse(JSON.stringify(window.location));

        let path, fullPath;

        if (this.hashMode) {
            const hashPath = windowLocation.hash.substr(1);
            const parsedURL = new URL(hashPath, windowLocation.origin);
            path = parsedURL.pathname;
            fullPath = hashPath;
        } else {
            path = windowLocation.pathname;
            fullPath = path + windowLocation.search;
        }

        const parsedURL = new URL(fullPath, windowLocation.origin);
        const searchParams = Object.fromEntries(parsedURL.searchParams.entries());
        mutateObject(this.searchParams, searchParams);

        const route = {
            path,
            fullPath,
            location: windowLocation,
        };

        mutateObject(this.currentLocation, route);
        eventEmitter.emit('navigate');
    };
}

export const currentRoute = new CurrentRoute();

let globalRoutersCount = 0;

interface IRoutes {
    [k: string]: JSX.Element;
}

class RouterState {
    @observable.ref currentComponent = null;
    routes: IRoutes = {};
    disposer: () => any = null;

    constructor(routes: IRoutes) {
        this.routes = routes;

        this.disposer = eventEmitter.on('navigate', this.navigate);
        this.navigate();
    }

    onUnmount = () => {
        this.disposer();
    };

    navigate = () => {
        const { routes } = this;
        let result = routes[''] || routes['*'] || null;

        let isRouteFound = false;

        const { path } = currentRoute.currentLocation;

        for (const route in routes) {
            if (!routes.hasOwnProperty(route)) continue;
            if (route === '' || route === '*') continue;
            const component = routes[route];

            let routePath = route;
            if (routePath.substr(-1) === '/') routePath = routePath.substr(0, routePath.length - 1);

            const keys = [];
            const regexp = pathToRegexp(routePath, keys);
            const res = exec(regexp, path, keys);

            if (res) {
                isRouteFound = true;
                result = component;

                for (const key in res) {
                    res[key] = decodeURI(res[key]);
                }

                // Set global route params only from global router, not from local
                if (global) {
                    mutateObject(currentRoute.routeParams, res);
                    currentRoute.currentRegExp = regexp;
                } else {
                    mutateObject(currentRoute.routeParams, {});
                }

                break;
            }
        }

        if (!isRouteFound) {
            mutateObject(currentRoute.routeParams, {});
            currentRoute.currentRegExp = pathToRegexp(currentRoute.currentLocation.path, []);
        }

        this.currentComponent = result;
    };
}

interface IRouterProps {
    routes: IRoutes;
    global?: boolean;
    hashMode?: boolean;
}

/**
 * Props explanation:
 * @routes - key-value object where key is route and value is what must to rendered. If key is "" or "*" that means Page not found
 * @global - mark router as global for populate currentRoute.routeParams and currentRoute.currentRegExp
 * @hashMode - hash router instead of regular url's
 */
export const Router = observer(({ routes, global = false, hashMode = false }: IRouterProps) => {
    const [state] = useState(() => new RouterState(routes));

    useEffect(() => state.onUnmount, []);

    useEffect(() => {
        if (global) globalRoutersCount++;
        if (globalRoutersCount > 1) throw new Error(`Only 1 router exemplar can be global`);

        return () => {
            globalRoutersCount--;
        };
    }, []);

    useEffect(() => {
        currentRoute.hashMode = Boolean(hashMode);
        if (hashMode && window.location.hash === '') window.location.hash = '/';
        currentRoute.setCurrentRoute();
    }, [hashMode]);

    return state.currentComponent;
});

interface ILinkProps {
    to: string;
    exact?: boolean;
    dontIgnoreHash?: boolean;
    grabActive?: (active: boolean) => any;
    activeClass?: string;
    children?: React.ReactNode;
    className?: string;
    htmlAttrs?: React.HTMLAttributes<HTMLAnchorElement>;

    [x: string]: any;
}

/**
 * Props explanation:
 * @to - link url
 * @exact - mark active only if to === currentLocation.fullPath instead of current global route regexp match
 * @dontIgnoreHash - Don't ignore hash when exact active
 * @grabActive - callback function that tells is link active or not
 * @activeClass - class that applied when url related to this Link
 */
export const Link = observer(
    ({
        to,
        exact = false,
        dontIgnoreHash = false,
        grabActive = null,
        activeClass = null,
        children = null,
        className = null,
        htmlAttrs = {},
        ...restProps
    }: ILinkProps) => {
        const state = useObservable({
            active: false,
        });

        useEffect(
            () => reaction(
                () => {
                    const { currentRegExp, currentLocation } = currentRoute;

                    return [to, exact, currentLocation, currentRegExp];
                },
                () => {
                    calcActive();
                },
            ),
            [],
        );

        const handleClick = useCallback((e) => {
            e.preventDefault();

            redirect(to);
        }, []);

        const calcActive = useCallback(() => {
            const { currentRegExp, currentLocation } = currentRoute;

            let active = false;
            if (exact) {
                if (dontIgnoreHash && !currentRoute.hashMode) {
                    active = to === currentLocation.fullPath + currentLocation.location.hash;
                } else {
                    active = to === currentLocation.fullPath;
                }
            } else if (currentRegExp && currentRegExp.exec(to)) {
                active = true;
            }

            if (active !== state.active) {
                state.active = active;
                grabActive && grabActive(active);
            }
        }, []);

        useState(() => calcActive());

        let classNames = [];
        if (className) classNames.push(className);
        if (activeClass && state.active) classNames.push(activeClass);

        return (
            <a {...restProps} {...htmlAttrs} className={classNames.join(' ')} href={to} data-active={state.active} onClick={handleClick}>
                {children}
            </a>
        );
    },
);
