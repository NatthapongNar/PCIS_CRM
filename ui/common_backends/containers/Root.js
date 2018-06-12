import React, { Component } from 'react'
import { Router } from 'react-router'
import { BrowserRouter, Route, Link, withRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../store/configureStore'

import { CookiesProvider } from 'react-cookie'
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import routes from '../routes'

import { App } from '../components'
// import TreeView from '../components/DocumentScan/TreeView'

class Root extends Component {

    render() {
        const { history, initialState } = this.props

        const store = configureStore(history, initialState)

        return (
            <Provider store={store}>
                <CookiesProvider>
                    <LocaleProvider locale={enUS}>
                        {/* {routes(history)}  */}
                        <Router history={history}>
                            <div style={{ height: '100%' }}>
                                 <Route path={'/'} component={App} /> 
                                {/* <Route path={'/'} component={TreeView} /> */}
                            </div>
                        </Router>
                        {/* <App /> */}
                    </LocaleProvider>
                </CookiesProvider>
            </Provider>
        )
    }
}

export default Root

