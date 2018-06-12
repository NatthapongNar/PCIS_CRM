import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Modal, Tooltip, Button, Icon, Form, TreeSelect, Row, Col, Card, Popconfirm, Collapse } from 'antd'

import QueueAnim from 'rc-queue-anim'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

const FormItem = Form.Item
const Panel = Collapse.Panel
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const tProps = {
    multiple: true,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    style: {
        width: '100%',
    }
}

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
}

import styles from './index.scss'

class EditFormUser extends Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: !_.isEmpty(props.data),
            data: props.data
        }
    }

    getRegionSelectItem() {
        const { MASTER_ALL: { MASTER_REGION_DATA } } = this.props

        if (!_.isEmpty(MASTER_REGION_DATA)) {
            return [{
                label: 'Select All',
                value: MASTER_REGION_DATA.map(item => item.RegionID).join(','),
                key: 'all',
                children: _.orderBy(MASTER_REGION_DATA, ['RegionID'], ['asc']).map((item, index) => {
                    return ({
                        label: item.RegionID,
                        value: `${item.RegionID}`,
                        key: `${item.RegionID}`
                    })
                })
            }]
        }
    }

    getAreaSelectItem() {
        const { MASTER_ALL: { MASTER_AREA_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_AREA_DATA)) {

            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')

            const AREA_DATA = _.filter(MASTER_AREA_DATA, (o) => !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID))))

            let resultGroupBy = [];
            _.mapKeys(_.groupBy(AREA_DATA, 'AreaID'), (value, key) => {
                let result = {
                    RegionID: value[0].RegionID,
                    AreaID: key,
                    Zone: []
                }
                _.mapKeys(_.groupBy(value, 'ZoneValue'), (i, k) => {
                    result.Zone.push({
                        ZoneValue: k,
                        ZoneText: i[0].ZoneText
                    })
                })
                resultGroupBy.push(result)
            })

            return [{
                label: 'Select All',
                value: resultGroupBy.map(item => item.AreaID).join(','),
                key: 'all',
                children: resultGroupBy.map((item, index) => ({
                    label: item.AreaID,
                    value: item.AreaID,
                    key: item.AreaID,
                    children: item.Zone.map(zone => ({
                        label: zone.ZoneText,
                        value: zone.ZoneValue,
                        key: zone.ZoneValue
                    }))
                }))
            }]
        }
    }

    getBranchSelectItem() {
        const { MASTER_ALL: { MASTER_BRANCH_DATA }, form: { getFieldValue } } = this.props

        if (!_.isEmpty(MASTER_BRANCH_DATA)) {
            const region_select = getFieldValue("RegionID") && getFieldValue("RegionID").join(',').split(',')
            const area_select = getFieldValue("AreaID") && getFieldValue("AreaID").join(',').split(',')

            const BRANCH_DATA = _.orderBy(_.filter(MASTER_BRANCH_DATA, o => {
                return !_.isEmpty(_.find(region_select, (s) => (s == o.RegionID)))
                    &&
                    !_.isEmpty(_.find(area_select, (s) => ((o.ZoneValue).indexOf(s) >= 0)))
            }), ['RegionID', 'AreaID', 'ZoneValue', 'BranchType'])

            let group = [];
            const branch = _.filter(BRANCH_DATA, o => o.BranchType != 'K')
            const kiosk = _.filter(BRANCH_DATA, { BranchType: 'K' })

            if (branch.length > 0) {
                branch.map(item => {
                    const obj = _.filter(BRANCH_DATA, { OriginBranchCode: item.BranchCode })
                    const valueKey = obj.map(m => m.BranchCode).join(",")

                    if (obj.length > 1) {
                        if (!_.isEmpty(_.find(obj, o => o.BranchType != 'K')) && !_.isEmpty(_.find(obj, { BranchType: 'K' }))) {
                            group.push({
                                label: item.BranchName,
                                value: valueKey,
                                key: valueKey,
                                children: obj.map(s => ({
                                    label: s.BranchName,
                                    value: s.BranchCode,
                                    key: s.BranchCode
                                }))
                            })
                        }
                        else {
                            obj.map(s => {
                                group.push({
                                    label: s.BranchName,
                                    value: s.BranchCode,
                                    key: s.BranchCode
                                })
                            })
                        }
                    }
                    else {
                        group.push({
                            label: item.BranchName,
                            value: valueKey,
                            key: valueKey
                        })
                    }
                })
            }
            else {
                kiosk.map(s => {
                    group.push({
                        label: s.BranchName,
                        value: s.BranchCode,
                        key: s.BranchCode
                    })
                })
            }

            return _.cloneDeep([{
                label: 'Select All',
                value: BRANCH_DATA.map(item => item.BranchCode).join(','),
                key: 'all',
                children: group
            }])
        }
    }


    componentWillReceiveProps(nextProps) {
        this.createMask()
        this.setState({ visible: !_.isEmpty(nextProps.data), data: nextProps.data })
    }

    componentWillMount() {
        this.createMask()
    }

    createMask = () => {
        if (document.getElementById('mask-modal-user-management') === null || document.getElementById('mask-modal-user-management') === undefined) {
            var divModal = document.createElement("div")
            divModal.id = 'mask-modal-user-management'
            if (document.getElementById('m-user-management')) {
                document.getElementById('m-user-management').appendChild(divModal)
            }
        }
    }

    handleDelete = () => {
        this.props.handleDelete();
    }

    handleOk = () => {
        this.props.handleOk()
    }

    handleCancel = () => {
        this.props.handleCancel()
    }

    render() {
        const { form: { getFieldDecorator, getFieldValue } } = this.props
        const { data } = this.state

        return (
            <Modal
                visible={this.state.visible}
                closable={false}
                wrapClassName={`${styles['user-management-form']}`}
                getContainer={() => document.getElementById("mask-modal-user-management")}
                maskClosable={true}
                mask={true}
                maskTransitionName="fade"
                footer={
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 -10px' }}>
                        <div style={{ flex: '1', textAlign: 'left' }}>
                            <Popconfirm
                                title="Are you sure delete this event?"
                                onConfirm={() => handleDelete(data)}>
                                <Tooltip title="Delete Event">
                                    <Button shape="circle" type="danger" icon="delete" ghost disabled={false} />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                        <div style={{ width: '100%', textAlign: 'right' }}>
                            <Tooltip title={`Save`}>
                                <Button icon="save" type="primary" onClick={this.handleOk} >Save</Button>
                            </Tooltip>
                        </div>
                    </div>
                }
                bodyStyle={{
                    padding: '0'
                }}
            >
                <div>
                    <div className={styles['form-user-management-header']} style={{ background: '#2196F3' }}>
                        <Icon type="user" />
                        <Tooltip title={`(${data.EmpCode} ${data.RegionID} | ${data.AreaID} | ${data.BranchName}) ${data.NameTH}`}><span>{`(${data.EmpCode} ${data.RegionID} | ${data.AreaID} | ${data.BranchName}) ${data.NameTH}`}</span></Tooltip>
                        <Icon onClick={this.handleCancel} type="close" className="close" />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <Card
                            className={styles['form-card']}
                            title={
                                <div>
                                    <Icon type="user" style={{ marginRight: '5px', color: '#2196F3' }} />
                                    <span>User Information</span>
                                </div>
                            }>
                            <Form>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Region`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}>
                                            {
                                                getFieldDecorator('RegionID', {
                                                    initialValue: [data.RegionID.toUpperCase()],
                                                    rules: [
                                                        { required: true, message: 'Please select region' },
                                                    ],
                                                })
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        className={styles['region_field']}
                                                        treeData={this.getRegionSelectItem()}
                                                        searchPlaceholder="Please select region"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Area/Zone`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('AreaID')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                        treeData={this.getAreaSelectItem()}
                                                        autoExpandParent={true}
                                                        searchPlaceholder="Please select area"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Branch`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('BranchCode')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("AreaID"))}
                                                        className={styles['branch_field']}
                                                        treeDefaultExpandAll={false}
                                                        treeData={this.getBranchSelectItem()}
                                                        dropdownMatchSelectWidth={false}
                                                        searchPlaceholder="Please select branch"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Region`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}>
                                            {
                                                getFieldDecorator('RegionID', {
                                                    initialValue: [data.RegionID.toUpperCase()],
                                                    rules: [
                                                        { required: true, message: 'Please select region' },
                                                    ],
                                                })
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        className={styles['region_field']}
                                                        treeData={this.getRegionSelectItem()}
                                                        searchPlaceholder="Please select region"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Area/Zone`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('AreaID')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                        treeData={this.getAreaSelectItem()}
                                                        autoExpandParent={true}
                                                        searchPlaceholder="Please select area"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Region`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}>
                                            {
                                                getFieldDecorator('RegionID', {
                                                    initialValue: [data.RegionID.toUpperCase()],
                                                    rules: [
                                                        { required: true, message: 'Please select region' },
                                                    ],
                                                })
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        className={styles['region_field']}
                                                        treeData={this.getRegionSelectItem()}
                                                        searchPlaceholder="Please select region"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Area/Zone`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('AreaID')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                        treeData={this.getAreaSelectItem()}
                                                        autoExpandParent={true}
                                                        searchPlaceholder="Please select area"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Region`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}>
                                            {
                                                getFieldDecorator('RegionID', {
                                                    initialValue: [data.RegionID.toUpperCase()],
                                                    rules: [
                                                        { required: true, message: 'Please select region' },
                                                    ],
                                                })
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        className={styles['region_field']}
                                                        treeData={this.getRegionSelectItem()}
                                                        searchPlaceholder="Please select region"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Area/Zone`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('AreaID')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                        treeData={this.getAreaSelectItem()}
                                                        autoExpandParent={true}
                                                        searchPlaceholder="Please select area"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Region`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}>
                                            {
                                                getFieldDecorator('RegionID', {
                                                    initialValue: [data.RegionID.toUpperCase()],
                                                    rules: [
                                                        { required: true, message: 'Please select region' },
                                                    ],
                                                })
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        className={styles['region_field']}
                                                        treeData={this.getRegionSelectItem()}
                                                        searchPlaceholder="Please select region"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            label={`Area/Zone`}
                                            colon={true}
                                            className={styles['row-label']}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('AreaID')
                                                    (
                                                    <TreeSelect
                                                        {...tProps}
                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                        treeData={this.getAreaSelectItem()}
                                                        autoExpandParent={true}
                                                        searchPlaceholder="Please select area"
                                                    />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={4}>
                                    <Col span={24}>
                                        <Collapse className={styles['form-user-panel']} bordered={false}>
                                            <Panel header={
                                                <div>
                                                    <Icon type="idcard" style={{ marginRight: '5px', color: '#F44336' }} />
                                                    <span>Authentication</span>
                                                </div>
                                            } key="1">
                                                <Row gutter={4}>
                                                    <Col span={12}>
                                                        <FormItem
                                                            label={`Region`}
                                                            colon={true}
                                                            className={styles['row-label']}
                                                            {...formItemLayout}>
                                                            {
                                                                getFieldDecorator('RegionID', {
                                                                    initialValue: [data.RegionID.toUpperCase()],
                                                                    rules: [
                                                                        { required: true, message: 'Please select region' },
                                                                    ],
                                                                })
                                                                    (
                                                                    <TreeSelect
                                                                        {...tProps}
                                                                        className={styles['region_field']}
                                                                        treeData={this.getRegionSelectItem()}
                                                                        searchPlaceholder="Please select region"
                                                                    />
                                                                    )
                                                            }
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={12}>
                                                        <FormItem
                                                            label={`Area/Zone`}
                                                            colon={true}
                                                            className={styles['row-label']}
                                                            {...formItemLayout}
                                                        >
                                                            {
                                                                getFieldDecorator('AreaID')
                                                                    (
                                                                    <TreeSelect
                                                                        {...tProps}
                                                                        disabled={_.isEmpty(getFieldValue("RegionID"))}
                                                                        className={`${styles['area_field']} ${styles['select-maxheight']}`}
                                                                        treeData={this.getAreaSelectItem()}
                                                                        autoExpandParent={true}
                                                                        searchPlaceholder="Please select area"
                                                                    />
                                                                    )
                                                            }
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row gutter={4}>
                                                    <Col span={12}>
                                                        <FormItem
                                                            label={`Branch`}
                                                            colon={true}
                                                            className={styles['row-label']}
                                                            {...formItemLayout}
                                                        >
                                                            {
                                                                getFieldDecorator('BranchCode')
                                                                    (
                                                                    <TreeSelect
                                                                        {...tProps}
                                                                        disabled={_.isEmpty(getFieldValue("AreaID"))}
                                                                        className={styles['branch_field']}
                                                                        treeDefaultExpandAll={false}
                                                                        treeData={this.getBranchSelectItem()}
                                                                        dropdownMatchSelectWidth={false}
                                                                        searchPlaceholder="Please select branch"
                                                                    />
                                                                    )
                                                            }
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </Panel>
                                        </Collapse>
                                    </Col>
                                </Row>
                                <Row gutter={4} style={{ marginTop: '10px' }}>
                                    <Col span={24}>
                                        <Collapse className={styles['form-user-panel']} bordered={false}>
                                            <Panel header={
                                                <div>
                                                    <Icon type="line-chart" style={{ marginRight: '5px', color: '#4CAF50' }} />
                                                    <span>Target</span>
                                                </div>
                                            } key="1">
                                                <p>{`text`}</p>
                                            </Panel>
                                        </Collapse>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </div >
                </div>
            </Modal >
        )
    }
}

const EditFormUserWrapper = Form.create()(EditFormUser)

export default connect(
    (state) => ({
        MASTER_ALL: state.MASTER_ALL
    }),
    {
    })(EditFormUserWrapper)