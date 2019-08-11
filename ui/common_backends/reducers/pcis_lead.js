import _ from 'lodash'

import 
{
    LEAD_MASTER_CUSTOMER_GROUP_REQUEST,
    LEAD_MASTER_CUSTOMER_GROUP_SUCCESS,

    LEAD_MASTER_CUSTOMER_TYPE_REQUEST,
    LEAD_MASTER_CUSTOMER_TYPE_SUCCESS

} from '../constants/actionType'


const initialData = []

export const LEAD_MASTER_CUSTOMER_GROUP = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CUSTOMER_GROUP_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CUSTOMER_TYPE = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CUSTOMER_TYPE_SUCCESS:
            return action.payload
        default:
            return state
    }
}
