import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import {
    Route,
    Link,
    withRouter
} from 'react-router-dom'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { Layout, Breadcrumb, Menu, Dropdown, Badge, Avatar, Icon, Button, Tooltip, Popover, Modal, Calendar as MiniCalendar, Popconfirm } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'

import logo from '../../../../image/logo.png'

import {
    authenticate,
    setAuthentication,
    setOnOpenMainMenu,
    getOrganizationTem
} from '../../actions/master'

import CalendarApp from '../Calendar'
import ManagementApp from '../Management'
import OrgChart from '../OrgChart'
import styles from './index.scss'
import DocumentScan from '../DocumentScan'
import MainCategory from '../DocumentScan/CategoryFile'

import {
    UserManagement,
    BranchManagement
} from '../../containers'

import { config } from './config'

const { Header, Content } = Layout
const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            current: (props.location && props.location.pathname !== '') ? props.location.pathname.replace('/', '') : 'dashboard'
        }

    }

    static need = [
        (Auth) => getOrganizationTem(Auth)
    ]

    componentWillMount() {
        this.initData();

        // Set Title
        // window.document.title = 'Calendar'
        // $('title').text('Calendar')
    }

    initData() {
        const { setAuthentication, getOrganizationTem, cookies } = this.props
        if (process.env.NODE_ENV === 'production') {

            console.log("Cookie : ", cookies.get('authen_info'))

            if (!_.isEmpty(cookies.get('authen_info'))) {

                const { Auth } = cookies.get('authen_info')

                setAuthentication(Auth)

                getOrganizationTem(Auth)
            }
            else {
                // window.location.href = 'http://tc001pcis1p/login/'
                window.location.href = 'http://tc001pcis1u:8099/pcis/'
            }
        }
        else {
            this.props.authenticate({ username: 't58385' })

            this.props.getOrganizationTem({ EmployeeCode: '58385' })
            // setAuthentication({
            //     EmployeeCode: '58385',
            //     EmpName_TH: 'เจนวิทย์ เลิศสินอธิชัย',
            //     RoleId: '6',
            // })
        }
    }

    getBreadcrumbItems = () => {

        const { location } = this.props
        const pathSnippets = location.pathname.split('/').filter(i => i)

        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>
                        {_}
                    </Link>
                </Breadcrumb.Item>
            )
        })

        return extraBreadcrumbItems
    }

    openMenu = () => {
        this.props.setOnOpenMainMenu(!this.props.IS_OPEN_MAIN_MENU)
    }

    handleSidebarMenu = (e) => {
        this.setState({ current: e.key });
    }

    render() {
        const { AUTH_INFO, match, history } = this.props

        const menu = (
            <Menu>
                <MenuItem disabled>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${AUTH_INFO.EmployeeCode}`} style={{ marginRight: '5px' }} size="large" />
                        <div style={{ display: 'flex', flex: '1', flexDirection: 'column', color: 'rgba(39, 39, 39, 0.7)', fontSize: '12px' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>{AUTH_INFO.EmpName_TH}</span>
                            <span style={{ whiteSpace: 'nowrap' }}>Work Period {AUTH_INFO.StartWork}</span>
                        </div>
                    </div>
                </MenuItem>
                <Menu.Divider />
                <MenuItem key="0"><Icon type="user" style={{ marginRight: '5px' }} />Profile</MenuItem>
                <MenuItem key="1"> <Icon type="setting" style={{ marginRight: '5px' }} />Setting</MenuItem>
                <MenuItem key="2"> <Icon type="solution" style={{ marginRight: '5px' }} />Contact</MenuItem>
                <Menu.Divider />
                <MenuItem key="3"><Icon type="logout" style={{ marginRight: '5px', color: '#b1023e' }} />Sign out</MenuItem>
            </Menu>
        )

        return (            
            <Layout style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Header className={`${styles['header_container']}`}>
                    <div className={styles['container']}>
                        <div className={styles['logo_container']}>
                            <div className={styles['logo']}>
                                <img src={logo} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1', alignItems: 'center', padding: '0 10px' }}>
                        {/*                             
                            <Breadcrumb.Item href="">
                                <Link to="/calendar"> <Icon type="home" /></Link>
                            </Breadcrumb.Item>
                            <Breadcrumb>
                                {
                                    this.getBreadcrumbItems()
                                }
                                
                                <Breadcrumb.Item href="">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                
                                <Breadcrumb.Item href="">
                                    <Icon type="calendar" />
                                    <span>Calendar</span>
                                </Breadcrumb.Item> 
                        
                                <Breadcrumb.Item>
                                    <Icon type="schedule" />
                                    <span>Management</span>
                                </Breadcrumb.Item>                         
                            </Breadcrumb>
                        */}
                        </div>
                        <div className={styles['toolbar-profile-header']} style={{ display: 'flex', justifyContent: 'flex-end' }}>

                            { 
                                _.map(config.header_menu, (v, i) => {
                                    v.badge_amt = 0

                                    return (
                                        <div key={(i+1)} className={styles['toolbar-item']}>
                                            <Tooltip title={v.name}>
                                                <Badge className={styles['removeBoxShadow']} count={v.badge_amt}>
                                                    { 
                                                        (v.fontAwesome) ? (<FontAwesome name={v.icon} className={styles['isFontAwesome']} />) : (<Icon type={v.icon} />)
                                                    }
                                                </Badge>
                                            </Tooltip>
                                        </div>
                                    )
                                })
                            }

                            <Dropdown
                                placement="bottomRight"
                                overlay={menu}>
                                <div className={styles['toolbar-item']}>
                                    <Avatar src={`http://172.17.9.94/newservices/LBServices.svc/employee/image/${AUTH_INFO.EmployeeCode}`} style={{ marginRight: '5px' }} />
                                    <div style={{ display: 'flex', flex: '1', flexDirection: 'column', color: 'rgba(39, 39, 39, 0.7)', lineHeight: '20px', fontSize: '13px' }}>
                                        <span style={{ whiteSpace: 'nowrap' }}>{AUTH_INFO.EmpName_TH}</span>
                                        <span style={{ whiteSpace: 'nowrap' }}>Work Period {AUTH_INFO.StartWork}</span>
                                    </div>
                                </div>
                            </Dropdown>

                        </div>
                    </div>
                </Header>
                <Layout className={styles['sidebar_container']}>
                    <Menu          
                        className={styles['menu_sidebar']}              
                        mode="inline"
                        theme="dark"
                        selectedKeys={[this.state.current]}
                        onClick={this.handleSidebarMenu}
                        inlineCollapsed={true}
                    >
                        <MenuItem key="dashboard" >
                            <Link to="/documentscan/dashboard">
                                <Icon type="dashboard" />
                                <span>Dashboard</span>
                                </Link>
                        </MenuItem>

                        <MenuItem key="document">
                            <Link to={`${config.rootPath}/document`}>
                                <Icon type="folder" />
                                <span>Document Scan</span>
                            </Link>
                        </MenuItem>
                        
                        <MenuItem key="application" disabled={true}>
                            <Icon type="desktop" />
                            <span>Application</span>
                        </MenuItem>

                        <MenuItem key="inbox" disabled={true}>
                            <Icon type="inbox" />
                            <span>Files</span>
                        </MenuItem>
                        
                        <SubMenu key="management" className={styles['submenu_disabled']} disabled={true} title={<Icon type="user" />}> {/*title={<Link to="/management/user"><Icon type="user" /></Link>}*/}
                            <MenuItem key="Management_1"><Link to="/management/user"><span><Icon type="user" /><span>User Management</span></span></Link></MenuItem>
                            <MenuItem key="Management_2"><Link to="/management/branch"><span><FontAwesome name="building" style={{ marginRight: '10px' }} /><span>Branch Management</span></span></Link></MenuItem>
                        </SubMenu>

                        <SubMenu key="calendar" title={
                            <Link to="/documentscan/calendar">
                                <span style={{ position: 'relative' }}>
                                    <FontAwesome name="calendar-o" style={{ fontSize: '16px', paddingLeft: '1px' }} />
                                    <i style={{ position: 'absolute', left: '54%', transform: 'translate(-50%, 0)', paddingTop: '1px', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                                </span>
                            </Link>
                        }>
                            <MenuItem key="calendar_5"><Link to="/calendar/dashboard"><span><Icon type="dashboard" /><span>Dashboard</span></span></Link></MenuItem>
                            <MenuItem key="calendar_6">
                                <Link to="/documentscan/calendar">
                                    <span style={{ position: 'relative', marginRight: '10px' }}>
                                        <FontAwesome name="calendar-o" style={{ fontSize: '16px', paddingLeft: '1px' }} />
                                        <i style={{ position: 'absolute', left: '54%', transform: 'translate(-50%, 0)', paddingTop: '1px', fontSize: '8px' }}>{moment(new Date()).format("DD")}</i>
                                    </span>
                                    <span>Calendar</span>
                                </Link>
                            </MenuItem>
                            <MenuItem key="calendar_7">
                                <Link to="/documentscan/calendar/management"><span><Icon type="schedule" /><span>Management</span></span></Link>
                            </MenuItem>
                        </SubMenu>
                        
                    </Menu>                    
                    <Content id="content" className={styles['layout_container']}>
                            <Route exact={true} path="/documentscan/calendar" component={CalendarApp} />
                            <Route path="/documentscan/calendar/management" component={ManagementApp} />
                            <Route path="/documentscan/calendar/dashboard" component={OrgChart} />
                            <Route path="/documentscan/management/user" component={UserManagement} />
                            <Route path="/documentscan/management/branch" component={BranchManagement} />
                            <Route path="/documentscan/document" component={DocumentScan} />
                            <Route path="/documentscan/pdfviewer/:ApplicationNo?" component={MainCategory} />
                            {/* <Route path="/dashboard" component={OrgChart} />   */}
                            {/* <ManagementApp />  */}
                            {/* <CalendarApp />   */}
                    </Content>                   
                </Layout>
            </Layout >
        )
    }
}

const ContextApp = DragDropContext(HTML5Backend)(App)

const CookiesApp = withCookies(ContextApp)

// const CookiesApp = withCookies(App)

// export default connect(
//     (state) => ({
//         AUTH_INFO: state.AUTH_INFO,
//         IS_OPEN_MAIN_MENU: state.IS_OPEN_MAIN_MENU
//     }),
//     {
//         getOrganizationTem, getOrganizationTem,
//         setOnOpenMainMenu: setOnOpenMainMenu,
//         setAuthentication: setAuthentication,
//         authenticate: authenticate
//     })(CookiesApp)

export default withRouter(connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        IS_OPEN_MAIN_MENU: state.IS_OPEN_MAIN_MENU
    }),
    {
        getOrganizationTem, getOrganizationTem,
        setOnOpenMainMenu: setOnOpenMainMenu,
        setAuthentication: setAuthentication,
        authenticate: authenticate
    })(CookiesApp))

