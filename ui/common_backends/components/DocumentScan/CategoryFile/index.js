import React, {Component} from 'react'
import {connect} from 'react-redux'
import {DropTarget, DragSource} from 'react-dnd'
import _ from 'lodash'
import update from 'immutability-helper'
import {Icon, Slider} from 'antd'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar';
import {Link} from 'react-router-dom'

import Item from './item'

import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class TreeView extends Component {

    state = {
        DOCUMENT_MASTER_CATEGORY: [],
        nodeopen: []
    }

    moveItem = (dragIndex, hoverIndex) => {
        // const {DOCUMENT_MASTER_CATEGORY} = this.state; const dragItem =
        // DOCUMENT_MASTER_CATEGORY[dragIndex]; this.setState(update(this.state, {
        // DOCUMENT_MASTER_CATEGORY: {         $splice: [             [ dragIndex, 1 ],
        // [hoverIndex, 0, dragItem]         ]   } }))
    }

    componentWillMount()
    {
        const {AUTH_INFO, getDocumentMasterCategory} = this.props

        getDocumentMasterCategory(AUTH_INFO, '02-61-002856');
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        const {DOCUMENT_MASTER_CATEGORY} = nextProps;

        if (DOCUMENT_MASTER_CATEGORY.length > 0) {
            this.setState({DOCUMENT_MASTER_CATEGORY})
        }
    }

    GenerateTreeItem = Data => {
        return Data.map((obj, i) => {
            return (
                <div className={styles['treeview_container']}>
                    <div className={styles['treeview_header']}>
                        {obj.CategoryTypes == 'FOLDER' && <Icon type="caret-down"/>}
                        {obj.CategoryTypes == 'FOLDER'
                            ? <FontAwesome name="folder"/>
                            : <FontAwesome name="file-pdf-o"/>}
                        <Item
                            key={obj.CategoryName}
                            id={obj.CategoryCode}
                            index={i}
                            text={`${obj.CategoryTypes == 'FOLDER' && `(${obj.CategoryCode}) `}${obj.CategoryName}`}
                            moveItem={this.moveItem}/>
                    </div>
                    <div className={styles['treeview_content']}>
                        {obj.SubCategory.length > 0 && this.GenerateTreeItem(obj.SubCategory)}
                    </div>
                </div>
            )
        })
    }

    render()
    {
        const {DOCUMENT_MASTER_CATEGORY} = this.state
        return (
            <div
                style={{
                display: 'flex',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                background: '#FFF'
            }}>
                {/* Tools area */}
                <div
                    style={{
                    position: 'relative',
                    height: '600px',
                    width: '420px',
                    padding: '5px',
                    border: '1px solid #c5c5c5',
                    borderRadius: '3px',
                    overflow: 'auto',
                    margin: '10px'
                }}
                    overscrollEffect="bounce">
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
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'row',
                    position: 'relative',
                    height: '600px',
                    width: '500px',
                    padding: '5px',
                    border: '1px solid #c5c5c5',
                    borderRadius: '3px',
                    overflow: 'auto',
                    margin: '10px'
                }}>
                    <div
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid',
                            margin: '5px',
                            width: "17px",
                            height: "17px",
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}>
                            <Icon type="minus"/>
                        </div>
                        <Slider
                            style={{
                            margin: '5px',
                            height: '80px'
                        }}
                            vertical
                            max={6}
                            min={1}
                            step={1}/>
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid',
                            margin: '5px',
                            width: "17px",
                            height: "17px",
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}>
                            <Icon type="plus"/>
                        </div>
                        <div
                            style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid',
                            margin: '5px',
                            width: "17px",
                            height: "17px",
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}>
                            <FontAwesome name="refresh"/>
                        </div>
                    </div>
                    <div
                        style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <FontAwesome
                            style={{
                            fontSize: '50px',
                            color: '#F44336'
                        }}
                            name="exclamation-triangle"/>
                        <span>No PDF in view</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {getDocumentMasterCategory: getDocumentMasterCategory})(TreeView)
