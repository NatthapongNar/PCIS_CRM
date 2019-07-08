import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Modal } from 'antd'
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

    render() {
        const { isOpen, handleClose } = this.props
        return (
            <div>
                <Drawer
                    title="Basic Drawer"
                    placement={'right'}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawer}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>

                <Modal
                    wrapClassName={`${cls['modal_container']}`}
                    visible={isOpen}
                    title={null}
                    maskClosable={false}
                    onOk={null}
                    onCancel={handleClose}
                    footer={null}
                    width="100%"
                >

                </Modal>

            </div>
            
        )
    }

    handleTitleModal = () => {
        return (
            <div>..</div>
        )
    }

    handleOpenDrawer = () => {
        this.setState({ drawer: true })
    }

    handleCloseDrawer = () => {
        this.setState({ drawer: false })
    }

}

export default connect(
    (state) => ({}),
    {}
)(ImportManagement)