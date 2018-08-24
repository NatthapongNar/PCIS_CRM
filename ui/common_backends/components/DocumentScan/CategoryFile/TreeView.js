import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import update from 'immutability-helper'

import FontAwesome from 'react-fontawesome'
// import Scrollbar from 'react-smooth-scrollbar';

import ItemWrapper from './ItemWrapper'

import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class TreeView extends Component {

    state = {
        DOCUMENT_MASTER_CATEGORY: [],
        nodeopen: [],
        IsDragging: null,
        DragingType: null,
        SelectFileView: []
    }

    componentWillMount()
    {
        const {AUTH_INFO, getDocumentMasterCategory, ApplicationNo} = this.props

        getDocumentMasterCategory(AUTH_INFO, ApplicationNo);
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        const {DOCUMENT_MASTER_CATEGORY} = nextProps;

        if (DOCUMENT_MASTER_CATEGORY.length > 0) {
            this.setState({DOCUMENT_MASTER_CATEGORY})
        }
    }

    OnDragging = (value, type) => this.setState({IsDragging: value, DragingType: type})

    GenerateTreeItem = Data => {
        return Data.map((obj, i) => {
            const {ApplicationNo} = this.props

            obj.IsChildOpen = false;

            return <ItemWrapper
                key={obj.CategoryName}
                level={1}
                path={obj.CategoryCode}
                data={obj}
                index={i}
                type={obj.CategoryTypes}
                applicationno={ApplicationNo}
                IsDragging={this.state.IsDragging}
                DragingType={this.state.DragingType}
                OnDragging={this.OnDragging}
                handleClickFolder={this.props.handleClickFolder}/>
        })
    }

    render()
    {
        const {DOCUMENT_MASTER_CATEGORY} = this.state

        return (
            <div
                style={{
                position: 'relative',
                height: '600px',
                width: '100%',
                padding: '5px',
                border: '1px solid #c5c5c5',
                borderRadius: '3px',
                overflow: 'auto',
                margin: '10px 0',
                ...this.props.style
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
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {getDocumentMasterCategory: getDocumentMasterCategory})(TreeView)
