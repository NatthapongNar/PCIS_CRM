import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Modal, Tabs, Button, Progress, Icon, Tooltip, notification } from 'antd'
import { Receiver, UploadManager, UploadHandler } from 'react-file-uploader'
import Scrollbar from 'react-smooth-scrollbar'

import { UPLOAD_DOCUMENT_URL } from '../../constants/endpoints'
import { roundFixed, in_array } from './config/functional'

import cls from './style/index.scss'

const ButtonGroup = Button.Group
const TabPane = Tabs.TabPane

class FileUploadManager extends Component {

    state = {
        uploads: [],
        isReceiverOpen: true,
        tabState: 1
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.upload !== nextProps.modal.upload ||
               this.props.data !== nextProps.data ||
               this.state.uploads !== nextState.uploads ||
               this.state.tabState !== nextState.tabState

    }

    render() {
        const { uploads, tabState } = this.state
        const { modal } = this.props
 
        return (
            <Modal
                visible={modal.upload}
                title={<span className="ttu">{ (tabState == 1) ? 'Upload Document Management' : 'Preview Document Information' }</span>}
                onOk={null}
                onCancel={this.handleModalClose}
                footer={null}
                maskClosable={false}
                width="65%"
                wrapClassName={cls['modal_wrapper']}
            >
                <Tabs defaultActiveKey={`${tabState}`} activeKey={`${tabState}`} type="card" onChange={this.handleTabChange}>
                    <TabPane key="1" tab={<span><Icon type="upload" /> UPLOAD</span>} className="ttu">
                        <Receiver
                            customClass={`${cls['upload_container']}`}
                            isOpen={true}
                            onDragEnter={() => { }}
                            onDragOver={() => { }}
                            onDragLeave={() => { }}
                            onFileDrop={this.onFileDrop}
                        >                           
                            <div ref="inbox_upload" className={`${cls['drop_handle']}`}>
                                <Icon id="inbox" type="inbox" /> Drang & Drop 
                            </div>
                        </Receiver>

                        <div className={`${cls['upload_tools']}`}>
                            <div className={cls['tools']}></div>
                            <div className={cls['tools']}>
                                <ButtonGroup className={`${cls['tools']}`}>
                                    <Button type="primary" size="small" className="ttu"><Icon type="upload" /> Upload All</Button>
                                    <Button type="primary" size="small" className={`${cls['hide']}`}><Icon type="pause" /> Pause All</Button>
                                    <Button className={`${cls['deleteButton']} ttu`} size="small"><Icon type="delete" /> Delete All</Button>                            
                                </ButtonGroup>
                                <Button type="primary" shape="circle" className={cls['badge']}>{ (uploads && uploads.length > 0) ? uploads.length : 0 }</Button>
                            </div>
                        </div>

                        <Scrollbar>
                            <div className={cls['upload_wrapper']}>
                                <UploadManager
                                    customClass={cls['upload_helper']}
                                    // onUploadAbort={this.onUploadAbort}
                                    // onUploadStart={this.onUploadStart}
                                    // onUploadProgress={this.onUploadProgress}
                                    onUploadEnd={this.onUploadEnd}
                                    // progressDebounce={NUMBER}
                                    // reqConfigs={OBJECT}                    
                                    uploadDataHandler={this.uploadDataHandler}
                                    uploadErrorHandler={this.uploadErrorHandler}
                                    uploadHeaderHandler={this.uploadHeaderHandler}
                                    uploadUrl={UPLOAD_DOCUMENT_URL}
                                >
                                    {
                                        uploads.map(
                                            (file) => (
                                                <UploadHandler key={file.id} upload={this.upload} abort={() => {}} file={file} autoStart={false}>
                                                    {
                                                        ({ upload, abort }) => 
                                                        (                                                
                                                            <dl className={`${cls['upload_list']} tc`}>                                                 
                                                                <Tooltip placement="right" title={file.data.name}><dt className={cls['file__name']}>{file.data.name}</dt></Tooltip>
                                                                <dd>
                                                                    <span className={`${cls['file__type']} tc`}><Icon type="file-pdf" className={cls['icon']} /></span>
                                                                    <span className="file__id tc"><b>Ref:</b> {file.id}</span>                                                        
                                                                    <span className="file__size tc"><b>Size:</b> {roundFixed((file.data.size / 1000 / 1000), 2)} MB</span>                                                       
                                                                    <span className="file__status tc"><b>Status:</b> {this.getStatusString(file.status)}</span>
                                                                    <span className="file__progress tc"><Progress percent={file.progress} status={this.handleProgressStatus(file.status)} /></span>
                                                                    
                                                                    <ButtonGroup className={`mt1`}>
                                                                        <Button type="primary" icon="upload" onClick={upload} disabled={ (in_array(file.status, [-2, -1, 0])) ? false : true } />
                                                                        <Button icon="pause" className={cls['pauseButton']} className={`${cls['hide']}`} disabled={ (file.status === 1) ? false : true } />
                                                                        <Button icon="delete" className={cls['deleteButton']} disabled={ (in_array(file.status, [-2, -1, 0])) ? false : true } />
                                                                        <Button type="dashed" icon="sync" disabled={ (in_array(file.status, [-2, -1])) ? false : true } />
                                                                    </ButtonGroup>         
                                                                    {/* file.error */}
                                                                </dd>
                                                            </dl>
                                                        )
                                                    }
                                                </UploadHandler>
                                            )
                                        )
                                    }                 
                                </UploadManager>
                            </div>
                        </Scrollbar>
                    </TabPane>
                    <TabPane key="2" tab={<span><Icon type="copy" /> VIEW FILES</span>} className="ttu">
                        <Scrollbar></Scrollbar>
                    </TabPane>
                </Tabs>
            </Modal>
        )

    }

