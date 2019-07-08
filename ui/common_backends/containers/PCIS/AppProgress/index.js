import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import bluebird from 'bluebird'

import {} from '../../../actions/pcis'

import CustPortfolio from '../../../components/PCIS/AppProgress/CustPortfolio'

class AppProgress extends Component {

    render() {
        return (<CustPortfolio />)
    }

}

const AppProgressWithCookies = withCookies(AppProgress)
export default connect(
    (state) => ({}),
    {}
)(AppProgressWithCookies)