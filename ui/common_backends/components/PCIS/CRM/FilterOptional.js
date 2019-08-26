import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Modal, Icon } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { in_array } from '../../../containers/PCIS/config/funcitonal'
import {} from '../../../actions/pcis'

import cls from '../styles/pcis_style.scss'

class FilterOptional extends Component {

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
                    title={(<div><span>FILTER OPTIONAL</span></div>)}
                    className={`${cls['filter_optional_container']}`}
                    placement={'bottom'}
                    closable={true}
                    onClose={handleClose}
                    visible={isOpen}
                    mask={false}
                    maskClosable={false}
                >
                    
                </Drawer>
            </div>
            
        )
    }

}

export default connect(
    (state) => ({}),
    {}
)(FilterOptional)