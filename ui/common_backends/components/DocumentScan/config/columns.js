import React from 'react'
import { Icon, Tooltip, Popover } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import styles from '../style/index.scss'
import { in_array } from './functional';

const charWidth = 7.5
const mini_default = 35
const widt_default = 50
const date_default = 80
const money_default = 100
const name_default = 120
const tooltip_placement = 'right'

const upload_color = '#e6d827'
const confirm_color = '#1890ff'
const return_color = 'red'
const commit_color = 'green'

const progress_define = (
    <span>
        <p><i className="fa fa-circle"></i> Draft</p>
        <p><i className="fa fa-circle" style={{ fontSize: '16px', color: upload_color }}></i> Upload</p>
        <p><i className="fa fa-circle" style={{ fontSize: '16px', color: confirm_color }}></i> Confirm</p>
        <p><i className="fa fa-circle" style={{ fontSize: '16px', color: return_color }}></i> Return</p>
        <p><i className="fa fa-circle" style={{ fontSize: '16px', color: commit_color }}></i> Completed</p>
    </span>
)

export const documentscan_columns = [
    {
        title: 'Scan Start',
        dataIndex: 'CreateScanDate',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="laptop" />),
                dataIndex: 'Monitor',
                className: 'ttu tc',
                width: mini_default
                // render: (str_data, rowsData) => {
                //     return (<Icon type="laptop" className={`pointer`} />)
                // }
            },
            {
                title: 'DATE',
                dataIndex: 'CreateDate',
                className: 'ttu tc',
                width: date_default,
                render: (str_date) => {
                    let date_time = (str_date) ? moment(str_date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY (HH:mm)') : null
                    return (
                        <Tooltip placement={tooltip_placement} title={date_time}>
                            {(str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null}
                        </Tooltip>
                    )
                }
            },
            {
                title: (<Icon type="dashboard" />),
                dataIndex: 'ScanEstimate',
                className: 'ttu tc',
                width: (mini_default - 5)
            }
        ]
    },
    {
        title: 'Progress Information',
        dataIndex: 'ProgressInfo',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="upload" />),
                dataIndex: 'File_Amount',
                className: 'ttu tc',
                width: (widt_default + 10)
            },
            {
                title: (<Popover title="Progress Description" content={progress_define} className="ttu"><i className="fa fa-circle" /></Popover>),
                dataIndex: 'Progress',
                className: 'ttu tc',
                width: mini_default,
                render: (data, i) => {
                    return handleProgressStatus(data)
                }
            },
            {
                title: 'Date',
                dataIndex: 'Latest_ActionDate',
                className: 'ttu tc',
                width: date_default,
                render: (str_date) => {
                    let date_time = (str_date) ? moment(str_date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY (HH:mm)') : null
                    return (
                        <Tooltip placement={tooltip_placement} title={date_time}>
                            {(str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null}
                        </Tooltip>
                    )
                }
            },
            {
                title: 'Name',
                dataIndex: 'Latest_ActionName',
                className: `${styles['name_ellipsis']} ttu tl`,
                width: name_default,                
                render: (str_name) => {
                    let calStr = (str_name && str_name.length > 0) ? (charWidth * str_name.length) : 0
                    if (calStr >= 115)
                        return (<Tooltip placement={tooltip_placement} title={str_name}>{str_name}</Tooltip>)
                    else
                        return str_name
                }
            }
        ]
    },
    {
        title: 'Appraisal Information',
        dataIndex: 'AppraisalInfo',
        className: `ttu`,
        children: [
            {
                title: 'Scan',
                dataIndex: 'AppraisalDate',
                className: 'ttu tc',
                width: date_default,
                render: (str_date) => {
                    let date_time = (str_date) ? moment(str_date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY (HH:mm)') : null
                    return (
                        <Tooltip placement={tooltip_placement} title={date_time}>
                            {(str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null}
                        </Tooltip>
                    )
                }
            },
            {
                title: (<Icon type="dashboard" />),
                dataIndex: 'AppraisalEstimate',
                className: 'ttu tc',
                width: (mini_default - 5)
            },
            {
                title: (<Icon type="upload" />),
                dataIndex: 'AppraisalFile_Amount',
                className: 'ttu tc',
                width: (widt_default + 10)
            },
            {
                title: (<Popover className="ttu" title="Appraisal Description" content={progress_define}><i className="fa fa-circle" /></Popover>),
                dataIndex: 'AppraisalProgress',
                className: 'ttu tc',
                width: mini_default
            },
            {
                title: 'Status',
                dataIndex: 'AppraisalReceivedDate',
                className: 'ttu tc',
                width: date_default,
                render: (str_date) => {
                    let date_time = (str_date) ? moment(str_date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY (HH:mm)') : null
                    return (
                        <Tooltip placement={tooltip_placement} title={date_time}>
                            {(str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null}
                        </Tooltip>
                    )
                }
            },
            {
                title: 'Name',
                dataIndex: 'AppraisalReceivedName',
                className: `${styles['name_ellipsis']} ttu tl`,
                width: name_default,
                render: (str_name) => {
                    let calStr = (str_name && str_name.length > 0) ? (charWidth * str_name.length) : 0
                    if (calStr >= 115)
                        return (<Tooltip placement={tooltip_placement} title={str_name}>{str_name}</Tooltip>)
                    else
                        return str_name
                }
            }
        ]
    },
    {
        title: 'Customer Information',
        dataIndex: 'CustomerInfo',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="copy" style={{ fontSize: '14px' }} />),
                dataIndex: 'MissingDoc',
                className: 'ttu tc',
                width: mini_default
            },
            {
                title: 'App No',
                dataIndex: 'ApplicationNo',
                className: 'ttu tc',
                width: name_default
            },
            {
                title: (<i className="fa fa-users" />),
                dataIndex: 'BorrowerList',
                className: 'ttu tc',
                width: mini_default
                
            },
            {
                title: 'Borrower',
                dataIndex: 'BorrowerName',
                className: `${styles['name_ellipsis']} ttu tl`,
                width: name_default,
                render: (str_name) => {
                    let calStr = (str_name && str_name.length > 0) ? (charWidth * str_name.length) : 0
                    if (calStr >= 115)
                        return (<Tooltip placement={tooltip_placement} title={str_name}>{str_name}</Tooltip>)
                    else
                        return str_name
                }
                
            }
        ]
    },
    {
        title: 'Branch Information',
        dataIndex: 'BranchInfo',
        className: `ttu`,
        children: [
            {
                title: 'Branch',
                dataIndex: 'BranchName',
                className: `${styles['name_ellipsis']} ttu tl`,
                width: name_default,
                render: (str_name, rowsData) => {
                    let branch_tel = (rowsData && rowsData.BranchTel) ? `(โทร ${rowsData.BranchTel.trim()})` : ''
                    return (<Tooltip placement={tooltip_placement} title={`${str_name} ${branch_tel}`}>{str_name}</Tooltip>)
                }
            },
            {
                title: 'RM Name',
                dataIndex: 'RMName',
                className: `${styles['name_ellipsis']} ttu tl`,
                width: name_default,
                render: (str_name, rowsData) => {
                    let rm_tel = (rowsData && rowsData.RMMobile) ? `(โทร ${rowsData.RMMobile.trim()})` : ''
                    return (<Tooltip placement={tooltip_placement} title={`${str_name} ${rm_tel}`}>{str_name}</Tooltip>)
                }
            }
        ]
    },
    {
        title: 'ST',
        dataIndex: 'StatusDigit',
        className: `ttu v-mid tc`,
        width: 35,
        render: (str_data, rowsData) => {

            let a2caDate = (rowsData && rowsData.A2CA_Date) ? moment(rowsData.A2CA_Date, 'YYYY-MM-DD').format('DD/MM/YY') : '-'
            let caName = (rowsData && rowsData.CAName) ? rowsData.CAName : '-'           
            let status = (rowsData && rowsData.StatusDesc) ? rowsData.StatusDesc : ''
            let statusDigit = (rowsData && rowsData.statusDigit) ? rowsData.statusDigit : ''
            let statusDate = (rowsData && rowsData.StatusDate) ? moment(rowsData.StatusDate, 'YYYY-MM-DD').format('DD/MM/YY') : '-'

            const content = (
               <span>
                    <p className="ttu"><b>A2CA Date: </b>{`${a2caDate}`}</p>
                    <p className="ttu"><b>CA Name : </b>{`${caName}`}</p>
                    <hr/>
                    <p className="ttu"><b>Status Date : </b>{`${statusDate}`}</p>
                    <p className="ttu"><b>Status : </b>{`${status}`}</p>    
                </span>
            )
     
            let str_element = null
            if(in_array(str_data, ['P', 'A'])) {

                let ownership_doc = (rowsData.OwnershipDoc == 'Y') ? 'Y':'N'
                let fileEstimate  = (rowsData.ReceivedEstimateDoc == 'Y') ? 'Y':'N'
                    
                if(ownership_doc == 'Y') {
                    if(help.in_array(str_data, ['A']) && !drawdown) { 						
						str_style   = 'padding: 3px 7px; border-radius: 50%; background: red; color: white; cursor: pointer;'
						str_element = '<span class="iconCursor" style="' + str_style + '">' + str_data + '</span>'
				
					} else  {
					
						if(str_data == 'P') {							
							if(fileEstimate == 'Y') { 
								str_style   = 'padding: 3px 7px; border-radius: 50%; background: #fa6800; color: white; cursor: pointer;'
								str_element = '<span class="iconCursor" style="' + str_style + '">' + str_data + '</span>'
								
							}
							else if(appraisalchk == 'Y') { 
								str_style   = 'padding: 3px 7px; border-radius: 50%; background: #199a11; color: white; cursor: pointer;'
								str_element = '<span class="iconCursor" style="' + str_style + '">' + str_data + '</span>'
								
							} 
							else { str_element = str_data }	
							
						} else { str_element = str_data }

					}
                } else { 
                    if(str_data == 'P') {
                        if(fileEstimate == 'Y') { 
							str_style   = 'padding: 3px 7px; border-radius: 50%; background: #fa6800; color: white; cursor: pointer;'
							str_element = '<span class="iconCursor" style="' + str_style + '">' + str_data + '</span>'							
						} 
						else if(appraisalchk == 'Y') { 
							str_style   = 'padding: 3px 7px; border-radius: 50%; background: #199a11; color: white;'
							str_element = '<span class="iconCursor" style="' + str_style + '">' + str_data + '</span>'							
						} 

                    } else {
                        str_element = str_data
                    }
                }

            } else {
                str_element = str_data
            }

            if(!_.isEmpty(str_element)) {
                return (<Popover title={<b className="ttu">Credit Information</b>} content={content} placement="left">{str_element}</Popover>)
            } else {
                return null
            }

        }
    },
    {
        title: 'Upload',
        dataIndex: 'UploadInfo',
        className: `ttu`,
        children: [
            {
                title: 'CA',
                dataIndex: 'CA_UploadItem',
                className: `ttu v-mid tc pointer`,
                width: 30
            },
            {
                title: 'AP',
                dataIndex: 'AP_UploadItem',
                className: `ttu v-mid tc pointer`,
                width: 30
            }
        ]
    }
]

