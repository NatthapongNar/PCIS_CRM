import React, {Component} from 'react'
// import {connect} from 'react-redux' import {DropTarget, DragSource} from
// 'react-dnd' import update from 'immutability-helper'
import _ from 'lodash'
import {Icon, Popover, Tooltip} from 'antd'
import FontAwesome from 'react-fontawesome'
import QueueAnim from 'rc-queue-anim'
import update from 'immutability-helper'
// import {Link} from 'react-router-dom' import Scrollbar from
// 'react-smooth-scrollbar';

import Item from './item'

// import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class PdfImage extends Component {

    state = {
        IsLoading: true
    }

    handleImageLoaded() {
        this.setState({IsLoading: false});
    }

    handleImageErrored() {
        this.setState({IsLoading: false});
    }

    render() {
        const {type, applicaionno, fileid} = this.props

        if (type == "FILE") 
            return (
                <div
                    style={{
                    width: '400px',
                    height: '400px'
                }}>
                    <img
                        style={{
                        width: '100%',
                        height: '100%'
                    }}
                        src={`http://172.17.9.94/documentservices/DocumentServicesRest.svc/document/file/${applicaionno}/${fileid}`}/>
                </div>
            )
        else 
            return <span></span>
    }

}

class ItemWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            level: props.level,
            path: props.path,
            root: props.root,
            data: props.data,
            subdata: props.data.SubCategory,
            type: props.type,
            applicationno: props.applicationno,
            OnDragging: props.OnDragging,
            IsOpenChild: props.data.IsOpenChild || false
        }
    }

    GenerateChildtem = () => {
        const {
            data,
            subdata,
            applicationno,
            OnDragging,
            path,
            level
        } = this.state
        const nextLevel = level + 1

        if (subdata.length > 0 && data.IsOpenChild) {
            return subdata.map((obj, i) => {

                if (!_.has(data, 'IsOpenChild')) 
                    data.IsOpenChild = false;
                
                return (<ItemWrapper
                    level={nextLevel}
                    path={`${path}/${obj.CategoryCode}`}
                    key={obj.CategoryName}
                    root={data}
                    data={obj}
                    index={i}
                    type={obj.CategoryTypes}
                    applicationno={applicationno}
                    IsDragging={this.props.IsDragging}
                    DragingType={this.props.DragingType}
                    OnDragging={OnDragging}
                    moveItem={this.moveItem}
                    handleClickFolder={this.props.handleClickFolder}/>)
            })
        }
    }

    OpenChild = () => {
        const {data, type, IsDragging, DragingType} = this.props

        if (DragingType != "FOLDER") {
            if (type == "FOLDER") {
                if (IsDragging) {
                    if (!this.state.IsOpenChild) {
                        data.IsOpenChild = !this.state.IsOpenChild
                        this.setState({IsOpenChild: data.IsOpenChild});
                    }
                } else {
                    data.IsOpenChild = !this.state.IsOpenChild
                    this.setState({IsOpenChild: data.IsOpenChild});
                }
            }
        }
    }

    moveItem = (dragIndex, dragItem, hoverIndex) => {
        const {type} = this.props
        // console.log(this.props.data, dragIndex, hoverIndex)

        const {subdata} = this.state
        const selectItem = subdata[dragIndex]
        var sub = update(subdata, {
            $splice: [
                [
                    dragIndex, 1
                ],
                [hoverIndex, 0, selectItem]
            ]
        })
        this.setState({subdata: sub})
        /*this.setState(update(subdata, {
            $splice: [
                [dragIndex, 1]
            ]
        }))*/

    }

    GetIconCaret = () => {
        const {data, type} = this.state
        const style = {
            marginRight: '0'
        }

        if (data.IsOpenChild && type == "FOLDER") {
            return <Icon style={style} type="caret-down"/>
        } else if (!data.IsOpenChild && type == "FOLDER") {
            return <Icon style={style} type="caret-right"/>
        } else {
            return
        }
    }

    render() {
        const {data, IsOpenChild, OnDragging, level, path} = this.state

        const {root, moveItem, index, key, DragingType} = this.props

        let i = index;

        return (
            <div key={(index + 1)} className={styles['treeview_container']}>
                <div className={styles['treeview_header']} onClick={this.OpenChild}>

                    <Item
                        level={level}
                        path={path}
                        id={data.CategoryCode}
                        data={data}
                        root={root}
                        index={i}
                        text={`${data.CategoryTypes == 'FOLDER' && `(${data.CategoryCode}) `}${data.CategoryName}`}
                        type={data.CategoryTypes}
                        context={data}
                        onopen={() => this.OpenChild()}
                        OnDragging={OnDragging}
                        DragingType={DragingType}
                        moveItem={moveItem || this.moveItem}
                        isOpen={IsOpenChild}
                        handleClickFolder={this.props.handleClickFolder}/>
                </div>
                <div className={styles['treeview_content']}>
                    {this.GenerateChildtem()}
                </div>
            </div>
        )
    }
}

export default ItemWrapper
