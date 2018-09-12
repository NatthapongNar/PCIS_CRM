import React, {Component} from 'react'
import {connect} from 'react-redux'

import TreeFolderParent from './TreeFolderParent'

import {getDocumentMasterCategory} from '../../../actions/master'

class TreeFolder extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            selectedItem: props.selectedItem || null
        }
    }

    componentWillMount()
    {
        const {AUTH_INFO, getDocumentMasterCategory, applicationno} = this.props

        getDocumentMasterCategory(AUTH_INFO, applicationno);
    }

    componentWillReceiveProps(nextProps)
    {
        if (this.state.selectedItem != nextProps.selectedItem) {
            this.setState({selectedItem: nextProps.selectedItem});
        }
    }

    setSelectedHilight = (obj, root) => {
        const {onSelected} = this.props;
        this.setState({selectedItem: obj.CategoryCode});
        onSelected(obj, root);
    }

    generateFolder = () => {
        const {DOCUMENT_MASTER_CATEGORY} = this.props;
        const {selectedItem} = this.state;

        return DOCUMENT_MASTER_CATEGORY.map((item, i) => {
            const {
                applicationno,
                onSelected,
                ...custom
            } = this.props

            item.IsChildOpen = false;

            return <TreeFolderParent
                key={`${item.CategoryCode}_${i}`}
                onSelected={this.setSelectedHilight}
                root={[item]}
                data={item}
                selectedItem={selectedItem}/>
        })
    }

    render()
    {
        const {
            applicationno,
            onSelected,
            ...custom
        } = this.props

        return (
            <div {...custom}>{this.generateFolder()}</div>
        )
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY}), {getDocumentMasterCategory: getDocumentMasterCategory})(TreeFolder)