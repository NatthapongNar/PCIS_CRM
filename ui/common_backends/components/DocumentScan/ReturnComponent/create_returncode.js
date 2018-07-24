import React, { Component } from 'react'
import { connect } from 'react-redux';
import Scrollbar from 'react-smooth-scrollbar'
import { Radio, Card, Popover, Input, Modal } from 'antd'
import QueueAnim from 'rc-queue-anim'
import _ from 'lodash'

import { getMasterReturnCode, setDocumentReturnVerify } from '../../../actions/master'

import cls from '../style/index.scss'
import { in_array } from '../config/functional';

const RadioGroup = Radio.Group
const confirm = Modal.confirm;

class CreateReturnCode extends Component {

    constructor(props) {
        super(props)
        this.state = {          
            template_return: []
        }
        props.GET_MASTER_RETURNCODE()
    }

    componentWillReceiveProps(props) {
        if(!_.isEmpty(props)) {
            const { return_code } = props.master[0]
            if(!_.isEmpty(return_code) && _.isEmpty(this.state.template_return)) {
                let clone_master = _.clone(return_code.returnCode, true)
                let result_return = _.map(clone_master, (data) => { 
                    data.Status = null
                    data.Note = null
                    data.ReturnNote = null
                    return data
                })                
                this.setState({ template_return: result_return })
            }

        }
    }
    
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.master !== nextProp.master ||
               this.props.data !== nextProp.data ||
               this.props.treeSelect !== nextProp.treeSelect ||
               this.state.template_return !== nextState.template_return
    }

    render() {
        const { treeSelect, data, master, masterTree } = this.props

        // CHECK RETURN
        // console.log(_.filter(this.state.template_return, (o) => { return o.Status !== null }))

        let master_category = [],
            master_return = [],
            master_others = [],
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
                                                    let dataset = _.assign({}, this.state.template_return, data[0].return_code)
                                                    let stateItem = _.filter(dataset, { ReturnCode: objData.ReturnCode })[0]

                                                    const options = [
                                                        { label: 'Complete', value: 1 },
                                                        { label: 'Incomplete', value: 2 },
                                                        { label: 'Not Found', value: 3 }
                                                    ]

                                                    return (
                                                        <div key={(index + 1)} className={cls['card_partision_container']}>
                                                            <div className={cls['item_title']}>{objData.ReturnReason}</div>
                                                            <div className={cls['card_partision']}>
                                                                <RadioGroup name={`${objData.ReturnCode}`} value={stateItem.Status} onChange={this.handleUpdateReturn} size="small">
                                                                    {
                                                                        _.map(options, (data, key) => {
                                                                            return (
                                                                                <Radio key={(key + 1)} value={`${data.value}`} style={{ position: 'relative' }}>{data.label}</Radio>
                                                                            )
                                                                        })
                                                                    }
                                                                </RadioGroup>
                                                              
                                                            </div>         
                                                            <div className={`${cls['card_partision']} ${(!in_array(stateItem.Status, [2, 3])) ? cls['hide'] : ''}`}> 
                                                                <label className="pa1">Remark:</label> 
                                                                <Input id={`${objData.ReturnCode}`} value={stateItem.Note} placeholder="กรุณาระบุรายละเอียด" onChange={this.handleUpdateRemark} />
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
        let return_code = _.clone(this.state.template_return, true)
        let findData = _.filter(this.state.template_return, { ReturnCode: e.target.name })[0]

        if(!_.isEmpty(findData)) {
            if(_.isEmpty(findData.Note)) {            
                let updateStatus = _.assign({}, findData, { Status: e.target.value })
                _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.name }), updateStatus)
                
                this.handleUpdateCommit(return_code)
            } else {                
                let fnUpdate = this.handleUpdateCommit
                confirm({
                    title: `กรุณายืนยันการเปลี่ยนสถานะ (RET: ${e.target.name})`,
                    content: (<div>กรณีเปลี่ยนสถานะเอกสารระบบจะดำเนินการล้างข้อมูลในส่วนของ Remark โปรดยืนยันความถูกต้อง <br/><br/>กรณีข้อมูลถูกต้องโปรด คลิก OK หรือ กด Cancel เพื่อยกเลิก</div>),
                    onOk() {
                        let updateStatus = _.assign({}, findData, { Status: e.target.value, Note: null })
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

    handleUpdateRemark = (e) => {
        let return_code = _.clone(this.state.template_return, true)
        let findData = _.filter(this.state.template_return, { ReturnCode: e.target.id })[0]

        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { Note: e.target.value })           
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
            return_code: (state.DOCUMENTSCAN_RETURNCODE && state.DOCUMENTSCAN_RETURNCODE.Status) ? state.DOCUMENTSCAN_RETURNCODE.Data[0] : []
        }],
        data: [{
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data: []
        }]
    }),
    {
        GET_MASTER_RETURNCODE: getMasterReturnCode,
        SET_VERIFY_RETURNCODE: setDocumentReturnVerify
    }
)(CreateReturnCode)