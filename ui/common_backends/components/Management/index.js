import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {app_config} from '../App/config'
import moment from 'moment'

import {
    Icon,
    Table,
    Divider,
    Tag,
    Breadcrumb,
    Drawer,
    Tabs,
    Steps,
    Popover,
    Tooltip,
    Badge,
    Button,
    Progress,
    Modal,
    Input
} from 'antd';

import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'

import {getDocumentMasterCategory, getFolderAndFiles} from '../../actions/master'
import ItemWrapper from '../DocumentScan/CategoryFile/ItemWrapper'

import ReturnCodeVerify from '../DocumentScan/ReturnComponent/return_verifycode'
import ReturnDashboard from '../DocumentScan/ReturnComponent/grid_returncode'
import ImageZoomPan from '../DocumentScan/CategoryFile/Image'
import TreeFolder from './TreeFolder'

import IconButton from '@material-ui/core/IconButton';

import {URL_DOCUMENT_API} from '../../constants/endpoints'

import EBook from './EBook'
import SlideViewPDF from './SlideViewPDF'
import ContextMenu from './ContextMenu'

import styles from './index.scss'

const {TextArea} = Input;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

const columns = [
    {
        title: 'CategoryName',
        dataIndex: 'CategoryName',
        key: 'CategoryName',
        align: 'left',
        width: '50%',
        render: (text, record, index) => <div
                style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {record.Type == "Folder"
                    ? <FontAwesome
                            name="folder"
                            style={{
                            color: '#5f6368',
                            fontSize: '20px',
                            marginRight: '5px'
                        }}/>
                    : <Icon
                        type="file-pdf"
                        theme="outlined"
                        style={{
                        color: '#F44336',
                        fontSize: '20px',
                        marginRight: '5px'
                    }}/>
}
                <span>{text}</span>
            </div>
    }, {
        title: 'Upload Owner',
        dataIndex: 'age',
        key: 'age',
        align: 'center'
    }, {
        title: 'Create Date',
        dataIndex: 'address',
        key: 'address',
        align: 'center'
    }, {
        title: 'Update Date',
        key: 'tags',
        dataIndex: 'tags',
        align: 'center'
    }, {
        title: 'Update By',
        key: 'updateby',
        dataIndex: 'updateby',
        align: 'left'
    }
];

const data = [
    {
        key: '1',
        name: 'ใบอนุมัติสินเชื่อ CA',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }, {
        key: '2',
        name: 'ชุดการวิเคราะห์สินเชื่อ',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }, {
        key: '3',
        name: 'ชุดอนุมัติลดอัตราดอกเบี้ยและค่าธรรมเนียม',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }, {
        key: '4',
        name: 'File 01',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }, {
        key: '5',
        name: 'File 02',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }, {
        key: '6',
        name: 'File 03',
        age: 'XXXXXX.X',
        address: moment().format("DD/MM/YYYY"),
        tags: moment().format("DD/MM/YYYY"),
        updateby: 'XXXXXX.X'
    }
];

const content = (
    <div>
        <p>(3420500391557) สุริยนต์ ขุนนุบาล (ผู้กู้หลัก)</p>
        <p>(3670300365828) กอบกุล ขุนนุบาล (ผู้กู้ร่วม)</p>
    </div>
)

class DocumentDetail extends Component {

    state = {
        DOCUMENT_MASTER_CATEGORY: [],
        nodeopen: [],
        IsDragging: null,
        DragingType: null,
        SelectFileView: [],
        imgInforSrc: null,
        imgForSlide: [],
        IsOpenInfo: false,
        IsOpen3DView: false,
        IsOpenReturnDocument: false,
        IsOpenReturnInfo: false,
        IsEbookOpen: false,
        HeaderPath: [],
        selectedCategoryCode: null
    }

    componentWillMount()
    {
        const {AUTH_INFO, getFolderAndFiles, match: {
                params
            }} = this.props
        // getDocumentMasterCategory(AUTH_INFO, '02-61-002856');
        getFolderAndFiles(AUTH_INFO, params.ApplicationNo, '', '');
    }

