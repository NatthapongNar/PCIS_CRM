import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Collapse, Modal, Upload, List, Icon } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { in_array } from '../../../containers/PCIS/config/funcitonal'
import {} from '../../../actions/pcis'

import cls from '../styles/pcis_style.scss'

const { Panel } = Collapse
const { Dragger } = Upload
const ListItem = List.Item

const fileConfig = {
    name: 'file',
    multiple: false,
    action: '',
    onChange(info) {
        // const { status } = info.file;
        // if (status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
    }
}

const menu_master_list = [
    { menu_code: 'M001', menu_name: 'Channel/Source', menu_status: 'Off' },
    { menu_code: 'M002', menu_name: 'Product Group', menu_status: 'Off' },
    { menu_code: 'M003', menu_name: 'Campaigns', menu_status: 'Off' },
    { menu_code: 'M004', menu_name: 'Customer Tracking', menu_status: 'Off' }
]

class MenuManagement extends Component {

    state = {
        drawer: false
    }

    shouldComponentUpdate(nextProps) {
        return this.props.isOpen !== nextProps.isOpen
    }

    render() {
        const { isOpen, handleClose } = this.props

        return (
            <div>
                <Drawer
                    title={<div className="ttu"><Icon type="menu" /> Menu</div>} 
                    className={`${cls['sidebar_addon_container']}`}             
                    placement="left"
                    closable={true}
                    onClose={handleClose}
                    visible={isOpen}
                    maskClosable={false}
                >
                    <Collapse className={`${cls['sidebar_panel']}`} accordion>
                        <Panel header={<span className="ttu"><Icon type="hdd" /> Masters</span>} className={`${cls['panel_item']} ${cls['p0_5']}`} key="1">
                            <span className={`${cls['panel_title_status']} ttu`}>Status</span>
                            <List
                                className={`${cls['item_list']} ttu`}
                                itemLayout="horizontal"
                                dataSource={menu_master_list}
                                renderItem={(item) => (
                                    <ListItem key={item.menu_code} className={cls['pl15']}>
                                       {item.menu_name}
                                        <i className={`fa fa-circle ${cls['panel_icon_status']} ${(item.menu_status == 'On') ? cls['enable'] : cls['disable']} fr`} aria-hidden="true"></i>
                                    </ListItem>
                                )}
                            />
                        </Panel>
                        <Panel header={<span className="ttu"><Icon type="import" /> Import Management</span>} className={`${cls['panel_item']}`} key="2">
                            <Dragger {...fileConfig}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text" style={{ fontSize: '0.9em' }}>Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint" style={{ fontSize: '0.8em' }}>Support for a single file upload</p>
                            </Dragger>
                        </Panel>
                    </Collapse>
                </Drawer>

                {/* <Modal
                    wrapClassName={`${cls['modal_container']}`}
                    visible={isOpen}
                    title={null}
                    maskClosable={false}
                    onOk={null}
                    onCancel={handleClose}
                    footer={null}
                    width="100%"
                >

                </Modal> */}

            </div>
            
        )
    }

}

export default connect(
    (state) => ({}),
    {}
)(MenuManagement)