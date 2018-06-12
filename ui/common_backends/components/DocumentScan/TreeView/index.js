import React, { Component } from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Divider } from 'antd'
import { DropTarget, DragSource } from 'react-dnd'
import _ from 'lodash'
import update from 'immutability-helper'

import { Icon } from 'antd'

import TreeViewItemLayer from './TreeItemLayer'
import TreeItemWrapper from './TreeItemWrapper'
import TreeItem from './TreeItem'

import styles from './index.scss'

class TreeView extends Component {

    // state = {
    // data: [{
    //     name: '1',
    //     children: [{
    //         name: '1.1'
    //     }, {
    //         name: '1.2'
    //     }, {
    //         name: '1.3',
    //         type: 'file'
    //     }]
    // }, {
    //     name: '2',
    //     children: [{
    //         name: '2.1',
    //         children: [{
    //             name: '2.1.1'
    //         }, {
    //             name: '2.1.2',
    //             children: [{
    //                 name: '2.1.2.1',
    //                 type: 'file'
    //             }, {
    //                 name: '2.1.2.2',
    //                 type: 'file'
    //             }]
    //         }]
    //     }, {
    //         name: '2.2',
    //         children: [{
    //             name: '2.2.1'
    //         }, {
    //             name: '2.2.2'
    //         }]
    //     }]
    // }, {
    //     name: '3'
    // }, {
    //     name: '4'
    // }, {
    //     name: '5'
    // }, {
    //     name: '6'
    // }, {
    //     name: '7'
    // }],
    //     nodeopen: []
    // }

    // openNode(node) {
    //     let nodeopen = this.state.nodeopen

    //     nodeopen.push(node)

    //     this.setState({ nodeopen })
    // }

    // closeNode(node) {
    //     let nodeopen = this.state.nodeopen

    //     _.remove(nodeopen, node)

    //     this.setState({ nodeopen })
    // }

    // getDropDownIcon(node) {
    //     if (node.type == 'file') {
    //         return <Icon type="file-pdf" style={{ color: '#F44336', fontWeight: '600' }} />
    //     }
    //     else {
    //         if ((node.children || []).length > 0) {
    //             if (_.find(this.state.nodeopen, node)) {
    //                 return <Icon type="down-square-o" onClick={() => this.closeNode(node)} />
    //             }
    //             else {
    //                 return <Icon type="right-square-o" onClick={() => this.openNode(node)} />
    //             }
    //         }
    //         else {
    //             return <span />
    //         }
    //     }
    // }

    // moveItem = (dragIndex, hoverIndex) => {

    //     const data = _.cloneDeep(this.state.data)

    //     const dragItem = this.state.data[dragIndex]
    //     console.log(data[dragIndex])
    //     console.log(data[hoverIndex])
    //     console.log(dragIndex, hoverIndex)
    //     data.splice(dragIndex, 1, data[hoverIndex])
    //     this.setState({ data })


    //     // this.setState(
    //     //     update(this.state, {
    //     //         data: {
    //     //             $splice: [[dragIndex, 1], [hoverIndex, 0, dragItem]],
    //     //         },
    //     //     })
    //     // )
    // }

    // render() {
    //     return (
    //         <QueueAnim type='bottom'>
    //             {
    //                 this.state.data.map((item, index) => (
    //                     <TreeItem
    //                         key={index}
    //                         index={index}
    //                         id={item.name}
    //                         text={item.name}
    //                         moveItem={this.moveItem}
    //                     />
    //                 ))
    //             }
    //         </QueueAnim>
    //     )
    // }



    state = {
        data: [{
            name: '1',
            children: [{
                name: '1.1'
            }, {
                name: '1.2'
            }, {
                name: '1.3',
                type: 'file'
            }]
        }, {
            name: '2',
            children: [{
                name: '2.1',
                children: [{
                    name: '2.1.1'
                }, {
                    name: '2.1.2',
                    children: [{
                        name: '2.1.2.1',
                        type: 'file'
                    }, {
                        name: '2.1.2.2',
                        type: 'file'
                    }]
                }]
            }, {
                name: '2.2',
                children: [{
                    name: '2.2.1'
                }, {
                    name: '2.2.2'
                }]
            }]
        }, {
            name: '3'
        }, {
            name: '4'
        }, {
            name: '5'
        }, {
            name: '6'
        }, {
            name: '7'
        }],
        nodeopen: [],
        selectedItems: [],
        draggingItems: [],
        hoverIndex: null,
    }

