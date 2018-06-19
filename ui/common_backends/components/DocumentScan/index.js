import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { Table, Icon, Badge, Form, Row, Col, Collapse, Input, TreeSelect, Select, DatePicker, Radio, Checkbox, Modal, Button } from 'antd'
import QueueAnim from 'rc-queue-anim'
import _ from 'lodash'

import CategoryTreeView from './TreeView'
import { 
    getDocumentScanDashboard,
    getMissingDocumentList

} from '../../actions/master'


import { documentscan_columns, missing_columns } from './config/columns'
import cls from './index.scss'

const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const CheckboxGroup = Checkbox.Group
const ButtonGroup = Button.Group
const Panel = Collapse.Panel

class GridDocument extends Component {

    state = {
        filter: {
            AuthID: '57251',
            RegionID: null,
            AreaID: null,
            BranchCode: null,
            EmployeeCode: null,
            DateType: 'ScanDate',
            DatePeriod: [],
            ReferenceType: 'Application No',
            ReferenceNo: null,
            BorrowerName: null
        },
        modal: {
            missing: false,
            upload: false
        }
    }

    componentWillMount() {
        const { GET_DOCUMENT_DASHBOARD } = this.props
        GET_DOCUMENT_DASHBOARD(this.state.filter)

    }

    componentWillReceiveProps(props) {
        if(props) {
            const { gridData } = props
            if(gridData) {
                _.map(gridData, (v) => {
                    v.MissingDoc = (v.MissingDoc_Amount && v.MissingDoc_Amount > 0) ?
                        (<Badge count={v.MissingDoc_Amount} className={`${cls['removeBoxShadow']} pointer`} onClick={this.handleOpenMissing.bind(this, v.DocID)}><Icon type="copy" className="pointer" style={{ fontSize: '14px' }} /></Badge>) : 
                        (<Icon type="copy" className="pointer" onClick={this.handleOpenMissing.bind(this, v.DocID)} style={{ fontSize: '14px' }} />)

                    v.UploadItem = (<Icon type="upload" className={`pointer`}  onClick={this.handleOpenUpload.bind(this, v.DocID)} />)
                })

            }

        }
        
    }

    handleOpenMissing = (doc_id) => {
        const { GET_MISSINGDOC_LIST } = this.props
        if(doc_id && !_.isEmpty(doc_id)) {
            GET_MISSINGDOC_LIST({ DocID: doc_id })
            this.setState({ modal: _.assign({}, this.state.modal, { missing: true }) })
        }
    }

