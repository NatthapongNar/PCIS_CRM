import React, {Component} from 'react'
import {DropTarget, DragSource} from 'react-dnd'
import {Tooltip, Icon} from 'antd'
import FontAwesome from 'react-fontawesome'

const TreeItemType = {
    FOLDER: 'folder',
    FILE: 'file'
}

import styles from './index.scss'

const itemSource = {
    beginDrag(props) {
        return props
    },
    endDrag(props, monitor) {}
}

const itemTarget = {
    hover(props, monitor, component) {}
}

class TreeFolderItem extends Component {
    render() {
        const {
            key,
            data,
            root,
            onOpenChild,
            onSelected,
            connectDragSource,
            connectDropTarget
        } = this.props

        let style = [styles['treeview_item']]

        return connectDragSource(connectDropTarget(
            <div
                key={key}
                className={`${style.join(' ')}`}
                style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                borderRadius: '3px',
                padding: '5px'
            }}>
                <Icon
                    onClick={onOpenChild}
                    style={style}
                    className={`${styles['caret']} ${data.IsOpenChild && styles['caret-open']}`}
                    type="caret-right"/>
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%'
                }}
                    onClick={() => onSelected(data, root)}>
                    <FontAwesome
                        name="folder"
                        style={{
                        fontSize: '20px',
                        marginRight: '5px'
                    }}/>
                    <Tooltip mouseEnterDelay={0.4} placement="right" title={data.CategoryName}>
                        <span
                            style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}>{data.CategoryName}</span>
                    </Tooltip>
                </div>
            </div>
        ),)
    }
}

const DragItem = DragSource(TreeItemType.FILE, itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem()
}))(TreeFolderItem)

const DropItem = DropTarget([
    TreeItemType.FOLDER, TreeItemType.FILE
], itemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))(DragItem)

export default DropItem