import React, {Component} from 'react'
import {connect} from 'react-redux'
import update from 'immutability-helper'

import TreeView from './TreeView'
import PdfViewer from './PdfViwer'

<<<<<<< HEAD
class MainCategory extends Component {
=======
import CategoryFileHeader from './itemHeader'
import CreateReturnCode from '../ReturnComponent/create_returncode'

import {getDocumentMasterCategory} from '../../../actions/master'

import styles from './index.scss'

class TreeView extends Component {
>>>>>>> 5e34f4a4021e44b266d9d6cc24ede439f0e147bf

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

<<<<<<< HEAD
    render()
    {
        const {match: {
                params
            }} = this.props

        return (
            <div
                style={{
                display: 'flex',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                background: '#FFF'
            }}>
                <TreeView ApplicationNo={params.ApplicationNo}/>
                <PdfViewer
                    OnDrop={this.OnDrop}
                    OnRefresh={() => this.setState({SelectFileView: []})}
                    ApplicationNo={params.ApplicationNo}
                    Files={this.state.SelectFileView}/>
=======
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

>>>>>>> 5e34f4a4021e44b266d9d6cc24ede439f0e147bf
            </div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {})(MainCategory)