    GenerateTreeItem = Data => {
        return Data.map((obj, i) => {
            const {ApplicationNo} = this.props

            obj.IsChildOpen = false;

            return <ItemWrapper onClick={() => console.log("click")}/>
        })
    }

    handleClickFolder = () => {}

    showDrawer = () => {
        this.setState({
            IsOpenInfo: !this.state.IsOpenInfo
        });
    };

    open3DDrawer = () => {
        this.setState({
            IsOpen3DView: !this.state.IsOpen3DView
        });
    };

    OpenReturnDocument = () => this.setState({
        IsOpenReturnDocument: !this.state.IsOpenReturnDocument
    })

    OpenReturnInfo = () => this.setState({
        IsOpenReturnInfo: !this.state.IsOpenReturnInfo
    })

    OpenEbook = () => this.setState({
        IsEbookOpen: !this.state.IsEbookOpen
    })

    slidViewPDFClick = (obj) => {
        this.setState({imgInforSrc: obj.src})
    }

    ViewPDFDoubleClick = (obj) => {
        window.open(obj.src, "Image", "menubar=no,resizable=no,scrollbars=yes,location=no,toolbar=no,titlebar=no");
    }

    getItemInFolder = (obj, root) => {
        const {AUTH_INFO, getFolderAndFiles, match: {
                params
            }} = this.props;

        getFolderAndFiles(AUTH_INFO, params.ApplicationNo, obj.CategoryCode, obj.NodeId);

        const imgForSlide = this.getImageFromFolder(obj);

        this.setState({HeaderPath: root, selectedCategoryCode: obj.CategoryCode, imgInforSrc: null, imgForSlide: imgForSlide})
    }

    onFolderNFilesDoubleClick = (obj, root) => {
        if (obj.Type == "Folder") {
            this.getItemInFolder(obj, root);
        } else {}
    }

    onFolderNFilesClick = (obj, root) => {
        if (obj.Type == "Folder") {} else {
            this.setInformation(obj);
        }
    }

    getImageFromFolder = () => {
        const {DOCUMENT_FOLDER_N_FILES, match: {
                params
            }} = this.props

        const link = `${URL_DOCUMENT_API}/document/file/${ ''}`

        return DOCUMENT_FOLDER_N_FILES.map((item, index) => ({id: item.CategoryCode, src: `${link}/${params.ApplicationNo}/${item.CategoryCode}`}))
    }

    setInformation = (obj) => {
        const {match: {
                params
            }} = this.props
        const link = `${URL_DOCUMENT_API}/document/file/${ ''}/${params.ApplicationNo}/${obj.CategoryCode}`

        this.setState({imgInforSrc: link})
    }

