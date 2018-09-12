import React, {Component} from 'react'
import _ from 'lodash'

import TreeFolderItem from './TreeFolderItem'

import styles from './index.scss'

class TreeFolderParent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            IsOpenChild: props.data.IsOpenChild || false
        }
    }

    GenerateChildtem = () => {
        const {IsOpenChild} = this.state;
        const {data, onSelected, selectedItem} = this.props;

        if (data.SubCategory.length > 0 && IsOpenChild) {
            return data
                .SubCategory
                .map((item, i) => {

                    if (!_.has(data, 'IsOpenChild')) 
                        item.IsOpenChild = false;
                    
                    return (<TreeFolderParent
                        key={`${item.CategoryCode}_${i}`}
                        onSelected={onSelected}
                        root={[
                        ...this.props.root,
                        item
                    ]}
                        data={item}
                        selectedItem={selectedItem}/>)
                })
        }
    }

    openChild = () => {
        const {data} = this.props

        data.IsOpenChild = !this.state.IsOpenChild
        this.setState({IsOpenChild: data.IsOpenChild});
    }

    render() {
        const {data, key, onSelected, selectedItem, root} = this.props

        return (
            <div key={key} className={styles['treeview_container']}>
                <div
                    className={`${styles['treeview_header']} ${data.CategoryCode == selectedItem && styles['treeview_hightlight']}`}>
                    <TreeFolderItem
                        key={`${key}_Parent`}
                        data={data}
                        root={root}
                        onOpenChild={this.openChild}
                        onSelected={onSelected}/>
                </div>
                <div className={styles['treeview_content']}>
                    {this.GenerateChildtem()}
                </div>
            </div>
        )
    }
}

export default TreeFolderParent
