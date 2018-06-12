import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { DropTarget, DragSource } from 'react-dnd'

import TreeItemType from './TreeItemType'

import { getEmptyImage } from 'react-dnd-html5-backend'


const itemSource = {
    canDrag(props, monitor) {
        // if (props.index == 1)
        //     return false
        // else
        //     return true
    },
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            text: props.text
        }
    },
    endDrag(props) {
        props.endDraggingItem({
            id: props.id,
            index: props.index,
            text: props.text
        })
    }
}

const itemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        if (dragIndex === hoverIndex) {
            return
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        const clientOffset = monitor.getClientOffset()

        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        //     return
        // }

        // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        //     return
        // }
        // console.log(hoverClientY > hoverMiddleY ? hoverIndex + 1 : hoverIndex)
        props.moveItem(dragIndex, hoverClientY > hoverMiddleY ? hoverIndex + 1 : hoverIndex)

        // monitor.getItem().index = hoverIndex
    }
}

class TreeView extends Component {

    componentWillReceiveProps(nextProps, nextState) {
        //console.log('componentWillReceiveProps', nextProps);
        if (!this.props.isDragging && nextProps.isDragging) {
            this.props.draggingItem(nextProps.item)
        }
    }

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), {
            // IE fallback: specify that we'd rather screenshot the node
            // when it already knows it's being dragged so we can hide it with CSS.
            captureDraggingState: true,
        })
    }

    clickItem = e => {
        let ctrlKey = false
        let shiftKey = false

        if (e.ctrlKey == true && e.shiftKey == true) {
            shiftKey = true
        }
        else {
            ctrlKey = e.ctrlKey
            shiftKey = e.shiftKey
        }

        this.props.clickItem(this.props.id, ctrlKey, shiftKey)
    }

    render() {
        const {
			text,
            isDragging,
            connectDragSource,
            connectDropTarget,
		} = this.props

        return connectDragSource(
            connectDropTarget(<div onClick={(e) => this.clickItem(e)}>{text}</div>),
        )
    }
}

const DragItem = DragSource(TreeItemType.FILE, itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem()
}))(TreeView)

const DropItem = DropTarget([TreeItemType.FOLDER, TreeItemType.FILE], itemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
}))(DragItem)

export default DropItem