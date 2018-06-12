import React from 'react'
import { render } from 'react-dom'
import { createBrowserHistory } from 'history'
// import createHistory from "history/createBrowserHistory"
import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'

import Root from './containers/Root'

const initialState = window.__INITIAL_STATE__

const rootEl = document.getElementById('app')

const history = createBrowserHistory()

if (process.env.NODE_ENV === 'dev') {
    render(
        <AppContainer>
            <Root history={history} initialState={initialState} />
        </AppContainer>,
        rootEl
    )

    if (module.hot) {
        module.hot.accept('./containers/Root', () => {
            const NextRootApp = require('./containers/Root').default
            render(
                <AppContainer>
                    <NextRootApp history={history} initialState={initialState} />
                </AppContainer>,
                rootEl);
        });
    }
}
else {
    render(<Root history={history} initialState={initialState} />, rootEl)
}