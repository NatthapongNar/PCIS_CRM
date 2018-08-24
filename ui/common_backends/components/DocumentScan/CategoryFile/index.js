import React, {Component} from 'react'
import {connect} from 'react-redux'
import { withCookies } from 'react-cookie'
import update from 'immutability-helper'

import TreeView from './TreeView'
import PdfViewer from './PdfViwer'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar';
import {Link} from 'react-router-dom'

import CategoryFileHeader from './itemHeader'
import CreateReturnCode from '../ReturnComponent/create_returncode'

import { getCreateReturnCode, getMasterReturnReason } from '../../../actions/master'

import { config } from '../config'
import styles from './index.scss'

class MainCategory extends Component {

    constructor(props) {
        super(props)

        const { cookies, match: { params }, GET_DATA_RETURNCODE, GET_MASTER_RETURNREASON } = props
        const { cookieConfig } = config        
        const ck_info = cookies.get(cookieConfig.name.authen, { path: cookieConfig.path })
        
        if(!_.isEmpty(params.ApplicationNo)) {
            GET_DATA_RETURNCODE(params.ApplicationNo)
        }

        // INTIAL DATA
        GET_MASTER_RETURNREASON()

        this.state = {
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
            },
            authen: (!_.isEmpty(ck_info)) ? ck_info : []
        }

    }

    OnDrop = Item => {
        const {type, context} = Item
        if (type == "FOLDER") {
            this.setState({SelectFileView: context.SubCategory})
        } else {
            this.setState(update(this.state, { SelectFileView: { $push: [context] }}))
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
        const { authen } = this.state
        const { DOCUMENT_MASTER_CATEGORY, DOCUMENT_MASTER_RETURNREASON, RECENT_RETURN_DATA, match: { params } } = this.props

        return (
            <div className={styles['treeview_wrapper']}>
                <CategoryFileHeader 
                    authen={authen}
                    match={this.props.match}
                    recentReturnData={RECENT_RETURN_DATA}
                    masters={{ return_category: DOCUMENT_MASTER_CATEGORY, return_reason: DOCUMENT_MASTER_RETURNREASON }} 
                />
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
                            authen={authen}
                            match={this.props.match}
                            treeSelect={this.state.treeSelect}
                            recentReturnData={RECENT_RETURN_DATA}
                            masterTree={DOCUMENT_MASTER_CATEGORY}
                            masterReturnReason={DOCUMENT_MASTER_RETURNREASON}
                        />
                    </div>
                </div>

            </div>
        )
    }
}

const MainCategoryWrapper = withCookies(MainCategory)
export default connect((state) => (
    {
        AUTH_INFO: state.AUTH_INFO, 
        MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, 
        DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY,
        DOCUMENT_MASTER_RETURNREASON: (state.LOAD_MASTER_RETURNREASON && state.LOAD_MASTER_RETURNREASON.Status) ? state.LOAD_MASTER_RETURNREASON.Data : [],
        RECENT_RETURN_DATA: (state.LOAD_RETURNCODE_BUNDLE && state.LOAD_RETURNCODE_BUNDLE.Status) ? state.LOAD_RETURNCODE_BUNDLE.Data : []
    }), 
    {
        GET_DATA_RETURNCODE: getCreateReturnCode,
        GET_MASTER_RETURNREASON: getMasterReturnReason,
    }
)(MainCategoryWrapper)