    getInformationImage = () => {
        if (this.state.imgInforSrc) {
            return <ImageZoomPan
                key={this.state.imgInforSrc}
                style={{
                height: '250px',
                width: '175px'
            }}
                className={styles['mini-img']}
                onDoubleClick={() => this.ViewPDFDoubleClick({src: this.state.imgInforSrc})}
                src={this.state.imgInforSrc}/>
        } else {
            return <div
                style={{
                height: '250px',
                width: '175px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <FontAwesome
                    name="folder"
                    style={{
                    color: '#004c88',
                    fontSize: '5rem',
                    marginRight: '5px'
                }}/>
                <span>{this.state.HeaderPath.length > 0
                        ? this.state.HeaderPath[this.state.HeaderPath.length - 1].CategoryName
                        : 'ทั้งหมด'}</span>
            </div>
        }
    }

    getHeaderRoute = () => {
        const {HeaderPath} = this.state
        return HeaderPath.map((item, index) => (
            <Breadcrumb.Item>{item.CategoryName}</Breadcrumb.Item>
        ))
    }

    render() {
        const {DOCUMENT_MASTER_CATEGORY, DOCUMENT_FOLDER_N_FILES, match: {
                params
            }} = this.props
        return <div style={{
            height: '100%'
        }}>
            {/* Header */}
            <div className={styles['header-document-files']}>
                <Link to={`${app_config.rootPath}/Document`}>
                    <IconButton aria-label="Back">
                        <Icon type="left-circle" theme="outlined"/>
                    </IconButton>
                    <span
                        style={{
                        fontSize: '1.3em',
                        color: 'rgba(0,0,0,.65)'
                    }}>Back</span>
                </Link>
                <div>
                    <Divider
                        style={{
                        height: '2.9em'
                    }}
                        type="vertical"/>
                    <div
                        style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Progress type="circle" percent={30} width={45}/>
                    </div>
                    <div
                        style={{
                        display: 'flex',
                        margin: '0 15px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span>Progress Info</span>
                            <FontAwesome
                                style={{
                                marginLeft: '10px',
                                color: '#1890ff'
                            }}
                                name="circle"/>
                        </div>
                        <div>
                            <span>Appraisal Info</span>
                            <FontAwesome
                                tAwesome
                                style={{
                                marginLeft: '5px',
                                color: '#e6d827'
                            }}
                                name="circle"/>
                        </div>
                    </div>
                    <Divider
                        style={{
                        height: '2.9em'
                    }}
                        type="vertical"/>
                    <div style={{
                        flex: '1'
                    }}>
                        <Steps size="small">
                            <Step status="finish" title="Owner" icon={(<Icon type="user"/>)}/>
                            <Step status="finish" title="CA Admin" icon={(<Icon type="file-done"/>)}/>
                            <Step status="process" title="CA" icon={(<Icon type="reconciliation"/>)}/>
                            <Step status="wait" title="Appraisal" icon={(<Icon type="bank"/>)}/>
                            <Step
                                status="wait"
                                title="Complete"
                                icon={(<Icon type="safety-certificate"/>)}/>
                        </Steps>
                    </div>
                    <Divider
                        style={{
                        height: '2.9em'
                    }}
                        type="vertical"/>
                </div>
                <div>
                    <Tooltip title="รายงานการคืนงาน" placement="left">
                        <Badge count={0} showZero>
                            <Button
                                style={{
                                marginBottom: '-7px'
                            }}
                                shape="circle"
                                icon="notification"
                                onClick={this.OpenReturnInfo}/>
                        </Badge>
                    </Tooltip>
                    <Button
                        style={{
                        marginLeft: '15px'
                    }}
                        icon="check-square-o"
                        type="primary"
                        className="ttu">
                        ส่งเอกสาร
                    </Button>
                    <ReturnCodeVerify
                        authen={[]}
                        match={this.props.match}
                        isOpen={this.state.IsOpenReturnDocument}
                        masters={[]}
                        handleClose={this.OpenReturnDocument}/>

                    <ReturnDashboard
                        authen={[]}
                        match={this.props.match}
                        isOpen={this.state.IsOpenReturnInfo}
                        recentReturnData={[]}
                        handleClose={this.OpenReturnInfo}/>
                </div>
            </div>

            {/* Body */}
            <div
                style={{
                height: 'calc(100% - 60px)',
                marginTop: '5px',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Scrollbar
                    style={{
                    height: '100%',
                    width: '25%',
                    padding: '0 10px 10px',
                    background: '#FFF'
                }}>
                    <div
                        style={{
                        height: '50px',
                        borderBottom: '1px solid #e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div
                            style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flex: '1'
                        }}>
                            <FontAwesome
                                style={{
                                fontSize: '2.5em',
                                color: '#009688',
                                marginRight: '10px'
                            }}
                                name="folder-open"/>
                            <div
                                style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <span
                                    style={{
                                    color: '#434548'
                                }}>{params.ApplicationNo}</span>
                                <span
                                    style={{
                                    fontSize: '.9em',
                                    color: 'rgba(0,0,0,.5)'
                                }}>สุริยนต์ ขุนนุบาล</span>
                            </div>
                            <Popover content={content} placement="bottomLeft">
                                <Icon
                                    style={{
                                    fontSize: '1.3em',
                                    color: '#607D8B',
                                    marginLeft: '10px',
                                    cursor: 'pointer'
                                }}
                                    type="info-circle"
                                    theme="outlined"/>
                            </Popover>
                        </div>
                        <Tooltip title="View E-Book" placement="right">
                            <IconButton
                                style={{
                                color: '#FF5722'
                            }}
                                onClick={this.OpenEbook}
                                aria-label="E-Book">
                                <FontAwesome name="book"/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{
                        marginTop: '5px'
                    }}>
                        <TreeFolder
                            selectedItem={this.state.selectedCategoryCode}
                            applicationno={params.ApplicationNo}
                            onSelected={this.getItemInFolder}/>
                    </div>
                </Scrollbar>
                <div
                    style={{
                    height: '100%',
                    width: '100%',
                    margin: '0 0 5px 5px',
                    background: '#FFF',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div
                        style={{
                        height: '50px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <Breadcrumb
                                separator={'>'}
                                style={{
                                fontSize: '1.24rem'
                            }}>
                                {this.getHeaderRoute()}
                            </Breadcrumb>
                        </div>
                        <div>
                            <Tooltip title="Create return document" placement="left">
                                <IconButton
                                    style={{
                                    color: '#F44336'
                                }}
                                    aria-label="CreateReturnCode"
                                    onClick={this.OpenReturnDocument}>
                                    <Icon type="exception" theme="outlined"/>
                                </IconButton>
                            </Tooltip>
                            <Divider
                                style={{
                                height: '2.9em'
                            }}
                                type="vertical"/>
                            <Tooltip title="Show view files">
                                <IconButton aria-label="Grid" onClick={this.open3DDrawer}>
                                    <Icon
                                        type={this.state.IsOpen3DView
                                        ? "bars"
                                        : "appstore-o"}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="File information">
                                <IconButton
                                    className={this.state.IsOpenInfo && styles['btn-active']}
                                    aria-label="Info"
                                    onClick={this.showDrawer}>
                                    <Icon type="info-circle" theme="outlined"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <div
                        id="file-info-drawer"
                        className={styles['file-info-drawer']}
                        style={{
                        flex: '1',
                        display: 'flex'
                    }}>
                        <div
                            className={`${styles['table-files']} ${this.state.IsOpenInfo && styles['table-files-open']} ${this.state.IsOpen3DView && styles['table-files-3d-open']}`}>
                            <Table
                                key="1"
                                size="small"
                                columns={columns}
                                dataSource={DOCUMENT_FOLDER_N_FILES}
                                showSizeChanger='true'
                                pageSizeOptions={[20, 40]}
                                pagination={{
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                            }}
                                onRow={(record) => {
                                return {
                                    onClick: () => this.onFolderNFilesClick(record, [
                                        ...this.state.HeaderPath,
                                        record
                                    ]),
                                    onDoubleClick: () => this.onFolderNFilesDoubleClick(record, [
                                        ...this.state.HeaderPath,
                                        record
                                    ])
                                }
                            }}/>
                            <div id="3d-view-drawer" className={styles['view-3d-drawer']}></div>
                        </div>
                        <Drawer
                            className={`${styles['drawer-container']} ${this.state.IsOpenInfo && styles['c-open']}`}
                            style={{
                            height: '100%',
                            borderTop: '1px solid #e8e8e8',
                            borderLeft: '1px solid #e8e8e8'
                        }}
                            placement="right"
                            getContainer={() => document.getElementById("file-info-drawer")}
                            closable={false}
                            mask={false}
                            visible={this.state.IsOpenInfo}>
                            <div
                                style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {this.getInformationImage()}
                            </div>
                            <div>
                                <Tabs defaultActiveKey="1" className={styles['tab-info']}>
                                    <TabPane tab="Detail" key="1">
                                        <table>
                                            <tr>
                                                <td colSpan="2">
                                                    <div
                                                        style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Icon
                                                            style={{
                                                            fontSize: '1.3em',
                                                            color: '#FF9800',
                                                            marginRight: '3px'
                                                        }}
                                                            type="file-text"
                                                            theme="outlined"/>
                                                        <span
                                                            style={{
                                                            marginRight: '5px'
                                                        }}>Information</span>
                                                        <Divider
                                                            style={{
                                                            background: '#FF9800',
                                                            margin: '18px 0'
                                                        }}/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100px">Create</td>
                                                <td>07/05/2018</td>
                                            </tr>
                                            <tr>
                                                <td>Create By</td>
                                                <td>XXXXXXXXXXXXX.X</td>
                                            </tr>
                                            <tr>
                                                <td>Last Open</td>
                                                <td>07/09/2018</td>
                                            </tr>
                                            <tr>
                                                <td>Last Open By</td>
                                                <td>XXXXXXXXXXXXX.X</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <div
                                                        style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Icon
                                                            style={{
                                                            fontSize: '1.3em',
                                                            color: '#FF9800',
                                                            marginRight: '3px'
                                                        }}
                                                            type="share-alt"
                                                            theme="outlined"/>
                                                        <span
                                                            style={{
                                                            marginRight: '5px'
                                                        }}>Related</span>
                                                        <Divider
                                                            style={{
                                                            background: '#FF9800',
                                                            margin: '18px 0'
                                                        }}/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Owner</td>
                                                <td>XXXXXXXXXXXXX.X</td>
                                            </tr>
                                            <tr>
                                                <td>Checker</td>
                                                <td>XXXXXXXXXXXXX.X</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <div
                                                        style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Icon
                                                            style={{
                                                            fontSize: '1.3em',
                                                            color: '#FF9800',
                                                            marginRight: '3px'
                                                        }}
                                                            type="setting"
                                                            theme="outlined"/>
                                                        <span
                                                            style={{
                                                            marginRight: '5px'
                                                        }}>Status</span>
                                                        <Divider
                                                            style={{
                                                            background: '#FF9800',
                                                            margin: '18px 0'
                                                        }}/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Is Lock</td>
                                                <td>Yes (XXXXXXXX.X)</td>
                                            </tr>
                                            <tr>
                                                <td>Can Delete</td>
                                                <td>No</td>
                                            </tr>
                                            <tr>
                                                <td>Can Move</td>
                                                <td>No</td>
                                            </tr>
                                            <tr>
                                                <td>Can View</td>
                                                <td>Yes</td>
                                            </tr>
                                        </table>
                                    </TabPane>
                                    <TabPane tab="Note" key="2">
                                        <div
                                            style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'flex-end'
                                        }}>
                                            <TextArea rows={12} value="Test add note for remind that things."/>
                                            <Button
                                                style={{
                                                marginTop: '10px'
                                            }}
                                                size="small"
                                                icon="form"
                                                type="primary"
                                                className="ttu">
                                                Update
                                            </Button>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Drawer>
                        <Drawer
                            className={`${styles['drawer-container-3d']} ${this.state.IsOpenInfo && styles['table-files-open']} ${this.state.IsOpen3DView && styles['c-open']}`}
                            style={{
                            width: '100%',
                            borderTop: '1px solid #e8e8e8'
                        }}
                            height="415px"
                            placement="bottom"
                            getContainer={() => document.getElementById("3d-view-drawer")}
                            closable={false}
                            mask={false}
                            visible={this.state.IsOpen3DView}>
                            <SlideViewPDF
                                image={this.state.imgForSlide}
                                onDoubleClick={this.ViewPDFDoubleClick}
                                onClick={this.slidViewPDFClick}/>
                        </Drawer>
                    </div>
                </div>
                <Modal
                    className={styles['e-bookmodal']}
                    centered
                    visible={this.state.IsEbookOpen}
                    title={(
                    <span className="ttu">E-Book</span>
                )}
                    maskClosable={false}
                    onOk={null}
                    onCancel={this.OpenEbook}
                    footer={null}
                    width="900px">
                    <div
                        style={{
                        width: '100%',
                        height: '550px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <EBook/>
                    </div>
                </Modal>
                <ContextMenu/>
            </div>
        </div>
    }
}

export default connect((state) => ({AUTH_INFO: state.AUTH_INFO, MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA, DOCUMENT_MASTER_CATEGORY: state.DOCUMENT_MASTER_CATEGORY, DOCUMENT_FOLDER_N_FILES: state.DOCUMENT_FOLDER_N_FILES}), {
    getDocumentMasterCategory: getDocumentMasterCategory,
    getFolderAndFiles: getFolderAndFiles
})(DocumentDetail)