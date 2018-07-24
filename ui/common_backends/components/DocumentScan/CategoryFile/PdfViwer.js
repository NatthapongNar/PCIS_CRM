import React, {Component} from 'react'
import {DropTarget, DragSource} from 'react-dnd'
import _ from 'lodash'
import {
    Icon,
    Slider,
    Row,
    Col,
    Button,
    Progress
} from 'antd'
import FontAwesome from 'react-fontawesome'
import TreeItemType from './TreeItemType'

import {getPdfImageViewer} from '../../../actions/master'
import Image from './Image'

import styles from './index.scss'
// import Scrollbar from 'react-smooth-scrollbar';

const itemTarget = {
    drop(props, monitor, component) {
        props.OnDrop(monitor.getItem())
    }
}

const ButtonGroup = Button.Group

class PdfViewer extends Component {

    constructor(props)
    {
        super(props)

        this.state = {
            Files: props.Files,
            FilesComponent: [],
            loading: false,

            runningItem: 0,
            total: props.Files.length,
            interval: null,

            columnValue: 3
        }

        this.setLoadingFile = this
            .setLoadingFile
            .bind(this)

        this.emptyFiles = this
            .emptyFiles
            .bind(this)
    }

    setColumn = columnValue => (columnValue >= 1 && columnValue <= 6) && this.setState({columnValue})

    getColumnImage = obj => new Array(this.state.columnValue)
        .fill(0)
        .map((o, i) => i < obj.length && (
            <div>
                <Image
                    key={obj[i].FileId}
                    ApplicationNo={this.props.ApplicationNo}
                    FileId={obj[i].FileId}/>
            </div>
        ))

    getContentPDF = () => {
        const {ApplicationNo, Files} = this.props
        const {columnValue} = this.state

        if (Files.length > 0) {
            return (
                <div
                    style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    {Files.map((item, index) => {
                        return (
                            <div
                                key={`${item.FileId}_${index}`}
                                style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: `${ 100 / this.state.columnValue}%`,
                                minHeight: '200px',
                                padding: '5px'
                            }}>
                                <Image
                                    key={item.FileId}
                                    ApplicationNo={this.props.ApplicationNo}
                                    FileId={item.FileId}/>
                            </div>
                        )
                    })
}
                </div>
            )
        }
    }

    emptyFiles() {
        if (this.state.FilesComponent.length <= 0) {
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

    PlusNumber = () => {
        if (this.state.runningItem == this.state.total) {
            clearInterval(this.state.interval)
            this.setState({loading: false, total: 0, runningItem: 0})
        } else {
            const item = this.state.Files[this.state.runningItem]
            const componentFiles = (
                <div
                    key={`${item.FileId}_${this.state.runningItem}`}
                    style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: `${ 100 / this.state.columnValue}%`,
                    minHeight: '200px',
                    padding: '5px'
                }}>
                    <Image
                        key={item.FileId}
                        ApplicationNo={this.props.ApplicationNo}
                        FileId={item.FileId}/>
                </div>
            )

            const FilesComponent = this.state.FilesComponent

            FilesComponent.push(componentFiles)

            this.setState({
                runningItem: this.state.runningItem + 1,
                FilesComponent
            })
        }
    }

    setLoadingFile(props) {
        if (props.Files.length > 0) {
            this.setState({
                interval: setInterval(this.PlusNumber, 300),
                loading: true,
                Files: props.Files,
                total: props.Files.length
            });
        }
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.Files !== this.state.Files) {
            this.setLoadingFile(nextProps);
        }
    }

    componentDidMount()
    {
        if (this.state.Files.length > 0) {
            this.setLoadingFile(this.props);
        }
    }

    componentDidUpdate()
    {
        this.refs.pdfContainer.scrollTop = this.refs.pdfContainer.scrollHeight;
    }

    render()
    {
        const {connectDropTarget, isOver, canDrop, Files} = this.props
        const {columnValue, runningItem, total, FilesComponent, loading} = this.state

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
                width: '100%',
                border: '1px solid #c5c5c5',
                borderRadius: '3px',
                overflow: 'hidden',
                margin: '10px 0',
                ...borderCanDrop
            }}>
                {loading && (
                    <div
                        style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        zIndex: '1',
                        background: 'rgba(255, 255, 255, 0.7)'
                    }}>
                        <Progress
                            type="circle"
                            percent={((runningItem) / total) * 100}
                            format={percent => `${runningItem}/${total}`}/>
                    </div>
                )}
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
                    }}
                        onClick={this.props.OnRefresh}>
                        <FontAwesome name="refresh"/>
                    </div>
                </div>
                <div
                    ref="pdfContainer"
                    style={{
                    display: 'block',
                    flex: '1',
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginLeft: '25px',
                    paddingBottom: '5px',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto'
                }}>
                    {this.emptyFiles()}
                    {FilesComponent.map(component => component)}
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
