import React from 'react'
import { StaticRouter, match } from 'react-router'
import { matchRoutes, renderRoutes } from 'react-router-config'
import { renderToString } from 'react-dom/server'
import { createMemoryHistory } from 'history'

import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../common_backends/store/configureStore'

import { fetchComponent } from './fetchComponent'

import { routes } from '../common_backends/routes'

import Root from '../common_backends/containers/Root'

import { App } from '../common_backends/components'

import CalendarApp from '../common_backends/components/Calendar'

import _ from 'lodash'

const renderHtml = (html, initialState) => (`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PCIS</title>
    <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">
    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' integrity='sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN'
        crossorigin='anonymous'>
    <link href="/plugin/flaticon/flaticon.css" rel="stylesheet">
    <style>
        span.fa {
            font-family: FontAwesome !important;
        }

        i.flaticon,
        i[class^="flaticon"],
        span.flaticon,
        span[class^="flaticon"] {
            font-family: Flaticon !important;
            font-weight: normal;
            font-style: normal;
        }
    </style>
</head>

<body>
    <div id="app">${html}</div>
    <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="
        crossorigin="anonymous"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUC1Wou6aP9PPGzh8vXMlCD_xKEh739JQ&libraries=geometry,drawing,places&language=th&sensor=true"></script>
    <script src='http://127.0.0.1:8081/static/bundle.js'></script>
</body>

</html>
`)

export default function (req, res) {

    const memoryHistory = createMemoryHistory({ initialEntries: [req.url] })

    const store = configureStore(memoryHistory)

    const history = syncHistoryWithStore(memoryHistory, store)

    const branch = matchRoutes(routes, req.url)

    process.env['NODE_ENV'] = 'production'

    // console.log("----------------------", req.url, branch.map(({ route }) => route), "-----------------", branch.map(({ match }) => match))
    const needs = branch
        .filter(({ route, match }) => !_.isEmpty(route.component) && match.isExact)
        .map(item => item.route.component)
        .reduce((prev, current) => {
            const wrappedComponent = current.WrappedComponent
            return ((wrappedComponent && wrappedComponent.need) || []).concat(prev)
        }, [])

    Promise.all(needs.map(need => store.dispatch(need({ username: 't58385', EmployeeCode: '58385' })))).then(resp => {
        const context = {}

        const html = renderToString(
            <StaticRouter
                location={req.url}
                context={context}
            >
                <Root history={history} initialState={store.getState()} />
            </StaticRouter>
        )

        if (context.url) {
            redirect(301, context.url)
        } else {
            res.write(renderHtml(html, store.getState()))
            res.end()
        }
    })
}