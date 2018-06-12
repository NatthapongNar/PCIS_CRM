import React, { Component } from 'react'
import { RouteWithSubRoutes } from '../../routes'
import { renderRoutes } from 'react-router-config'
import { Route, Link, withRouter } from 'react-router-dom'
import { Layout, Breadcrumb, Menu, Dropdown, Badge, Avatar, Icon, Button, Tooltip, Popover, Modal, Calendar as MiniCalendar, Popconfirm } from 'antd'

import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import logo from '../../../../image/logo.png'

import styles from './index.scss'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu

export default class NewApp extends Component {

    renderSideMenu = (route) => {
        console.log(route)
        if ((route.routes || []).length > 0) {
            return (
                <SubMenu key="calendar" title={
                    <Link to={route.path}>
                        <span style={{ position: 'relative' }}>
                            <FontAwesome name="calendar-o" style={{ fontSize: '16px', paddingLeft: '1px' }} />
                            <i style={{ position: 'absolute', left: '54%', transform: 'translate(-50%, 0)', paddingTop: '1px', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                        </span>
                    </Link>
                }>
                    {
                        (route.routes || []).map(route => {
                            return this.renderSideMenu(route)
                        })
                    }
                </SubMenu>
            )
        }
        else {
            return (
                <Menu.Item key={route.key}>
                    <Link to={route.path}>
                        <Icon type="inbox" />
                        <span>{route.title}</span>
                    </Link>
                </Menu.Item>
            )
        }
    }

    render() {
        const { routes } = this.props

        return (
            <div className={styles['app-container']}>
                <div className={styles['app-header']}>

                </div>
                <div className={styles['app-sidebar']}>
                    <Menu
                        style={{ height: '100%' }}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={true}>
                        {
                            (routes || []).map(route => this.renderSideMenu(route))
                        }
                    </Menu>
                </div>
                <div className={styles['app-content']}>
                    {
                        renderRoutes(routes)
                    }
                </div>
            </div>
        )

        // return (
        //     <div>
        //         <div>
        //             Hello
        //         </div>
        //         <div>
        //             {`${auth.EmployeeCode} : ${auth.EmpName_EN}`}
        //         </div>
        //         <div>
        //             {
        //                 `Master Event Data : ${master.length}`
        //             }
        //             {
        //                 (routes || []).map(item => {
        //                     return (<Link to={item.path}>{item.path}</Link>)
        //                 })
        //             }
        //         </div>
        //         <div>

        //         </div>
        //     </div>
        // )
    }
}