import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Modal, Input, notification, Popover, Icon } from 'antd'
import QueueAnim from 'rc-queue-anim'
import _ from 'lodash'

import { setDocumentReturnVerify } from '../../../actions/master'
import { return_job_columns, document_checklist_columns } from '../config/columns'
import cls from '../style/index.scss'
import { in_array } from '../config/functional';

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

class ReturnCodeVerify extends Component {

    state = {
        tab_mode: 1
    }

    render() {
        const { 
            isOpen, 
            data, 
            handleClose

        } = this.props
        
        let data_returncode = _.filter(data[0].return_code, (v) => { return in_array(v.Status, [2, 3]) })
        if(!_.isEmpty(data_returncode) && data_returncode.length > 0) {
            _.map(data_returncode, (data) => {
                let popover_config = {                    
                    title: "UPDATE INFORMATION",
                    trigger:  "click",
                    placement: 'left',
                    content: (
                        <div>
                            <label className="pa1 ttu">Recent Remark:</label> 
                            <Input 
                                id={`${data.ReturnCode}`} 
                                value={data.Note} 
                                placeholder="กรุณาระบุรายละเอียด" 
                                onChange={this.handleUpdateRemark}
                            />
                        </div>
                        
                    )
                }
                data.Edit = (<Popover {...popover_config}><Icon type="edit" className="pointer"/></Popover>)
                data.Delete = (<Icon type="delete" className="pointer" onClick={this.handleDeleteReturnCode.bind(this, data)} />)
                return data
            })
        }

        //let data_completed_code = _.filter(data[0].return_code, (v) => { return v.Status === 1 })'

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_tonav']}`}
                visible={isOpen}
                title={<span className="ttu">Return Code Verification</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="50%"
            >  
                <Tabs type="card" onChange={this.onTabActiveKeyChange}>
                    <TabPane tab="RETURN ONLY" key="1">
                        <div className={`${cls['upload_tools']} mt2`}>
                            <div className={cls['tools']}>
                                <h4 className="ttu">Return Code Report</h4>
                            </div>
                            <div className={cls['tools']}></div>
                        </div>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={return_job_columns}
                            dataSource={data_returncode}
                            size="small"
                            pagination={{ size: 'small', pageSize: 15  }}
                            bordered
                        />
                    </TabPane>
                    <TabPane tab="OVERVIEWS" key="2">
                        <div className={`${cls['upload_tools']} mt2`}>
                                <div className={cls['tools']}>
                                    <h4 className="ttu">Document Checklist</h4>
                                </div>
                                <div className={cls['tools']}></div>
                            </div>
                            <Table
                                className={cls['grid_table']}
                                rowKey={this.handleOverviewRowKey}
                                columns={document_checklist_columns}
                                dataSource={data[0].return_code}
                                size="small"
                                pagination={{ size: 'small', pageSize: 15  }}
                                bordered
                            />
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }

    handleRowKey = (records, i) => { 
        return (records && records.CategoryCode) ? `${records.CategoryCode}_${(i + 1)}` : 0 
    }

    handleOverviewRowKey = (records, i) => { 
        return (records && records.CategoryCode) ? `OV${records.CategoryCode}_${(i + 1)}` : 0 
    }

    handleUpdateRemark = (e) => {
        const { data } = this.props
        let return_list = data[0].return_code

        if(!_.isEmpty(return_list)) {
            
            let return_code = _.clone(return_list, true)
            let findData = _.filter(return_list, { ReturnCode: e.target.id })[0]

            if(!_.isEmpty(findData)) {
                let updateNote = _.assign({}, findData, { Note: e.target.value })           
                _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.id }), updateNote)

                this.handleUpdateCommit(return_code)
            }
        }
    }

    handleDeleteReturnCode = (val) => {
        const { data } = this.props
        let return_list = data[0].return_code
        let commit = this.handleUpdateCommit

        confirm({
            title: 'คุณต้องการลบข้อมูลรายการนี้?',
            content: (<div>กรุณายืนยันการลบข้อมูล กรณียืนยันการลบข้อมูล<br/>โปรดคลิก OK หรือ Cancel เพื่อยกเลิก</div>),
            onOk() {
                if(!_.isEmpty(return_list)) {            
                    let return_code = _.clone(return_list, true)
                    let findData = _.filter(return_list, { ReturnCode: val.ReturnCode })[0]

                    if(!_.isEmpty(findData)) {
                        let updateNote = _.assign({}, findData, { Note: null, ReturnNote: null, Status: null })           
                        _.set(return_code, _.findIndex(return_code, { ReturnCode: val.ReturnCode }), updateNote)

                        notification.success({
                            message: 'ระบบลบรายการคืนงานสำเร็จ',
                            description: 'ระบบลบรายการคืนงานสำเร็จ โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                        })

                        commit(return_code)
                    }
                }
            },
            onCancel() {}
        })

    }

    handleUpdateCommit = (return_code) => {
        const { SET_VERIFY_RETURNCODE } = this.props
        SET_VERIFY_RETURNCODE(return_code)
    }

    onTabActiveKeyChange = (activeKey) => {
        this.setState({ tab_mode: activeKey });
    }

}


export default connect(
    (state) => ({
        data: [{
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data: []
        }]
    }),
    {
        SET_VERIFY_RETURNCODE: setDocumentReturnVerify 
    }
)(ReturnCodeVerify)