export const config = {
    grid: {
        default: {
            panel_title: 'Filter Criteria',
            pagelabel_length: 'Show',
            pagelabel_entries: 'entries',
            pagelabel_entroll: (start, to, total) => `Showing ${start} to ${to} of ${total} entries`,
            search_button: 'Search',
            clear_button: 'Clear',
            tree_select: { all: 'Select All' },
            footer: {
                page_title: 'Total :',
                total_title: 'Grand Total :'
            }
        },
        crm: {
            prospect_lot_dashboard: {},
            lead_topup: {
                header: {
                    title: 'Loan Top-Up Lists',
                    subtitle: 'Valid Period'
                },
                modal: {
                    title: 'Customer Profile'
                }
            }
        },
        border: true,
        size: 'small',
        pageSizeHandle: [20, 40, 60, 80, 100, 200, 300]
    },
    cookieConfig: {
        path: '/',
        name: {
            authen: 'authen_info'
        }
    }
    
}