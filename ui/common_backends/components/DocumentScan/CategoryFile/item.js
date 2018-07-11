import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {DropTarget, DragSource} from 'react-dnd'

import TreeItemType from './TreeItemType'

import {getEmptyImage} from 'react-dnd-html5-backend'

import styles from './index.scss'

const itemSource = {
    canDrag(props, monitor) {
        if (props.type == "FOLDER") {
            return false;
        } else {
            return true;
        }
    },
    // beginDrag(props) {     return {id: props.id, index: props.index, text:
    // props.text} },
    beginDrag(props) {
        return {id: props.id, index: props.index, type: props.type}
    },
    endDrag(props) {
        // props.endDraggingItem({id: props.id, index: props.index, text: props.text})
    }
}

const itemTarget = {
    hover(props, monitor, component) {

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
        props.moveItem(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here! Generally it's better to avoid
        // mutations, but it's good here for the sake of performance to avoid expensive
        // index searches.
        monitor
            .getItem()
            .index = hoverIndex
    }
}

class TreeView extends Component {

    // componentWillReceiveProps(nextProps, nextState) {
    // console.log('componentWillReceiveProps', nextProps);     if
    // (!this.props.isDragging && nextProps.isDragging) {         this .props
    // .draggingItem(nextProps.item)     } } componentDidMount() {     // Use empty
    // image as a drag preview so browsers don't draw it     // and we can draw
    // whatever we want on the custom drag layer instead.
    // this.props.connectDragPreview(getEmptyImage(), {         // IE fallback:
    // specify that we'd rather screenshot the node         // when it already knows
    // it's being dragged so we can hide it with CSS. captureDraggingState: true,
    // }) } clickItem = e => {     let ctrlKey = false     let shiftKey = false if
    // (e.ctrlKey == true && e.shiftKey == true) {         shiftKey = true     }
    // else {         ctrlKey = e.ctrlKey       shiftKey = e.shiftKey     }
    // this.props.clickItem(this.props.id, ctrlKey, shiftKey) }

    render() {
        const {
            text,
            isDragging,
            isOver,
            connectDragSource,
            connectDropTarget,
            data
        } = this.props

        let style = [styles['treeview_item']]

        if (isOver) {
            style.push(styles['treeview_current_hover'])
        }

        const opacity = isDragging
            ? 0
            : 1

        return connectDragSource(connectDropTarget(
            <div className={style.join(' ')} >{text}</div>
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