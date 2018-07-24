import React, {Component} from 'react'
import {connect} from 'react-redux'
import update from 'immutability-helper'

import TreeView from './TreeView'
import PdfViewer from './PdfViwer'

class MainCategory extends Component {

    state = {
        DOCUMENT_MASTER_CATEGORY: [],
        nodeopen: [],
        IsDragging: null,
        DragingType: null,
        SelectFileView: []
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
            </div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {})(MainCategory)