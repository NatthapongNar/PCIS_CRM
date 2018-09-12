import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TreeSelect } from 'antd'
import FontAwesome from 'react-fontawesome'
import moment from 'moment'
import _ from 'lodash'

import {
    getCalendarMasterMarketLocation
} from '../../actions/master'

class SelectMasterBranch extends Component {

    state = {
        treeData: []
    }

    componentWillMount() {
        const { getCalendarMasterMarketLocation } = this.props

        getCalendarMasterMarketLocation()
    }

    componentWillReceiveProps(nextProps) {
        const { CALENDAR_MASTER_MARKET_LOCATION_DATA } = nextProps

        let treeData = _.orderBy(CALENDAR_MASTER_MARKET_LOCATION_DATA, ['RegionID', 'AreaID', 'ZoneValue']).map((item, index) => {
            return {
                key: `${index}_${item.MarketCode}`,
                value: item.MarketCode,
                label: item.MarketName,
                marketType: item.MarketType,
                lat: item.Latitude,
                lng: item.Longitude
            }
        })

        this.setState({ treeData })
    }

    render() {
        const { onChange, defaultValue, disabled } = this.props

        return (
            <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                defaultValue={defaultValue}
                treeData={this.state.treeData}
                treeNodeFilterProp="label"
                onChange={onChange}
                disabled={disabled}
            />
        )
    }
}

export default connect(
    (state) => ({
        CALENDAR_MASTER_MARKET_LOCATION_DATA: state.CALENDAR_MASTER_MARKET_LOCATION_DATA
    }),
    {
        getCalendarMasterMarketLocation: getCalendarMasterMarketLocation
    })(SelectMasterBranch)