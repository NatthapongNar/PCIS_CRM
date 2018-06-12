import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Avatar, Tooltip, Badge, Popover, Button, Timeline, Icon, Popconfirm, notification, Collapse } from 'antd'

import QueueAnim from 'rc-queue-anim'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import {
    getCalendarEvent,
} from '../../actions/master'

import styles from './index.scss'

const Panel = Collapse.Panel

class ManagementApp extends Component {
    render() {
        return (
            <QueueAnim type="bottom" duration={800}>
                <div key="1" style={{ display: 'flex', background: '#FFF', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '16px' }}>
                    <span style={{ fontSize: '18px', color: '#797979', textShadow: 'rgba(105, 105, 105, 0.13) 1px 1px', margin: '10px' }}>
                        <FontAwesome name="calendar" style={{ color: '#009688', marginRight: '10px' }} />
                        <span>Calendar Management</span>
                    </span>
                    <div className={styles['content']}>
                        <div>
                            <Collapse className={styles['filter-panel']} bordered={false}>
                                <Panel header={
                                    <div>

                                        <span>Filter</span>
                                    </div>
                                } key="1">
                                    <p>{`text`}</p>
                                </Panel>
                            </Collapse>
                        </div>
                        <div>
                            content
                        </div>
                    </div>
                </div>
            </QueueAnim>
        )
    }
}

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        CALENDAR_EVENT_DATA: state.CALENDAR_EVENT_DATA
    }),
    {
        getCalendarEvent: getCalendarEvent
    })(ManagementApp)