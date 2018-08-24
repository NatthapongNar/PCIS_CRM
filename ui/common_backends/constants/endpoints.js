//-------------------- FOR NANO MAP
let url = "",
    urlPcis = "http://tc001pcis1p/newservices/LBServices.svc/",
    urlDocument = "http://172.17.9.94/documentservices/api",
    urlDocumentAPI = `http://TC001PCIS1p:5092/document/api`;

let doc_api = ""

if (process.env.NODE_ENV === 'production') {
    url = `http://TC001PCIS1p:60001`
    doc_api = `http://TC001PCIS1p:5092/document/api`
} else {
    url = `http://TC001PCIS1p:60001`
    // url = `http://localhost:60001`
    doc_api = `http://localhost:5091/document/api`
}

// -------------------- FOR NANO MAP let url = "", urlPcis =
// "http://tc001pcis1u/newservices/LBServices.svc/"; if (process.env.NODE_ENV
// === 'production')     url = `http://TC001PCIS1u:60001` else     url =
// `http://localhost:60001`

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

// PROJECT FILE SCAN
export const DOCUMENT_GET_BASICINFO_URL = `${urlDocumentAPI}/grid/basicinfo/`
export const DOCUMENT_GET_BORROWERINFO_URL = `${urlDocumentAPI}/data/borrower/`

export const DOCUMENT_DASHBOARD_URL = `${urlDocumentAPI}/grid/dashbaord`
export const DOCUMENT_MISSING_DOCUMENT_URL = `${urlDocumentAPI}/grid/missingdoc`
// export const DOCUMENT_GRID_MESSAGE_URL = `${urlDocumentAPI}/grid/message`
// export const DOCUMENT_CREATE_RETURNCODE_URL = `${urlDocumentAPI}/create/returncode`
// export const DOCUMENT_CREATE_MESSAGE_URL = `${urlDocumentAPI}/create/message`
export const DOCUMENT_MASTER_RETURNCODE_URL = `${urlDocumentAPI}/master/returncode`
export const UPLOAD_DOCUMENT_URL = `${urlDocumentAPI}`
export const MASTER_CATEGORY_URL = `${urlDocument}/document/category/`
export const MASTER_STATUSCODE_URL = `${urlDocument}/master/document/returnstatus`
export const MASTER_RETURNREASON_URL = `${urlDocument}/master/document/returnreason`
export const PDF_IMAGE_URL = `${urlDocument}/document/file/`
export const RETURNCODE_MANAGEMENT_URL = `${urlDocument}/document/return/`