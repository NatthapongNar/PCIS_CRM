import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import Scrollbar from 'react-smooth-scrollbar'
import { Input, Select, Radio, Card, Popover, Modal } from 'antd'
import QueueAnim from 'rc-queue-anim'
import _ from 'lodash'

import { getMasterReturnCode, getMasterReturnStatus, setDocumentReturnVerify } from '../../../actions/master' // getCreateReturnCode, 

import cls from '../style/index.scss'
import { config } from '../config'
import { in_array } from '../config/functional';

const { TextArea } = Input
const Option = Select.Option
const RadioGroup = Radio.Group
const confirm = Modal.confirm;

class CreateReturnCode extends Component {

    constructor(props) {
        super(props)

        // INTIAL DATA
        const { GET_MASTER_RETURNCODE, GET_MASTER_STATUSCODE } = props
        bluebird.all([GET_MASTER_RETURNCODE(), GET_MASTER_STATUSCODE()])
        
        this.state = {          
            template_return: []
        }

    }

    componentWillReceiveProps(props) {
        if(!_.isEmpty(props)) {

            const { return_code } = props.master[0]
            if(!_.isEmpty(return_code) && _.isEmpty(this.state.template_return)) {
                const { recent_data } = props.data[0]
                let recent_list = (!_.isEmpty(recent_data) && recent_data.length > 0) ? _.map(recent_data, (v) => {
                    // RECENT DATA: RETURN TOPIC ACTIVE ONLY
                    if(_.isEmpty(v.ReplyNote)) {
                        return {
                            ApplicationNo: v.ApplicationNo,
                            SysNO: v.SysNO,
                            ReturnCode: v.ReturnCode,
                            ReturnReasonCode: v.ReturnReasonCode,
                            ReturnNote: v.ReturnNote,
                            ReturnDescription : v.ReturnDescription ,
                            ReturnStatus: v.ReturnStatus,
                            Note: v.Note,
                            
                        }
                    }
                    
                }) : []

                let clone_master = _.clone(return_code.returnCode, true)
                let result_return = _.map(clone_master, (data) => { 
                    let recent_select = _.filter(recent_list, { ReturnCode: data.ReturnCode })[0]

                    data.SysNO = (!_.isEmpty(recent_select)) ? recent_select.SysNO : null
                    data.ReturnReasonCode = (!_.isEmpty(recent_select)) ? recent_select.ReturnReasonCode : null
                    data.ReturnReasonDescription = (!_.isEmpty(recent_select)) ? recent_select.ReturnReasonDescription : null
                    data.ReturnStatus = (!_.isEmpty(recent_select)) ? recent_select.ReturnStatus : null
                    data.Note = (!_.isEmpty(recent_select)) ? recent_select.Note : null
                    data.ReturnNote = (!_.isEmpty(recent_select)) ? recent_select.ReturnNote : null

                    return data
                })        
 
                this.setState({ template_return: result_return })
            }

        }
    }
    
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.authen !== nextProp.authen ||
               this.props.master !== nextProp.master ||
               this.props.data !== nextProp.data ||
               this.props.treeSelect !== nextProp.treeSelect ||
               this.props.masterReturnReason !== nextProp.masterReturnReason ||
               this.state.template_return !== nextState.template_return
    }

    render() {
        const { treeSelect, data, master, masterTree, masterReturnReason } = this.props

        const master_notfound =  _.filter(masterReturnReason, (o) => { return o.ReturnReasonDescription == 'Not Found' })

        const master_status = master[0].status_code
        let status_code = (!_.isEmpty(master_status)) ? _.filter(master_status, (o) => { return o.ReturnStatusCode !== '4' }) : []

        let master_category = [],
            master_return = [],
            // master_others = [],
            ms_category = [],
            root_master = []

        if(!_.isEmpty(master[0].return_code)) {
            const master_data = master[0].return_code
            let category_select = (!_.isEmpty(treeSelect.path)) ? treeSelect.path : null

            if(!_.isEmpty(category_select)) {
                const pattern = /\//g
                let pattern_result = pattern.test(category_select)
                if(pattern_result) {
                    let splitCode = category_select.split('/')
                    let draft_master = _.filter(masterTree, { CategoryCode: splitCode[0] })[0]
                    master_category = (!_.isEmpty(draft_master.SubCategory)) ? _.filter(draft_master.SubCategory, { CategoryCode: splitCode[1] })[0] : []
                    master_return = (category_select) ? _.filter(master_data.returnCode, { CategoryCode: splitCode[1] }) : []
                    //master_others = (category_select) ? _.filter(master_data.other, { CategoryCode: splitCode[1] }) : []
                } else {
                    master_category = (category_select) ? _.filter(masterTree, { CategoryCode: category_select })[0] : []
                    master_return = (category_select) ? _.filter(master_data.returnCode, { RootCategory: category_select }) : []
                    //master_others = (category_select) ? _.filter(master_data.other, { RootCategory: category_select }) : []
                }
            }
        }

        ms_category = (Array.isArray(master_category)) ? master_category : [master_category]
        root_master = (!_.isEmpty(_.filter(master_category.SubCategory, { CategoryTypes : "FOLDER" })) && master_category.SubCategory.length > 0) ? _.filter(master_category.SubCategory, { CategoryTypes : "FOLDER" }) : ms_category
        
        return (           
            <div className={cls['returncode_wrapper']}>
                <Scrollbar>
                    <div className={cls['container']}>
                        <QueueAnim
                            key="anim-returncode"
                            type={['alpha', 'scale']}
                            interval={[200, 200]} 
                            delay={[200, 0]}
                            duration={[1500, 200]}
                            ease={['easeInSine', 'easeOutSine']}
                        >
                            {
                                (!_.isEmpty(root_master)) ? _.map(root_master, (v, i) => {
                                    let return_items = _.filter(master_return, { CategoryCode: v.CategoryCode })
                                    if(_.isEmpty(return_items) && v.CategoryCode.length >= 13) {
                                        return_items = _.filter(master_return, { CategoryCode: 'DC017' })
                                    }
                                    
                                    // let others_items = _.filter(master_others, { CategoryCode: v.CategoryCode })
                                 
                                    return (
                                        <Card key={`card_${(i+1)}`} title={<Popover placement="left" content={v.CategoryName}>{v.CategoryName}</Popover>} bordered={false} className={`${cls['card_mod_wrapper']}`}>
                                            {                                            
                                                _.map(return_items, (objData, index) => {                                                
                                                    let dataset = _.assignIn({}, this.state.template_return, data[0].return_code)
                                                    let stateItem = _.filter(dataset, { ReturnCode: objData.ReturnCode })[0]
                                               
                                                    const radio_configs = (!_.isEmpty(status_code)) ? _.map(status_code, (data) => {
                                                        return { label: data.ReturnStatusName, value: data.ReturnStatusCode }
                                                    }) : [
                                                        { label: 'Complete', value: 1 },
                                                        { label: 'Incomplete', value: 2 },
                                                        { label: 'Not Found', value: 3 }
                                                    ]

                                                    return (
                                                        <div key={(index + 1)} className={cls['card_partision_container']}>
                                                            <div className={cls['item_title']}>{objData.ReturnDescription}</div>
                                                            <div className={cls['card_partision']}>
                                                                <RadioGroup name={`${objData.ReturnCode}`} value={stateItem.ReturnStatus} onChange={this.handleUpdateReturn} size="small">
                                                                    {
                                                                        _.map(radio_configs, (data, key) => {
                                                                            return (<Radio key={(key + 1)} value={`${data.value}`} style={{ position: 'relative' }}>{data.label}</Radio>)
                                                                        })
                                                                    }
                                                                </RadioGroup>                                                              
                                                            </div>    
                                                            <div className={`${cls['card_partision']} ${(!in_array(stateItem.ReturnStatus, [2, 3])) ? cls['hide'] : ''}`}> 
                                                                <label className={`${cls['w100']} pa1`}>Return Reason:</label> 
                                                                <Select 
                                                                    value={stateItem.ReturnReasonCode} 
                                                                    className={`${cls['w100']}`} 
                                                                    disabled={(stateItem.ReturnStatus == 3) ? true : false}
                                                                    onChange={this.handleUpdateReason.bind(this, objData.ReturnCode)}
                                                                >
                                                                    <Option value="">โปรดเลือก</Option>
                                                                    {
                                                                        (stateItem.ReturnStatus == 3) && _.map(master_notfound, (data, key) => {
                                                                            return (<Option key={(key + 1)} value={data.ReturnReasonCode}>{data.ReturnReasonDescription}</Option>)
                                                                        })
                                                                    }
                                                                    {
                                                                        (stateItem.ReturnStatus == 2) && _.map(_.filter(masterReturnReason, (o) => { return o.ReturnReasonDescription !== 'Not Found' }), (data, key) => {
                                                                            return (<Option key={(key + 1)} value={data.ReturnReasonCode}>{data.ReturnReasonDescription}</Option>)
                                                                        })
                                                                    }
                                                                </Select>
                                                            </div>        
                                                            <div className={`${cls['card_partision']} ${(!in_array(stateItem.ReturnStatus, [2, 3])) ? cls['hide'] : ''}`}> 
                                                                <label className={`${cls['w100']} pa1`}>Remark:</label> 
                                                                <TextArea 
                                                                    id={`${objData.ReturnCode}`} 
                                                                    value={stateItem.ReturnNote} 
                                                                    placeholder="กรุณาระบุรายละเอียด" 
                                                                    maxLength={config.textArea.maxLength}
                                                                    autosize={config.textArea.autosize}
                                                                    onChange={this.handleUpdateRemark} 
                                                                />
                                                            </div>                                                   
                                                        </div>
                                                    )                                                    
                                                })
                                            }                                    
                                        </Card>
                                    )
                                }) : (<div />)
                            }       
                        </QueueAnim>           
                    </div>
                </Scrollbar>
            </div>
            
        )
    }

    handleUpdateReturn = (e) => {
        const { masterReturnReason } = this.props
        let return_code = _.clone(this.state.template_return, true)
        let findData = _.filter(this.state.template_return, { ReturnCode: e.target.name })[0]

        const master_return_reason = masterReturnReason
        const notfound =  _.filter(master_return_reason, (o) => { return o.ReturnReasonDescription == 'Not Found' })[0]

        let isNotFound = (e.target.value == 3) ? true : false
        let notFoundCode = (isNotFound && !_.isEmpty(notfound)) ? notfound.ReturnReasonCode : null
        let notFoundName = (isNotFound && !_.isEmpty(notfound)) ? notfound.ReturnReasonDescription : null

        if(!_.isEmpty(findData)) {
            if(_.isEmpty(findData.ReturnNote)) {            
                let updateStatus = _.assign({}, findData, { ReturnStatus: e.target.value, ReturnReasonCode: notFoundCode, ReturnReasonDescription: notFoundName })
                _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.name }), updateStatus)
                
                this.handleUpdateCommit(return_code)
            } else {                
                let fnUpdate = this.handleUpdateCommit
                confirm({
                    title: `กรุณายืนยันการเปลี่ยนสถานะ (RET: ${e.target.name})`,
                    content: (<div>กรณีเปลี่ยนสถานะเอกสารระบบจะดำเนินการล้างข้อมูลในส่วนของ Remark โปรดยืนยันความถูกต้อง <br/><br/>กรณีข้อมูลถูกต้องโปรด คลิก OK หรือ กด Cancel เพื่อยกเลิก</div>),
                    onOk() {
                        let updateStatus = _.assign({}, findData, { ReturnStatus: e.target.value, ReturnNote: null, ReturnReasonCode: notFoundCode })
                        _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.name }), updateStatus)

                        let element_other = document.getElementById(`${e.target.name}`)
                        element_other.value = null

                        fnUpdate(return_code)
                    },
                    onCancel() {}
                })
            }
        }
    }    

    handleUpdateReason = (id, val) => {
        const { masterReturnReason } = this.props

        let return_code = _.clone(this.state.template_return, true)
        let findData = _.filter(this.state.template_return, { ReturnCode: id })[0]
        let return_reason =  _.filter(masterReturnReason, { ReturnReasonCode: val })[0]
    
        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { ReturnReasonCode: val, ReturnReasonDescription: return_reason.ReturnReasonDescription })           
            _.set(return_code, _.findIndex(return_code, { ReturnCode: id }), updateNote)

            this.handleUpdateCommit(return_code)
        } 
    }

    handleUpdateRemark = (e) => {
        let return_code = _.clone(this.state.template_return, true)
        let findData = _.filter(this.state.template_return, { ReturnCode: e.target.id })[0]

        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { ReturnNote: e.target.value })           
            _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.id }), updateNote)

            this.handleUpdateCommit(return_code)
        }     
    }

    handleUpdateCommit = (return_code) => {
        const { SET_VERIFY_RETURNCODE } = this.props

        SET_VERIFY_RETURNCODE(return_code)
        this.setState({ template_return: return_code })
    }

}

export default connect(
    (state) => ({
        master: [{
            status_code: (state.LOAD_MASTER_RETURNSTATUS && state.LOAD_MASTER_RETURNSTATUS.Status) ? state.LOAD_MASTER_RETURNSTATUS.Data : [],
            return_code: (state.DOCUMENTSCAN_RETURNCODE && state.DOCUMENTSCAN_RETURNCODE.Status) ? state.DOCUMENTSCAN_RETURNCODE.Data[0] : []
        }],
        data: [{
            recent_data: (state.LOAD_RETURNCODE_BUNDLE && state.LOAD_RETURNCODE_BUNDLE.Status) ? state.LOAD_RETURNCODE_BUNDLE.Data : [],
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data : [] //setDataManagement(state.LOAD_RETURNCODE_BUNDLE, state.DOCUMENTSCAN_RETURNCODE_VERIFY) // 
        }]
    }),
    {
        GET_MASTER_RETURNCODE: getMasterReturnCode,
        GET_MASTER_STATUSCODE: getMasterReturnStatus,
        SET_VERIFY_RETURNCODE: setDocumentReturnVerify
    }
)(CreateReturnCode)