import React, {Component} from 'react'
import {DropTarget, DragSource} from 'react-dnd'
import {Tooltip, Icon} from 'antd'
import TreeItemType from './TreeItemType'
import FontAwesome from 'react-fontawesome'

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

class TreeView extends Component {

    onItemSelect = () => {

    }

    render() {
        const {
            text,
            id,
            level,
            path,
            root,
            isOpen,
            isDragging,
            isOver,
            connectDragSource,
            connectDropTarget,
            type,
            DragingType,
            handleClickFolder,
            data
        } = this.props

        let style = [styles['treeview_item']]

        if (isOver) {
            style.push(styles['treeview_current_hover'])
        }

        const opacity = isDragging && DragingType != "FOLDER"
            ? 0
            : 1

        return connectDragSource(connectDropTarget(
            <div
                className={`${style.join(' ')}`}
                style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                borderRadius: '3px',
                padding: '5px',
                opacity
            }}
                onClick={this.onItemSelect}>
                <Icon
                    style={style}
                    className={`${styles['caret']} ${data.IsOpenChild && type == "FOLDER"
                    ? styles['caret-open']
                    : ''}`}
                    type="caret-right"/>
                <FontAwesome
                    name="folder"
                    style={{
                    color: '#5f6368',
                    fontSize: '20px',
                    marginRight: '5px'
                }}/>
                <Tooltip mouseEnterDelay={0.4} placement="right" title={text}>
                    <span
                        style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                    }}>{text}</span>
                </Tooltip>
            </div>
        ),)
    }
}

const DragItem = DragSource(TreeItemType.FILE, itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem()
}))(TreeView)

const DropItem = DropTarget([
    TreeItemType.FOLDER, TreeItemType.FILE
], itemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))(DragItem)

export default DropItem