import {CALL_API} from 'redux-api-middleware'
import _ from 'lodash'

const json_header = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

import 
{
    LEAD_MASTER_CUSTOMER_GROUP_URL,
    LEAD_MASTER_CUSTOMER_TYPE_URL,

} from '../constants/endpoints'

import 
{
    LEAD_MASTER_CUSTOMER_GROUP_REQUEST,
    LEAD_MASTER_CUSTOMER_GROUP_SUCCESS,
    LEAD_MASTER_CUSTOMER_GROUP_FAILURE,

    LEAD_MASTER_CUSTOMER_TYPE_REQUEST,
    LEAD_MASTER_CUSTOMER_TYPE_SUCCESS,
    LEAD_MASTER_CUSTOMER_TYPE_FAILURE

} from '../constants/actionType'


// NEW LEAD MANAGEMENT
export const getLeadMasterCustomerGroup= () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CUSTOMER_GROUP_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CUSTOMER_GROUP_REQUEST, 
                {
                    type: LEAD_MASTER_CUSTOMER_GROUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CUSTOMER_GROUP_FAILURE
            ]
        }
    })
})

export const getLeadMasterCustomerType = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CUSTOMER_TYPE_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CUSTOMER_TYPE_REQUEST, 
                {
                    type: LEAD_MASTER_CUSTOMER_TYPE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CUSTOMER_TYPE_FAILURE
            ]
        }
    })
})