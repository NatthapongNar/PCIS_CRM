import React, { Component } from 'react'

import { MainCRM, LeadToupUp } from '../CRM'
import cls from '../styles/pcis_style.scss'

class App extends Component {

    render() {
        const { appConfig, config, columns, fnCall, authen, master, gridData } = this.props

        return (
            <div className={`${cls['pcis_container']} ${cls['shadow']}`}>
                <LeadToupUp
                    appConfig={appConfig}
                    config={config}
                    columns={columns}
                    authen={authen}
                    master={master}
                    data={gridData.CRM}
                    fn={fnCall}
                />
            </div>
        )
    }

}

export default App