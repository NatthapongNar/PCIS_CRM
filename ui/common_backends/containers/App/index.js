import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import {
    // BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import { Router } from 'react-router'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import {
    authenticate,
    setAuthentication,
    setOnOpenMainMenu,
    getOrganizationTem
} from '../../actions/master'

import { NewApp } from '../../components'

class App extends Component {

    static need = [
        (AUTH) => authenticate(AUTH)
    ]

    componentWillMount() {
        this.initApp()
    }

    initApp() {
        const { authenticate, setAuthentication, getOrganizationTem, cookies } = this.props

        authenticate({ username: 't58385' })
    }

    render() {
        return (
            <NewApp routes={this.props.routes} auth={this.props.AUTH_INFO} master={this.props.CALENDAR_MASTER_EVENTS_DATA} />
        )
    }
}

const ContextDndApp = DragDropContext(HTML5Backend)(App)
const CookiesApp = withCookies(ContextDndApp)
export default withRouter(connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        IS_OPEN_MAIN_MENU: state.IS_OPEN_MAIN_MENU,
        CALENDAR_MASTER_EVENTS_DATA: state.CALENDAR_MASTER_EVENTS_DATA
    }),
    {
        getOrganizationTem, getOrganizationTem,
        setOnOpenMainMenu: setOnOpenMainMenu,
        setAuthentication: setAuthentication,
        authenticate: authenticate
    })(CookiesApp))