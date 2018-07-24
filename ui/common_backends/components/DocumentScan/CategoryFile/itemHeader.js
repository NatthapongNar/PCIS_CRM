import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Button } from 'antd'

import ReturnCodeVerify from '../ReturnComponent/return_verifycode'
import cls from './header.scss'

const ButtonGroup = Button.Group

class CategoryFileHeader extends Component {

    state = {
        verify: {
            enable: false,
            checkpass: false
        },
        verifyPass: false,
        modal: {
            modal_verify: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.masters !== nextProps.masters ||
               this.state.modal.modal_verify !== nextState.modal.modal_verify ||
               this.state.verify !== nextState.verify
    }

    componentWillReceiveProps(props) {
        const { return_code } = props.data[0]
        if(!_.isEmpty(return_code) && return_code.length > 0) {
            this.setState({ verify: _.assign({}, this.state.verify, { enable: true }) })
        }

    }

    render() {
        const { masters } = this.props
        const { verify, modal } = this.state

        return (
            <div className={cls['header_container']}>

                <div className={cls['header_item']}>
                    <Link to="/Document">
                        <Button type="primary" shape="circle" icon="rollback" />
                    </Link>
                </div>
                <div className={cls['header_item']}>
                    <ButtonGroup size="small">
                        <Button type="primary" onClick={this.handleVerifyModal} disabled={!verify.enable}>
                            <Icon type="search" />ตรวจสอบข้อมูล
                        </Button>
                        <Button type="primary" className="ttu" disabled={!verify.checkpass}>
                            <Icon type="check-square-o" />ส่งเอกสาร
                        </Button>
                    </ButtonGroup>
                </div>

                <ReturnCodeVerify 
                    isOpen={modal.modal_verify}
                    masters={masters}
                    handleClose={this.handleVerifyModal}
                />

            </div>
        )
    }

    handleVerifyModal = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { modal_verify: !this.state.modal.modal_verify}) })
    }

}

export default connect(
    (state) => ({
        data: [{
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data: []
        }]
    }),
    {}
)(CategoryFileHeader)