    handleCloseMissing = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { missing: false }) })
    }

    handleOpenUpload = (doc_id) => {
        // const { GET_MISSINGDOC_LIST } = this.props
        // if(doc_id && !_.isEmpty(doc_id)) {
        //     GET_MISSINGDOC_LIST({ DocID: doc_id })
        //     this.setState({ modal: _.assign({}, this.state.modal, { upload: true }) })
        // }
        this.setState({ modal: _.assign({}, this.state.modal, { upload: true }) })
    }

    handleCloseUpload = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { upload: false }) })
    }

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    handleSearchSubmit = () => {
        
    }

    render() {
        const { gridData, missingData } = this.props
        const { modal } = this.state

        return (
            <div style={{ position: 'relative', minHeight: 'calc(100% - 16px)' }}>
                {/*<CategoryTreeView />*/}
                <QueueAnim type="bottom" duration={800} >
                    <div key="1" className={`${cls['grid_container']}`}>
                        <h3 className={cls['grid_title']}>DOCUMENT MONITOR DASHBOARD</h3>
                        { this.handleHeadFilter() }
                        <Table                            
                            rowKey={this.handleRowKey}
                            className={cls['grid_table']}
                            columns={documentscan_columns}
                            dataSource={gridData}
                            loading={(gridData && gridData.length > 0) ? false : true }
                            pagination={{}}
                            footer={this.handleFooter}
                            size="small"
                            bordered
                        />
                    </div>                    
                </QueueAnim>

                <FileUploadComponent 
                    modal={modal}
                    handleClose={this.handleCloseUpload}
                />

                <MissingDoc 
                    modal={modal}
                    dataSource={missingData}
                    handleClose={this.handleCloseMissing}
                />

            </div>

        )
    }

    //SET HEAD PANEL
    handleHeadFilter = () => {     
        const { filter } = this.state
        const { form } = this.props
        const { getFieldDecorator } = form
        const { RangePicker } = DatePicker

        const gutter_init = 10
        const field_colon_label = false
        const tree_config = {
            size: 'large',
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_PARENT,
            dropdownMatchSelectWidth: false,
            style: { width: '100%' }
        }

        const prefixSelectorIdentity = getFieldDecorator('ReferenceType', { initialValue: 'ApplicationNo' })(
            <Select style={{ width: 70 }} onChange={this.onChangeApplicationType}>
                <Option value="Application No" title="Application No">APP</Option>
                <Option value="Citizen ID" title="ID Card">ID</Option>
            </Select>
        )

        return (
            <div className={`${cls['search_collapse_conainer']}`}>
                <div></div>
                <div>
                    <Collapse className={`${cls['collapse_filter']}`}>
                        <Panel header={<header><Icon type="search" /> FILTER CRITERIA</header>}>
                            <Form onSubmit={this.handleSearchSubmit}>
                                <Row gutter={gutter_init}>
                                    <Col span={6}>
                                        <FormItem label="Region" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Region', { initialValue: [] })(
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandAll={true}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Area" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Area', { initialValue: [] })(
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Branch" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Branch', { initialValue: [] })(
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        dropdownStyle={{ height: '400px' }}
                                                        size="default"                                                        
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Employee" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Employee', { initialValue: [] })(
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        dropdownMatchSelectWidth={true}
                                                        dropdownStyle={{ height: '400px' }}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row gutter={gutter_init}>
                                    <Col span={6}>
                                        <FormItem label="Date Type" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('DateType', { initialValue: 'CreateDate' })
                                                (
                                                    <Select>
                                                        <Option value="CreateDate">Scan Start</Option>
                                                        <Option value="ProgressDate">Latest Progress</Option>
                                                        <Option value="AppraisalStart">Appraisal Start</Option>
                                                        <Option value="AppraisalReceived">Appraisal Received</Option>
                                                        <Option value="CAReturnDate">CA Return</Option>
                                                        <Option value="CAReceivedDate">A2CA Date</Option>                                                        
                                                        <Option value="StatusDate">Status Date</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>                                       
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Date Period" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                           {
                                                getFieldDecorator('DateRange', { initialValue: [] })
                                                (
                                                    <RangePicker
                                                        format="DD/MM/YYYY"
                                                        treeNodeLabelProp="label"
                                                        placeholder={['START', 'END']}                                                   
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label={filter.ReferenceType} className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('ReferenceNo', {})(<Input addonBefore={prefixSelectorIdentity} style={{ width: '100%' }} />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Borrower Name" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('BorrowerName', {})(<Input  />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={gutter_init}>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12}>        
                                        <FormItem className={`fr`}>
                                            <ButtonGroup>
                                                <Button type="dashed" className={`ttu`} onClick={this.handleReset}>Clear</Button>
                                                <Button type="primary" className={`ttu`} htmlType="submit" style={{ backgroundColor: '#0e77ca' }}>
                                                    <Icon type="search" />Submit
                                                </Button>
                                            </ButtonGroup>
                                        </FormItem>                          
                                    </Col>
                                </Row>
                            </Form>
                        </Panel>      
                    </Collapse>
                </div>                
            </div>            
        )

    }

    handleFooter = (currentPageData) => {}
    
    onChangeApplicationType = (data) => {
        this.setState({ filter: _.assign({}, this.state.filter, { ReferenceType: data }) })
    }

}

class FileUploadComponent extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.upload !== nextProps.modal.upload
    }

    render() {
        const { modal, handleClose } = this.props

        return (
            <Modal
                visible={modal.upload}
                title={<span className="ttu">Upload Document Information</span>}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                maskClosable={false}
                width="65%"
            >
                
            </Modal>
        )
    }

}

class MissingDoc extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.missing !== nextProps.modal.missing ||
               this.props.dataSource !== nextProps.dataSource
    }

    render() {
        const { modal, dataSource, handleClose } = this.props

        return (
            <Modal
                visible={modal.missing}
                title={<span className="ttu">Missing Document Information</span>}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="65%"
            >
                <QueueAnim type="scale" duration={800}>
                    <div key="2" className={`${cls['grid_container']}`}>    
                        <Table                            
                            rowKey={this.handleRowKey}
                            className={cls['grid_table']}
                            columns={missing_columns}
                            dataSource={dataSource.Data}
                            loading={(dataSource.Status) ? false : true}
                            pagination={{}}
                            size="small"
                            bordered
                        />
                    </div>
                </QueueAnim>
            </Modal>
        )
    }

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

}


const GridDocumentDashboardWithCookies = withCookies(GridDocument)
const GridDocumentManagement = Form.create()(GridDocumentDashboardWithCookies)
export default connect(
    (state) => ({
       gridData: state.DOCUMENTSCAN_DASHBOARD.Data,
       missingData: state.DOCUMENTSCAN_MISSINGDOC
    }), 
    {
        GET_DOCUMENT_DASHBOARD: getDocumentScanDashboard,
        GET_MISSINGDOC_LIST: getMissingDocumentList
    }
)(GridDocumentManagement)