    handleModalClose = () => {
        const { handleClose } = this.props

        this.setState({ uploads: [], tabState: 1 })

        handleClose()
    }

    handleTabChange = (key) => {
        this.setState({ tabState: key });
    }

    // UPLOAD PHYSICAL EVENT HANDLE
    onDragEnter = (e) => {
        this.setState({ isReceiverOpen: true });
    }

    onDragLeave = (e) => {
        this.setState({ isReceiverOpen: false });
    }

    onFileDrop = (e, uploads) => {
        const node = ReactDOM.findDOMNode(this.refs.inbox_upload)

        if (e.target !== node && e.target !== document.getElementById('inbox')) { return }

        let file_unsupport = []
        _.forEach(uploads, (v) => {
            if(v.data.type !== 'application/pdf')
                file_unsupport.push('TRUE')
            else
                file_unsupport.push('FALSE')            
        })

        if(in_array('TRUE', file_unsupport)) { 
            notification.error({
                message: 'Files Upload',
                description: 'ขออภัย! ระบบรองรับไฟล์การอัพโหลดข้อมูลเฉพาะ PDF เท่านั้น'
            })
            return 
        }

        let newUploads = uploads.map(upload => {
            // if (upload.data.size > 10000 * 10000) {
            //   return Object.assign({}, upload, { error: 'file size exceeded 1MB' });
            // }                           
            return upload
        })

        this.setState({ uploads: this.state.uploads.concat(newUploads) })
    }

    onFileUpdate(fileId, fileData) {
        const { uploads } = this.state

        let newFiles = uploads.map(item => item.id === fileId ? Object.assign({}, item, fileData) : item)
        this.setState({ uploads: newFiles })
    }

    // UPLOAD MANAGER
    upload = (file) => {
        console.log(file)
    }

    uploadHeaderHandler = (upload) => {
        return {
            'Content-Type': upload.data.type,
            'Content-Disposition': 'inline'
        }
    }

    uploadDataHandler = (upload) => {
        const formData = new FormData()
        formData.append('file', upload.data)
        formData.append('custom-key', 'custom-value')
        return formData
    }

    uploadErrorHandler(err, res) {
        const body = res.body ? clone(res.body) : {}
        let error = null

        if (err)
            error = err.message
        else if (body.errors)
            error = body.errors

        delete body.errors

        return { error, result: body }

    }

    handleProgressStatus = (status) => {
        if(status == 2)
            return 'success'            
        else if (in_array(status, [-2, -1]))
            return 'exception'
        else
            return 'active'
    }

    getStatusString = (status) => {
        switch (status) {
            case -2:
                return 'Aborted'
            case -1:
                return 'Failed'
            case 0:
                return 'Pending'
            case 1:
                return 'Uploading'
            case 2:
                return 'Uploaded'
            default:
                return ''
        }
    }

    // EVENT UPLOADER
    onUploadStart = (fileId, { status }) => {
        console.log(fileId, { status })
    }

    onUploadAbort = (fileId, { status }) => {
        console.log(fileId, { status })
    }

    onUploadProgress = (fileId, { progress, status }) => {
        console.log(fileId, { progress, status })
    }

    onUploadEnd = (fileId, { error, progress, result, status }) => {
        console.log(fileId, { error, progress, result, status })
    }


}

export default connect(
    (state) => ({}),
    {}
)(FileUploadManager)

