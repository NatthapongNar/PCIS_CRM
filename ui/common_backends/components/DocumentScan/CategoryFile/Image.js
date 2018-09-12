import React, {Component} from 'react'
import fetch from 'isomorphic-fetch'
import {Spin, Icon} from 'antd'
import {PDF_IMAGE_URL} from '../../../constants/endpoints'

import ImageZoomPan from './ImageZoomPan'

export default class Image extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            src: null,
            IsError: false,
            ApplicationNo: props.ApplicationNo,
            FileId: props.FileId
        }

        this.getView = this
            .getView
            .bind(this)

        this.getPdfImageViewer = this
            .getPdfImageViewer
            .bind(this)

        this.arrayBufferToBase64 = this
            .arrayBufferToBase64
            .bind(this)
    }

    componentDidMount()
    {
        this.getPdfImageViewer();
    }

    getPdfImageViewer() {
        const {ApplicationNo, FileId, src} = this.props;
        // fetch(`${PDF_IMAGE_URL}/${ApplicationNo}/${FileId}`).then(res => {
        if (src) {
            fetch(src).then(res => {
                res
                    .arrayBuffer()
                    .then((buffer) => {
                        var base64Flag = 'data:image/jpeg;base64,';
                        var imageStr = this.arrayBufferToBase64(buffer);

                        this.setState({
                            src: base64Flag + imageStr
                        })
                    })
            }).catch(err => {
                this.setState({IsError: true})
            })
        }
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = []
            .slice
            .call(new Uint8Array(buffer));

        bytes.forEach((b) => binary += String.fromCharCode(b));

        return window.btoa(binary);
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        if (!nextState.IsError && this.state.IsError) {
            this.getPdfImageViewer()
            return true
        } else {
            return nextState.src != this.state.src || nextState.IsError
        }
    }

    getView()
    {
        const {src, IsError} = this.state
        const {style, className, onDoubleClick} = this.props

        if (src) {
            return (<ImageZoomPan
                className={className}
                onDoubleClick={onDoubleClick}
                style={style}
                src={src}/>)
        } else {
            if (IsError) {
                return (
                    <div
                        style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px',
                        border: '1px solid #969696',
                        ...style
                    }}>
                        <Icon
                            type="reload"
                            style={{
                            color: '#F44336',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}
                            onClick={() => this.setState({IsError: false})}/>
                        <span
                            style={{
                            fontSize: '.7rem'
                        }}>Load image failed, please try again.</span>
                    </div>
                )
            } else {
                const antIcon = <Icon
                    type="loading"
                    style={{
                    fontSize: 50
                }}
                    spin/>

                return (
                    <div
                        style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '3px',
                        background: '#e8e8e8',
                        border: '1px solid #969696',
                        ...style
                    }}><Spin indicator={antIcon}/></div>
                )
            }
        }
    }

    render()
    {
        return <div>{this.getView()}</div>
    }
}