import React, { Component } from 'react'
import {DropTarget, DragSource} from 'react-dnd'
import _ from 'lodash'
import {Icon, Slider, Row, Col, Button } from 'antd'
import FontAwesome from 'react-fontawesome'
import TreeItemType from './TreeItemType'

import styles from './index.scss'
// import Scrollbar from 'react-smooth-scrollbar';

const itemTarget = {
    drop(props, monitor, component) {
        console.log(monitor.getItem())
        props.OnDrop(monitor.getItem())
    }
}

const ButtonGroup = Button.Group

class PdfViewer extends Component {

    state = {
        columnValue: 1
    }

    setColumn = columnValue => (columnValue >= 1 && columnValue <= 6) && this.setState({columnValue})

    getContentPDF = () => {
        const {ApplicationNo, Files} = this.props
        if (Files.length > 0) {
            return Files.map((File, index) => {
                return <div
                    className={styles['img_pdf']}
                    style={{
                    margin: '5px 5px 5px 0'
                }}><img
                    style={{
                    height: '100%',
                    width: '100%'
                }}
                    src={`http://172.17.9.94/documentservices/DocumentServicesRest.svc/document/file/${ApplicationNo}/${File.FileId}`}
                    alt={File.CategoryName}/></div>
            })
        } else {
            const {canDrop} = this.props

            let iconCanDrop = 'exclamation-triangle'
            let iconText = 'No PDF in view'
            let iconColor = {
                color: '#F44336'
            }

            if (canDrop) {
                iconColor.color = '#2196F3'
                iconCanDrop = 'download'
                iconText = 'Drop here for view pdf.'
            }

            return (
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <FontAwesome
                        style={{
                        fontSize: '50px',
                        ...iconColor
                    }}
                        name={iconCanDrop}/>
                    <span>{iconText}</span>
                </div>
            )
        }
    }

    render()
    {
        const {connectDropTarget, isOver, canDrop} = this.props
        const {columnValue} = this.state

        let borderCanDrop = {}

        if (canDrop) {
            borderCanDrop.borderColor = '#F44336'
        }

        if (isOver) {
            borderCanDrop.borderColor = '#2196F3'
        }

        return connectDropTarget(
            <div
                style={{
                display: 'flex',
                justifyContent: 'row',
                position: 'relative',
                height: '600px',
                width: '690px',
                border: '1px solid #c5c5c5',
                borderRadius: '3px',
                overflow: 'hidden',
                margin: '10px',
                ...borderCanDrop
            }}>

                <div
                    style={{
                    display: 'flex',
                    position: 'fixed',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20px',
                    margin: '3px'
                }}>

    
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid',
                        margin: '5px',
                        width: "17px",
                        height: "17px",
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }}
                        onClick={() => this.setColumn(columnValue + 1)}>
                        <Icon type="minus"/>
                    </div>
                    <Slider
                        style={{
                        margin: '5px',
                        height: '80px'
                    }}
                        vertical
                        max={6}
                        min={1}
                        step={1}
                        onChange={value => this.setColumn(value)}
                        value={columnValue}/>
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid',
                        margin: '5px',
                        width: "17px",
                        height: "17px",
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }}
                        onClick={() => this.setColumn(columnValue - 1)}>
                        <Icon type="plus"/>
                    </div>
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid',
                        margin: '5px',
                        width: "17px",
                        height: "17px",
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }}>
                        <FontAwesome name="refresh"/>
                    </div>
                </div>
                <div
                    style={{
                    display: 'block',
                    flex: '1',
                    marginLeft: '25px',
                    paddingBottom: '5px',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto'
                }}>
                    {this.getContentPDF()}
                </div>
            </div>
        )
    }
}

const DropItem = DropTarget([
    TreeItemType.FOLDER, TreeItemType.FILE
], itemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
}))(PdfViewer)

export default DropItem
