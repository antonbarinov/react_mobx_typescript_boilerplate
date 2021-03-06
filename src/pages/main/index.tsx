import React, { useEffect, useRef, useState } from 'react';
import { currentRoute, Link } from 'lib/Router';
import { Container } from 'components/Container';
import { MainPageState } from './state';

const updateTimeEffect = (state: MainPageState) => () => {
    document.title = 'Main Page | Boilerplate';

    const interval = setInterval(state.updateTime, 10);

    return () => {
        clearInterval(interval);
    };
};

const Page = () => {
    const { page } = currentRoute.routeParams;
    if (!page) return null;

    return <h3>Route param "page": {page}</h3>;
};

export const MainPage = () => {
    const [state] = useState(() => new MainPageState());

    const testRef = useRef<HTMLDivElement>();

    // Update time
    useEffect(updateTimeEffect(state), []);

    const { routeParams, currentLocation, searchParams } = currentRoute;
    const { page } = routeParams;

    useEffect(() => {
        console.log(testRef);

        const timeout = setTimeout(() => {
            console.log(testRef.current.innerText);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Container innerRef={testRef}>
            <h1>{state.title}</h1>
            <input value={state.title} onChange={state.handleTitleChange} />
            {page && <Page />}
            <div>This time is {state.time}</div>
            <div>Hash: {currentLocation.location.hash}</div>
            <div>searchParams: {JSON.stringify(searchParams)}</div>
            <Link to="/">main page</Link>
            <br />
            <Link to="/page/1">page 1</Link>
            <br />
            <Link to="/page/2">page 2</Link>
            <br />
            <Link to="/asdqwe">not found</Link>
            <br />
        </Container>
    );
};
