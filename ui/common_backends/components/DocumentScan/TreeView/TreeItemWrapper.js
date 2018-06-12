import React, { Component } from 'react'

import styles from './index.scss'

export default class TreeView extends Component {
    render() {
        const {
            isCurrentHover,
            isSelected,
            isDragging,
            style
        } = this.props

        const styleClasses = []

        if (isSelected) {
            styleClasses.push(styles['treeview_selected'])
        }

        if (isDragging) {
            styleClasses.push(styles['treeview_dragging'])
        }

        if (isCurrentHover) {
            styleClasses.push(styles['treeview_current_hover'])
        }

        return (
            <div className={`${styles['treeview_item']} ${styleClasses.join(' ')}`} style={style}>{this.props.children}</div>
        )
    }
}