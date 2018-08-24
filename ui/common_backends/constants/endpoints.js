//-------------------- FOR NANO MAP
let url = "",
    urlPcis = "http://tc001pcis1p/newservices/LBServices.svc/",
    urlDocument = "http://172.17.9.94/documentservices/DocumentServicesRest.svc/";

if (process.env.NODE_ENV === 'production') 
    url = `http://TC001PCIS1p:60001`
else 
    url = `http://localhost:60001`

    //-------------------- FOR NANO MAP
// let url = "", urlPcis = "http://tc001pcis1u/newservices/LBServices.svc/"; if
// (process.env.NODE_ENV === 'production')     url = `http://TC001PCIS1u:60001`
// else     url = `http://localhost:60001`

export const API_LOGIN = `${url}/nano/auth`
export const MASTER_ORGANIZATION_TEAM_URL = `${url}/masters/employee/hierarchy`
export const MASTER_EMPLOYEE_URL = `${url}/masters/employee`
export const CALENDAR_MASTER_EVENTS_URL = `${url}/calendar/master/events`
export const CALENDAR_EVENTS_URL = `${url}/calendar/events`
export const CALENDAR_EVENTS_CONFIRM_URL = `${url}/calendar/events/confirm`
export const CALENDAR_EVENTS_ACKNOWLEDGE_URL = `${url}/calendar/events/acknowledge`
export const CALENDAR_MASTER_BRANCH_LOCATION_URL = `${url}/calendar/master/branchlocation`

export const MASTER_REGION_URL = `${url}/master/region`
export const MASTER_AREA_URL = `${url}/master/area`
export const MASTER_BRANCH_URL = `${url}/master/branch`

export const MASTER_CATEGORY_URL = `${urlDocument}document/category/`
