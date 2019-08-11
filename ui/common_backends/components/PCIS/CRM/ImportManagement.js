import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Modal, Icon } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { in_array } from '../../../containers/PCIS/config/funcitonal'
import {} from '../../../actions/pcis'

import cls from '../styles/pcis_style.scss'

class ImportManagement extends Component {

    state = {
        drawer: false
    }

    shouldComponentUpdate(nextProps) {
        return this.props.isOpen !== nextProps.isOpen
    }

    render() {
        const { isOpen, handleClose } = this.props

        return (
            <div>
                <Drawer
                    title={(<div> <span>IMPORT DATA LEAD</span></div>)}
                    placement={'left'}
                    closable={true}
                    onClose={handleClose}
                    visible={isOpen}
                >
                    <div className="red tc"><Icon type="alert" style={{ fontSize: '5em' }} /></div>                  
                    <div className="ttu tc" style={{ fontSize: '2.2em' }}>Unavailable</div>
                </Drawer>

                {/* <Modal
                    wrapClassName={`${cls['modal_container']}`}
                    visible={isOpen}
                    title={null}
                    maskClosable={false}
                    onOk={null}
                    onCancel={handleClose}
                    footer={null}
                    width="100%"
                >

                </Modal> */}

            </div>
            
        )
    }

}

export default connect(
    (state) => ({}),
    {}
)(ImportManagement)