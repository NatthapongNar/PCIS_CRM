import React, {Component} from 'react'
// import {connect} from 'react-redux' import {DropTarget, DragSource} from
// 'react-dnd' import update from 'immutability-helper'
import _ from 'lodash'
import {Icon, Popover} from 'antd'
import FontAwesome from 'react-fontawesome'
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
        this.setState({IsLoading: true});
    }

    handleImageErrored() {
        this.setState({IsLoading: false});
    }

    render()
    {
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

    state = {
        IsOpenChild: false
    }

    OpenFile = (obj) => {
        console.log(obj)
    }

    GenerateChildtem = () => {
        const {data, applicationno} = this.props

        if (data.SubCategory.length > 0 && data.IsOpenChild) {
            return data
                .SubCategory
                .map((obj, i) => {
                    if (!_.has(data, 'IsOpenChild')) 
                        data.IsOpenChild = false;
                    return (<ItemWrapper
                        key={i}
                        data={obj}
                        index={i}
                        type={obj.CategoryTypes}
                        applicationno={applicationno}/>)
                })
        }
    }

    OpenChild = () => {
        const {data, type} = this.props

        if (type == "FILE") {
            console.log(data)
        }
        data.IsOpenChild = !this.state.IsOpenChild
        this.setState({IsOpenChild: data.IsOpenChild});

    }

    GetIconCaret = () => {
        const {data, type} = this.props
        if (data.IsOpenChild && type == "FOLDER") {
            return <Icon type="caret-down"/>
        } else if (!data.IsOpenChild && type == "FOLDER") {
            return <Icon type="caret-right"/>
        } else {
            return
        }
    }

    render()
    {
        const {data, applicationno, type, index} = this.props

        return (
            <div key={(index + 1)} className={styles['treeview_container']}>
                <Popover
                    content={(<PdfImage type={type} applicaionno={applicationno} fileid={data.FileId}/>)}>
                    <div className={styles['treeview_header']} onClick={this.OpenChild}>
                        {this.GetIconCaret()}
                        {data.CategoryTypes == 'FOLDER'
                            ? <FontAwesome name="folder"/>
                            : <FontAwesome name="file-pdf-o"/>}
                        <Item
                            key={data.CategoryName}
                            id={data.CategoryCode}
                            index={index}
                            text={`${data.CategoryTypes == 'FOLDER' && `(${data.CategoryCode}) `}${data.CategoryName}`}
                            type={data.CategoryTypes}/>
                    </div>
                </Popover>
                <div className={styles['treeview_content']}>
                    {this.GenerateChildtem()}
                </div>
            </div>
        )
    }
}

export default ItemWrapper
