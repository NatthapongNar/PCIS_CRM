import React from 'react'
import { Router } from 'react-router'
import { BrowserRouter, Route, Link, withRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'

import {
    App,
    Home,
    Dashboard,
    Calendar,
    CalendarDashboard,
    CalendarManagement
} from './containers'

const RouteWithSubRoutes = (route) => {
    console.log(route)
    return (
        <Route path={route.path} render={props => (<route.component {...props} routes={route.routes} />)} />
    )
}

const routes = [{
    key: '1',
    component: App,
    routes: [{
        key: '1.1',
        path: '/',
        exact: true,
        component: Home
    }, {
        key: '1.2',
        path: '/home',
        title: 'Home',
        component: Home
    }, {
        key: '1.3',
        path: '/dashboard',
        title: 'Dashboard',
        component: Dashboard
    }, {
        key: '1.4',
        path: '/calendar',
        component: Calendar,
        title: 'Calendar',
        routes: [{
            key: '1.4.1',
            path: '/calendar/dashboard',
            title: 'Calendar Dashboard',
            component: CalendarDashboard
        }, {
            key: '1.4.2',
            path: '/calendar/management',
            title: 'Calendar Management',
            component: CalendarManagement
        }]
    }]
}]

export default (history) => {
    return (
        <Router history={history}>
            <div style={{ height: '100%', width: '100%' }}>
                {
                    routes.map((route, index) => {
                        return (<RouteWithSubRoutes key={index} {...route} />)
                    })
                }
            </div>
        </Router>
    )
}

export {
    RouteWithSubRoutes,
    routes
}

// const generateRouteComponent = components => {
//     return (
//         components.map(item => {
//             if (item.childComponent) {
//                 return (
//                     <div style={{ height: '100%' }}>
//                         <Route key={item.componentId} path={item.componentPath} component={item.component} />
//                         {
//                             generateRouteComponent(item.childComponent)
//                         }
//                     </div>
//                 )
//             }
//             else {
//                 return (<Route key={item.componentId} path={item.componentPath} component={item.component} />)
//             }
//         })
//     )
// }

// const getApplication = ({ match }) => {

//     const path = `${match.url}`

//     const component_route = [{
//         componentId: '1',
//         componentPath: `${path}`,
//         component: App
//     }]

//     // return generateRouteComponent(component_route)
//     return <Route key={1} path='/' component={App} />
// }

// export default (store, history) => {

//     return (
//         <BrowserRouter>
//             <Router history={syncHistoryWithStore(history, store)}>

//                 <App />

//             </Router>
//         </BrowserRouter>
//     )
// }

// const App = () => (
//     <div>
//         <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/about">About</Link></li>
//             <li><Link to="/topics">Topics</Link></li>
//         </ul>

//         <hr />

//         <Route exact path="/" component={Home} />
//         <Route path="/about" component={About} />
//         <Route path="/topics" component={Topics} />
//     </div>
// )

// const aBck = withRouter(connect(
//     (state) => ({
//     }),
//     {
//     })(App))

// export default (history) => {

//     return (
//         <Router history={history}>
//             <App />
//         </Router>
//     )
// }

// const Home = () => (
//     <div>
//         <h2>Home</h2>
//     </div>
// )

// const About = () => (
//     <div>
//         <h2>About</h2>
//     </div>
// )

// const Topics = ({ match }) => (
//     <div>
//         <h2>Topics</h2>
//         <ul>
//             <li>
//                 <Link to={`${match.url}/rendering`}>
//                     Rendering with React
//         </Link>
//             </li>
//             <li>
//                 <Link to={`${match.url}/components`}>
//                     Components
//         </Link>
//             </li>
//             <li>
//                 <Link to={`${match.url}/props-v-state`}>
//                     Props v. State
//         </Link>
//             </li>
//         </ul>

//         <Route path={`${match.url}/:topicId`} component={Topic} />
//         <Route exact path={match.url} render={() => (
//             <h3>Please select a topic.</h3>
//         )} />
//     </div>
// )

// const Topic = ({ match }) => (
//     <div>
//         <h3>{match.params.topicId}</h3>
//     </div>
// )
