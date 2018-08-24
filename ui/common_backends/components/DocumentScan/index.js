import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Row, Col, Collapse, Table, Icon, Badge, Form, Button, Input, TreeSelect, Select, DatePicker, Modal, Popover } from 'antd'
import { Link } from 'react-router-dom'
import Scrollbar from 'react-smooth-scrollbar'
import QueueAnim from 'rc-queue-anim'
import bluebird from 'bluebird'
import _ from 'lodash'

import FileUploadManager from './Uploader/uploader'
import ReturnDashboard from './ReturnComponent/grid_returncode'

import { 
    getDocumentScanDashboard,
    getMissingDocumentList,
    getMasterReturnCode,
    // getMessageInformation,
    getBorrowerInformation

} from '../../actions/master'

import { app_config } from '../App/config'
import { config } from './config'
import { documentscan_columns, missing_columns, borrower_columns } from './config/columns'
import cls from './style/index.scss'

const Option = Select.Option
const FormItem = Form.Item
const ButtonGroup = Button.Group
const Panel = Collapse.Panel

class GridDocument extends Component {

    constructor(props) {
        super(props)

        const { cookies } = this.props
        const { cookieConfig } = config        
        const ck_info = cookies.get(cookieConfig.name.authen, { path: cookieConfig.path })

        this.state = {
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
                upload: false,
                chatbox: false,
                borrower: false
            },
            data: {
                customer_info: [],
                upload_info: []
            },
            pagination: {
                size: 'small',
                pageSize: 20,
                showQuickJumper: false,
                pageInfo: null,
                showTotal: (total, range) => {
                    const { pagination } = this.state

                    let el_target = document.querySelector('.number_length')
                    if (el_target) {
                        pagination.pageInfo = `Showing ${range[0]} to ${range[1]} of ${total} entries`
                        if (el_target.innerHTML.length > 0) {
                            el_target.innerHTML = el_target.innerHTML.replace(el_target.innerHTML, pagination.pageInfo)
                        } else {
                            el_target.innerHTML = pagination.pageInfo
                        }
                        return pagination.pageInfo
                    }
                }
            },
            authen: (!_.isEmpty(ck_info)) ? ck_info : []
        }

    }

    componentWillMount() {       
        const { GET_DOCUMENT_DASHBOARD, GET_MASTER_RETURNCODE } = this.props 
        bluebird.all([GET_MASTER_RETURNCODE(), GET_DOCUMENT_DASHBOARD(this.state.filter)])
     
    }

    componentWillReceiveProps(props) {
        if(props) {
            const { gridData } = props
          
            if(gridData) {
                _.map(gridData, (v) => {
                    v.Monitor = (<Link to={`${app_config.rootPath}/pdfviewer/${v.ApplicationNo}`}><Icon type="desktop" className={`pointer`} /></Link>)
                    v.MissingDoc = (v.MissingDoc_Amount && v.MissingDoc_Amount > 0) ?
                        (<Badge count={v.MissingDoc_Amount} className={`${cls['removeBoxShadow']} pointer`} onClick={this.handleOpenMissing.bind(this, v.DocID)}><Icon type="copy" className="pointer" style={{ fontSize: '14px' }} /></Badge>) : 
                        (<Icon type="copy" className="pointer" onClick={this.handleOpenMissing.bind(this, v.DocID)} style={{ fontSize: '14px' }} />
                    )
                    v.BorrowerList = (v.Borrower_Amount && v.Borrower_Amount > 1) ? (<span onClick={this.handleBorrowerModal.bind(this, v.ApplicationNo)} className={`pointer dark-blue`}>{ v.Borrower_Amount }</span>) : v.Borrower_Amount
                    v.CA_UploadItem = (<Icon type="upload" className={`pointer`} onClick={this.handleOpenUpload.bind(this, [v.ApplicationNo, 'CA'])} />)
                    v.AP_UploadItem = (<Icon type="upload" className={`pointer`} onClick={this.handleOpenUpload.bind(this, [v.ApplicationNo, 'AP'])} />)
                })

            }

        }
    }

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    handleSearchSubmit = () => {}

    handlePageChange = (size) => {
        this.setState({ pagination: _.assignIn({}, this.state.pagination, { pageSize: parseInt(size) }) })
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

    handleOpenUpload = (data) => {  
        if(!_.isEmpty(data)) {
            this.setState({ 
                modal: _.assign({}, this.state.modal, { upload: true }),
                data: _.assign({}, this.state.data, { upload_info: data })
            })
        }        
    }

    handleCloseUpload = () => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { upload: false }),
            data: _.assign({}, this.state.data, { upload_info: [] })
        })
    }

    handleBorrowerModal = (appno) => {
        const { GET_BORROWER_LIST } = this.props

        if(!_.isEmpty(appno)) {
            const { borrower } = this.state.modal

            GET_BORROWER_LIST(appno)
            this.setState({ modal: _.assign({}, this.state.modal, { borrower: !borrower })  })
        }
      
    }

    handleOpenChatbox = (data) => {
        const { authen } = this.state
        const { GET_GRID_MESSAGE } = this.props

        GET_GRID_MESSAGE({
            EmpCode: (!_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null,
            ApplicationNo: (!_.isEmpty(data.ApplicationNo)) ? data.ApplicationNo : null
        })

        this.setState({ 
            modal: _.assign({}, this.state.modal, { chatbox: true }),
            data: _.assign({}, this.state.data, { customer_info: data })
        })
    }

    handleCloseChatbox = () => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { chatbox: false }),
            data: _.assign({}, this.state.data, { customer_info: [] })
        })
    }
    
    render() {
        const { gridData, missingData, returnCode, borrowerData } = this.props
        const { authen, data, modal, pagination } = this.state
        
        return (
            <div style={{ position: 'relative', minHeight: 'calc(100% - 16px)' }}>
                <Scrollbar>
                    <QueueAnim type="bottom" duration={800}>
                        <div key="1" className={`${cls['grid_container']}`}>
                            <h3 className={cls['grid_title']}>DOCUMENT MONITOR DASHBOARD</h3>
                            { this.handleHeadFilter() }
                            <Table                            
                                rowKey={this.handleRowKey}
                                className={cls['grid_table']}
                                columns={documentscan_columns}
                                dataSource={gridData}
                                loading={(gridData && gridData.length > 0) ? false : true }
                                pagination={pagination}
                                footer={this.handleFooter}
                                size="small"
                                bordered
                            />
                        </div>                    
                    </QueueAnim>
                </Scrollbar>

                <FileUploadManager 
                    modal={modal}
                    data={data.upload_info}
                    handleClose={this.handleCloseUpload}
                />

                <ReturnDashboard
                    modal={modal}
                    data={data.customer_info}
                    master={{ return_code: returnCode.Data }}
                    authen={authen}
                    handleClose={this.handleCloseChatbox}
                />

                <MissingDoc 
                    modal={modal}
                    dataSource={missingData}
                    handleClose={this.handleCloseMissing}
                />

                <GetBorrower 
                    isOpen={modal.borrower}
                    data={borrowerData}
                    handleClose={this.handleBorrowerModal}
                />

            </div>

        )
    }

    //SET HEAD PANEL
    handleHeadFilter = () => {     
        const { filter, pagination } = this.state
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
            <Select style={{ width: 80 }} onChange={this.onChangeApplicationType}>
                <Option value="Application No" title="Application No">APP</Option>
                <Option value="Citizen ID" title="ID Card">ID</Option>
            </Select>
        )

        return (
            <div className={`${cls['search_collapse_conainer']}`}>
                <div style={{ position: 'relative' }}>
                    <div className={cls['page_container']}>
                        <label>
                            Show
                            <Select className={cls['page_sizenumber']} defaultValue={`${pagination.pageSize}`} size="small" onChange={this.handlePageChange}>
                                { _.map(config.pageSize, (v, i) => { return (<Option key={(i + 1)} value={`${v}`}>{`${v}`}</Option>) }) }
                            </Select>
                            entries
                        </label>
                        <div className="number_length"></div>
                    </div>
                </div>
                <div>
                    <Collapse className={`${cls['collapse_filter']}`}>
                        <Panel header={<header><Icon type="search" /> FILTER CRITERIA</header>}>
                            <Form onSubmit={this.handleSearchSubmit}>
                                <Row gutter={gutter_init}>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                </Row>
                                <Row gutter={gutter_init}>
                                    <Col span={6}>
                                        <FormItem label="Region" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Region', { initialValue: [] })
                                                (
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
                                                getFieldDecorator('Area', { initialValue: [] })
                                                (
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
                                                getFieldDecorator('Branch', { initialValue: [] })
                                                (
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
                                                getFieldDecorator('Employee', { initialValue: [] })
                                                (
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

class MissingDoc extends Component {

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    shouldComponentUpdate(nextProps) {
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
                            footer={null}
                            pagination={{}}
                            size="small"
                            bordered/>
                    </div>
                </QueueAnim>
            </Modal>
        )
        
    }

}

class GetBorrower extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.isOpen !== nextProps.isOpen ||
               this.props.data !== nextProps.data
    }

    render() {
        const { isOpen, data, handleClose } = this.props

        return (
            <Modal
                visible={isOpen}
                title={<span className="ttu">Borrower Information</span>}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="35%"
            >
                <Table                            
                    rowKey={this.handleRowKey}
                    className={cls['grid_table']}
                    columns={borrower_columns}
                    dataSource={data}
                    loading={(!_.isEmpty(data)) ? false : true}
                    size="small"
                    pagination={null}
                    bordered
                />
            </Modal>
        )
    }

}

const GridDocumentDashboardWithCookies = withCookies(GridDocument)
const GridDocumentManagement = Form.create()(GridDocumentDashboardWithCookies)
export default connect(
    (state) => ({
       gridData: state.DOCUMENTSCAN_DASHBOARD.Data,
       missingData: state.DOCUMENTSCAN_MISSINGDOC,
       returnCode: state.DOCUMENTSCAN_RETURNCODE,
       borrowerData: (state.DOCUMENTSCAN_GET_BORROWER && state.DOCUMENTSCAN_GET_BORROWER.Status) ? state.DOCUMENTSCAN_GET_BORROWER.Data: []
       //grid_message: state.DOCUMENTSCAN_GRID_MESSAGE,       
    }), 
    {
        GET_DOCUMENT_DASHBOARD: getDocumentScanDashboard,
        GET_MISSINGDOC_LIST: getMissingDocumentList,
        GET_MASTER_RETURNCODE: getMasterReturnCode,
        GET_BORROWER_LIST: getBorrowerInformation
        //GET_GRID_MESSAGE: getMessageInformation,
    }
)(GridDocumentManagement)

