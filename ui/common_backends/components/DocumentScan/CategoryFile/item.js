import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {DropTarget, DragSource} from 'react-dnd'
import {Tooltip} from 'antd'
import TreeItemType from './TreeItemType'
import FontAwesome from 'react-fontawesome'
import {getEmptyImage} from 'react-dnd-html5-backend'

import styles from './index.scss'

const itemSource = {
    beginDrag(props) {
        return props
    },
    endDrag(props, monitor) {
        props.OnDragging(false, null)
    }
}

const itemTarget = {
    hover(props, monitor, component) {
        const {onopen, type} = props

        if (type == "FOLDER") {
            onopen()
        } else {

            if (!component) {
                return null
            }
            const dragIndex = monitor
                .getItem()
                .index
            const hoverIndex = props.index

            // Don't replace items with themselves

            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50% When dragging
            // upwards, only move when the cursor is above 50% Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            /*props.moveItem(dragIndex, monitor.getItem(), hoverIndex)*/

            // Note: we're mutating the monitor item here! Generally it's better to avoid
            // mutations, but it's good here for the sake of performance to avoid expensive
            // index searches.

            /*monitor
                .getItem()
                .key = hoverIndex;*/
        }
    }
}

class TreeView extends Component {

    componentWillReceiveProps(nextProps, nextState) {
        if (!this.props.isDragging && nextProps.isDragging) {
            const {OnDragging} = this.props;
            OnDragging(true, nextProps.type);
        }
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
            handleClick
        } = this.props

        let style = [styles['treeview_item']]

        if (isOver) {
            style.push(styles['treeview_current_hover'])
        }

        const opacity = isDragging && DragingType != "FOLDER" ? 0 : 1

        return connectDragSource(connectDropTarget(
            <div
                className={`${style.join(' ')}`}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: '3px',
                    padding: type == "FOLDER" ? '5px 10px' : '5px',
                    opacity               
                }}
                onClick={ (type == 'FOLDER') ? handleClick.bind(this, { category: id, isOpen: !isOpen, level: level, path: path }) : () => {} }
            >
                {type == 'FOLDER'
                    ? <FontAwesome
                            name="folder"
                            style={{
                            color: '#2196F3',
                            fontSize: '20px',
                            marginRight: '5px'
                        }}/>
                    : <FontAwesome
                        name="file-pdf-o"
                        style={{
                        color: '#f44336',
                        fontSize: '20px',
                        marginRight: '5px'
                    }}/>}
                <Tooltip mouseEnterDelay={0.4} placement="right" title={text}>
                    <span>{text}</span>
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