const handleProgressStatus = (progress) => {
    if(!_.isEmpty(progress)) {

        let icon_color = ''
        switch(progress) {
            case 'UPLOAD':
                icon_color = upload_color
            break
            case 'CONFIRM':
                icon_color = confirm_color
            break
            case 'COMPLETED':
                icon_color = commit_color
            break
            case 'Return':
                icon_color = return_color
            break
            default: 
                icon_color = ''
            break
        }

        return (
            <Tooltip placement={tooltip_placement} title={progress}>
                <i className={`fa fa-circle pointer`} style={{ fontSize: '16px', color: icon_color }} />
            </Tooltip>
        )
    } else {
        return (
            <Tooltip placement={tooltip_placement} title="Unknown">
                <Icon type="question-circle" className="pointer" style={{ fontSize: '14px' }} />
            </Tooltip>
        )
    }
}


const color_close_icon = 'red'
export const missing_columns = [
    {
        title: 'Type',
        dataIndex: 'DocStatus',
        className: `ttu tc`,
        width: (mini_default + 5),
        render: (str_data) => {
            let title = (str_data && str_data !== '' & str_data === 'O') ? 'Original Paper' : 'Copy Paper'
            return (<Tooltip placement={tooltip_placement} title={`${title}`}>{str_data}</Tooltip>)
        }
    },
    {
        title: 'Document',
        dataIndex: 'LackDoc',
        className: `ttu tl`,
        render: (str_name, rowsData) => {
            let text = (rowsData && rowsData.DocOther) ? rowsData.DocOther : ''
            let create_name = (rowsData && rowsData.CreateDocBy) ? rowsData.CreateDocBy : ''
            let create_date = (rowsData && rowsData.CreateDocDate) ? moment(rowsData.CreateDocDate, 'YYYY-MM-DD').format('DD/MM/YY') : ''
            return (<Tooltip placement={tooltip_placement} title={`สร้างโดย ${create_name} (${create_date})`}>{`${str_name} ${text}`}</Tooltip>)
        }
    },
    {
        title: (<span>LB <i className="fa fa-arrow-right" /> HO</span>),
        dataIndex: 'LB2HO',
        className: `ttu tc`,
        width: (date_default + 5),
        render: (str_date) => {
            if(str_date && !_.isEmpty(str_date)) {
                return (str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null
            } else {
                return 'รอเอกสาร'
            }
            
        }
    },
    {
        title: 'HO Received',
        dataIndex: 'HOReceived',
        className: `ttu tc`,
        width: (date_default + 5),
        render: (str_date, rowsData) => {
            let date_before = (rowsData && rowsData.LB2HO) ? true : false
            if(date_before) {
                if(str_date && !_.isEmpty(str_date)) {
                    return (str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null
                } else {
                    return 'รอเอกสาร'
                }
            }
        }
    },
    {
        title: (<span>HO <i className="fa fa-arrow-right" /> CA</span>),
        dataIndex: 'HO2CA',
        className: `ttu tc`,
        width: (date_default + 5),
        render: (str_date, rowsData) => {
            let date_before = (rowsData && rowsData.HOReceived) ? true : false
            if(date_before) {
                if(str_date && !_.isEmpty(str_date)) {
                    return (str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null
                } else {
                    return 'รอเอกสาร'
                }
            }
        }
    },
    {
        title: (<span>CA <i className="fa fa-arrow-right" /> HO</span>),
        dataIndex: 'CA2HO',
        className: `ttu tc`,
        width: (date_default + 5),
        render: (str_date) => {
            return (<Icon type="close" style={{ color: color_close_icon }} />)
            // return (str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null
        }
    },
    {
        title: 'LB Received',
        dataIndex: 'LBReceived',
        className: `ttu tc`,
        width: (date_default + 5),
        render: (str_date) => {
            return (<Icon type="close" style={{ color: color_close_icon }} />)
            // return (str_date) ? moment(str_date, 'YYYY-MM-DD').format('DD/MM/YY') : null
        }
    }
]

export const return_columns = [
    {
        title: 'Return Information',
        dataIndex: 'ReturnInformation',
        className: `ttu tc`,
        children: [
            {
                title: 'Code',
                dataIndex: 'ReturnCode',
                className: `ttu tc`,
                width: '6%'
            },
            {
                title: (<div className="tc">Document</div>),
                dataIndex: 'ReturnDescription',
                className: `ttu tl`,
                width: '20%'
            },
            {
                title: (<div className="tc">Reason</div>),
                dataIndex: 'ReturnReasonDescription',
                className: `ttu tl`,
                width: '12%'
            },
            {
                title: (<div className="tc">Remark</div>),
                dataIndex: 'ReturnNote',
                className: `ttu tl`,
                width: '15%'
            },
            {
                title: 'Date',
                dataIndex: '_CreateDate',
                className: `ttu tc`,
                width: '10%',
                render: (str_date) => {
                    return (str_date) ? moment(str_date).format('DD/MM/YY (HH:mm)') : null
                }
            },
            {
                title: (<div className="tc">Name</div>),
                dataIndex: 'CreateByName',
                className: `ttu tl`,
                width: '12%'
            }            
        ]
    },
    {
        title: 'Reply Information',
        dataIndex: 'ReplyInformation',
        className: `ttu tc`,
        children: [
            {
                title: (<div className="tc">Remark</div>),
                dataIndex: 'ReplyNote',
                className: `ttu tl`,
                width: '17%'
            },
            {
                title: (<div className="tc"><Icon type="form" style={{ fontSize: '1.1em' }} /></div>),
                dataIndex: 'ReplyIcon',
                className: `tc ${styles['replay_message']}`,
                width: '3%'
            }
        ]
    }    
]

export const return_hist_columns = [
    {
        title: 'Return Information',
        dataIndex: 'ReturnInformation',
        className: `ttu tc`,
        children: [
            {
                title: 'Date',
                dataIndex: '_CreateDate',
                className: `ttu tc`,
                width: '10%',
                render: (str_date) => {
                    return (str_date) ? moment(str_date).format('DD/MM/YY (HH:mm)') : null
                }
            },
            {
                title: (<div className="tc">Name</div>),
                dataIndex: 'CreateByName',
                className: `ttu tl`,
                width: '10%'
            },
            {
                title: (<div className="tc">Document</div>),
                dataIndex: 'ReturnDescription',
                className: `ttu tl`,
                width: '20%'
            },
            {
                title: (<div className="tc">Remark</div>),
                dataIndex: 'ReturnNote',
                className: `ttu tl`,
                width: '20%'
            }, 
        ]
    },
    {
        title: 'Reply Information',
        dataIndex: 'ReplyInformation',
        className: `ttu tc`,
        children: [
            {
                title: 'Date',
                dataIndex: 'UpdateDate',
                className: `ttu tc`,
                width: '10%',
                render: (str_date) => {
                    return (str_date) ? moment(str_date).format('DD/MM/YY (HH:mm)') : null
                }
            },
            {
                title: (<div className="tc">Name</div>),
                dataIndex: 'UpdateByName',
                className: `ttu tl`,
                width: '10%'
            },
            {
                title: (<div className="tc">Remark</div>),
                dataIndex: 'ReplyNote',
                className: `ttu tl`,
                width: '20%'
            }
        ]
    }    
]

export const return_job_columns = [
    {
        title: (<div className="ttu tc">Type of Document</div>),
        dataIndex: 'ReturnDescription',
        className: `tl`,
        width: '30%'
    },
    {
        title: (<div className="ttu tc">Reason</div>),
        dataIndex: 'ReturnReasonDescription',
        className: `tl`,
        width: '30%'
    },
    {
        title: (<div className="ttu tc">Remark</div>),
        dataIndex: 'ReturnNote',
        className: `tl`,
        width: '30%'
    },
    {
        title: (<Icon type="form" />),
        dataIndex: 'Edit',
        className: `tc`,
        width: '5%'
    },
    {
        title: (<Icon type="delete" />),
        dataIndex: 'Delete',
        className: `tc`,
        width: '5%'
    }
]

export const document_checklist_columns = [
    {
        title: (<Icon type="safety" />),
        dataIndex: 'ReturnStatus',
        className: `tc`,
        width: '5%',
        render: (status) => {
            switch (status) {
                case '1':
                    return (<Tooltip placement="right" title="Completed"><Icon type="check" className="green f5" /></Tooltip>)
                case '2':
                    return (<Tooltip placement="right" title="Incompleted"><Icon type="close" className="red f5" /></Tooltip>)
                case '3':
                    return (<Tooltip placement="right" title="Not Found"><Icon type="file-unknown" className="silver f5" /></Tooltip>)
                default:
                    return null
            }
        }
    },
    {
        title: (<div className="ttu tc">Category</div>),
        dataIndex: 'CategoryName',
        className: `tl`,
        width: '25%'
    },
    {
        title: (<div className="ttu tc">Type of Document</div>),
        dataIndex: 'ReturnDescription',
        className: `tl`,
        width: '25%'
    },
    {
        title: (<div className="ttu tc">Reason</div>),
        dataIndex: 'ReturnReasonDescription',
        className: `tl`,
        width: '20%'
    },
    {
        title: (<div className="ttu tc">Remark</div>),
        dataIndex: 'ReturnNote',
        className: `tl`,
        width: '25%'
    }
]

export const borrower_columns = [
    {
        title: (<div className="ttu tc">Type</div>),
        dataIndex: 'BorrowerDesc',
        className: `tl`,
        width: '20%'
    },
    {
        title: (<div className="ttu tc">Borrower Name</div>),
        dataIndex: 'BorrowerName',
        className: `tl`,
        width: '50%'
    },
    {
        title: (<div className="ttu tc">Citizen ID</div>),
        dataIndex: 'IDNO',
        className: `tl`,
        width: '30%'
    }
]