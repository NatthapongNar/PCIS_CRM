import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'

import TreeItemType from './TreeItemType'
import TreeItemWrapper from './TreeItemWrapper'
import TreeItem from './TreeItem'

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
}

const getItemStyles = (props) => {
    const { initialOffset, currentOffset } = props
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }

    let { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`

    return {
        transform
    }
}

class TreeViewItemLayer extends Component {

    renderItem(type, item) {
        switch (type) {
            case TreeItemType.FILE:
                return <TreeItemWrapper style={{ width: '300px' }}><div>{item.text}</div></TreeItemWrapper>
            default:
                return null
        }
    }

    render() {
        const { item, itemType, isDragging, count } = this.props

        if (!isDragging)
            return null

        return (
            <div style={layerStyles}>
                <div style={{ ...getItemStyles(this.props) }}>
                    {
                        this.renderItem(itemType, item)
                    }
                </div>
            </div>
        )
    }
}

export default DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
}))(TreeViewItemLayer)