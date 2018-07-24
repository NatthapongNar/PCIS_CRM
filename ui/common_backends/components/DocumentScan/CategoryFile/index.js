import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import update from 'immutability-helper'
import {Icon, Slider} from 'antd'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'
// import Scrollbar from 'react-smooth-scrollbar';

import Item from './item'
import ItemWrapper from './ItemWrapper'
import PdfViewer from './PdfViwer'

import CategoryFileHeader from './itemHeader'
import CreateReturnCode from '../ReturnComponent/create_returncode'

import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class TreeView extends Component {

    state = {
        DOCUMENT_MASTER_CATEGORY: [],
        nodeopen: [],
        IsDragging: null,
        DragingType: null,
        SelectFileView: [],
        treeSelect: {
            category: null,
            isOpen: false,
            level: 1,
            path: null
        }
    }

    componentWillMount()
    {
        const {AUTH_INFO, getDocumentMasterCategory, match: {
                params
            }} = this.props

        getDocumentMasterCategory(AUTH_INFO, params.applicationno);
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        const {DOCUMENT_MASTER_CATEGORY} = nextProps;

        if (DOCUMENT_MASTER_CATEGORY.length > 0) {
            this.setState({DOCUMENT_MASTER_CATEGORY})
        }
    }

    OnDragging = (value, type) => this.setState({IsDragging: value, DragingType: type})

    OnDrop = Item => {
        const {type, context} = Item

        if (type == "FOLDER") {} else {
            const {SelectFileView} = this.state
            this.setState(update(this.state, {
                SelectFileView: {
                    $push: [context]
                }
            }))
        }
    }

    GenerateTreeItem = Data => {
        return Data.map((obj, i) => {
            const {match: { params }} = this.props

            obj.IsChildOpen = false;

            return (
                <ItemWrapper
                    key={obj.CategoryName}
                    level={1}
                    path={obj.CategoryCode}
                    root={obj}
                    data={obj}
                    index={i}
                    type={obj.CategoryTypes}
                    applicationno={params.applicationno}
                    IsDragging={this.state.IsDragging}
                    DragingType={this.state.DragingType}
                    OnDragging={this.OnDragging}
                    handleClick={this.handleClickFolder}
                />
            )
        })
    }

    handleClickFolder = (treeState) => {        
        this.setState({ treeSelect: _.assign({}, this.state.treeSelect, treeState) })
    }

    render()
    {
        const {DOCUMENT_MASTER_CATEGORY} = this.state
        const {match: { params }} = this.props

        return (
            <div style={{ width: '100%', height: '100%' }}>

                <CategoryFileHeader masters={{ return_category: this.state.DOCUMENT_MASTER_CATEGORY }} />

                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        background: '#FFF'
                    }}>
       
                    <div
                        style={{
                        position: 'relative',
                        height: '600px',
                        width: '345px',
                        padding: '5px',
                        border: '1px solid #c5c5c5',
                        borderRadius: '3px',
                        overflow: 'auto',
                        margin: '10px'
                    }}>
                        <div
                            style={{
                            position: 'absolute',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            right: '5px',
                            border: '1px solid',
                            width: "25px",
                            height: "25px",
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}>
                            <FontAwesome
                                style={{
                                fontSize: '16px'
                            }}
                                name="eye"/>
                        </div>
                        {this.GenerateTreeItem(DOCUMENT_MASTER_CATEGORY)}
                    </div>

                    <PdfViewer
                        OnDrop={this.OnDrop}
                        ApplicationNo={params.applicationno}
                        Files={this.state.SelectFileView}
                    />

                    <CreateReturnCode
                        treeSelect={this.state.treeSelect}
                        masterTree={this.state.DOCUMENT_MASTER_CATEGORY}
                    />

                </div>

            </div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {getDocumentMasterCategory: getDocumentMasterCategory})(TreeView)
