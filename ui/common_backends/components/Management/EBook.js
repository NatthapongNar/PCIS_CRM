import React, {Component} from 'react'

const style = {
    width: '100%',
    height: '100%'
}

class EBook extends Component {

    componentDidMount()
    {
        $(this.refs.container).turn({
            // Width

            width: 850,

            // Height

            height: 550,

            // Elevation

            elevation: 50,

            // Enable gradients

            gradients: true,

            // Auto center this flipbook

            autoCenter: true

        });
    }

    render() {
        return <div
            ref="container"
            style={{
            width: '100%',
            height: '100%'
        }}>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/3153599f-a1a9-4f0b-a3ef-cba278f89c07-140246212"/>
            </div>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/340c267e-b85f-413a-9c2a-bc3702c4d036-140246415"/>
            </div>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/1d11d2d2-e2de-4e23-a4de-3d7985ca1ec9-140301651"/>
            </div>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/22997b7c-c411-42be-a149-befb23b9ec6a-140259882"/>
            </div>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/e42104f7-f645-40fb-9ca2-3da092c2835a-140300092"/>
            </div>
            <div>
                <img
                    style={style}
                    src="http://172.17.9.94/documentservices/api/document/file//02-61-000478/91128d55-25ce-4ad9-9181-fefefaea03b7-140247463"/>
            </div>
        </div>
    }
}

export default EBook