    openNode(node) {
        let nodeopen = this.state.nodeopen

        nodeopen.push(node)

        this.setState({ nodeopen })
    }

    closeNode(node) {
        let nodeopen = this.state.nodeopen

        _.remove(nodeopen, node)

        this.setState({ nodeopen })
    }

    getDropDownIcon(node) {
        if (node.type == 'file') {
            return <Icon type="file-pdf" style={{ color: '#F44336', fontWeight: '600' }} />
        }
        else {
            if ((node.children || []).length > 0) {
                if (_.find(this.state.nodeopen, node)) {
                    return <Icon type="down-square-o" onClick={() => this.closeNode(node)} />
                }
                else {
                    return <Icon type="right-square-o" onClick={() => this.openNode(node)} />
                }
            }
            else {
                return <span />
            }
        }
    }


    moveItem = (dragIndex, hoverIndex) => {
        const { data } = this.state
        const dragItem = data[dragIndex]

        // console.log(hoverIndex)

        this.setState({ hoverIndex })
        // this.setState(
        //     update(this.state, {
        //         data: {
        //             $splice: [[dragIndex, 1], [hoverIndex, 0, dragItem]],
        //         },
        //     }),
        // )
    }

    clickItem = (item, ctrlKey, shiftKey) => {
        let selectedItems = []
        let prevSelectedItems = this.state.selectedItems

        if (ctrlKey == true && shiftKey == false) {
            if (prevSelectedItems.indexOf(item) > -1) {
                selectedItems = prevSelectedItems.filter(id => id != item)
            }
            else {
                selectedItems = [...prevSelectedItems, item]
            }
        }
        else if (ctrlKey == false && shiftKey == true) {

        }
        else {
            selectedItems = [item]
        }

        this.setState({ selectedItems })
    }

    draggingItem = (item) => {
        let draggingItems = [item.id]

        this.setState({ draggingItems, selectedItems: [item.id] })
    }

    endDraggingItem = (item) => {
        let draggingItems = this.state.draggingItems
        _.remove(draggingItems, o => o == item.id)

        this.setState({ draggingItems, hoverIndex: null })
    }

    render() {
        const {
            data,
            selectedItems,
            draggingItems
        } = this.state

        const divider = {

            backgroundColor: 'red'
        }
        console.log(this.state.hoverIndex, draggingItems)
        return (
            <div style={{ marginTop: '15px' }}>
                {data.map((item, i) => (
                    <div>
                        {
                            i == this.state.hoverIndex
                            && !draggingItems.includes(item.name)
                            && this.state.hoverIndex < this.state.data.length
                            && < Divider style={{ backgroundColor: 'red' }} />}
                        <TreeItemWrapper
                            isCurrentHover={i == this.state.hoverIndex && draggingItems.includes(item.name) || i == this.state.hoverIndex - 1 && draggingItems.includes(item.name)}
                            isSelected={selectedItems.includes(item.name)}
                            isDragging={draggingItems.includes(item.name)}
                        >
                            <TreeItem
                                key={item.name}
                                index={i}
                                id={item.name}
                                text={item.name}
                                moveItem={this.moveItem}
                                clickItem={this.clickItem}
                                draggingItem={this.draggingItem}
                                endDraggingItem={this.endDraggingItem}
                            />
                        </TreeItemWrapper>
                        {i + 1 == this.state.hoverIndex && this.state.hoverIndex == this.state.data.length && < Divider style={{ backgroundColor: 'red' }} />}
                    </div>
                ))}
                <TreeViewItemLayer count={this.state.selectedItems.length} />
            </div>

        )
    }
}

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA
    }),
    {
    })(TreeView)

