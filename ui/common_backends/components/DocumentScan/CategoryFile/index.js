import React, {Component} from 'react'
import {connect} from 'react-redux'
import update from 'immutability-helper'

import TreeView from './TreeView'
import PdfViewer from './PdfViwer'
import FontAwesome from 'react-fontawesome'

import CategoryFileHeader from './itemHeader'
import CreateReturnCode from '../ReturnComponent/create_returncode'

import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class MainCategory extends Component {

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

    OnDrop = Item => {
        const {type, context} = Item

        if (type == "FOLDER") {
            this.setState({SelectFileView: context.SubCategory})
        } else {
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
        const {DOCUMENT_MASTER_CATEGORY, match: { params }} = this.props

        return (
            <div className={styles['treeview_wrapper']}>
                <CategoryFileHeader masters={{ return_category: DOCUMENT_MASTER_CATEGORY }} />
                <div className={styles['pdf_wrapper']}>
                    <div className={styles['pdf_items']}>
                        <TreeView ApplicationNo={params.ApplicationNo} handleClickFolder={this.handleClickFolder}/>
                    </div>
                    <div className={styles['pdf_items']}>
                        <PdfViewer
                            OnDrop={this.OnDrop}
                            OnRefresh={() => this.setState({SelectFileView: []})}
                            ApplicationNo={params.ApplicationNo}
                            Files={this.state.SelectFileView}/>
                    </div>
                    <div className={styles['pdf_items']}>   
                        <CreateReturnCode
                            treeSelect={this.state.treeSelect}
                            masterTree={DOCUMENT_MASTER_CATEGORY}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {})(MainCategory)