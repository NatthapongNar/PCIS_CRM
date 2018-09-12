import React, {Component} from 'react'
import {connect} from 'react-redux'

import _ from 'lodash'

import styles from './index.scss'

const style = {
    width: '200px',
    height: '270px',
    border: '1px solid'
}

class SlideViewPDF extends Component {

    constructor(props)
    {
        super(props);

        const image = this.insertClassName(props.image)

        this.state = {
            image: image || []
        }
    }

    insertClassName = image => {
        let result = _.clone(image)

        if (_.isFunction(image)) {
            image().map((item, index) => {
                switch (index) {
                    case 0:
                        result.className = styles['selected']
                        break;
                    case 1:
                        result.className = styles['next']
                        break;
                    case 2:
                        result.className = styles['next-secound']
                        break;
                    default:
                        result.className = styles['next-secound']
                        break;
                }
            })
        } else {}

        return result;
    }

    componentWillReceiveProps(nextProps)
    {
        const image = this.insertClassName(nextProps.image)

        this.setState({image})
    }

    selectImage = index => {
        let copyObj = _.clone(this.state.image)

        let current = [
            index - 2,
            index - 1,
            index,
            index + 1,
            index + 2
        ];

        if (current[0] >= 0) {
            _.filter(copyObj, (o, i) => i < current[0]).map(i => i.className = styles['hide-left'])
            copyObj[current[0]].className = styles['prev-secound']
        }

        if (current[1] >= 0) {
            _.filter(copyObj, (o, i) => i < current[1] && i != current[0]).map(i => i.className = styles['hide-left'])
            copyObj[current[1]].className = styles['prev']
        }

        if (current[2] >= 0) {
            copyObj[current[2]].className = styles['selected']
        }

        if (current[3] < copyObj.length) {
            _.filter(copyObj, (o, i) => i > current[3] && i != current[4]).map(i => i.className = styles['hide-right'])
            copyObj[current[3]].className = styles['next']
        }

        if (current[4] < copyObj.length) {
            _.filter(copyObj, (o, i) => i > current[4]).map(i => i.className = styles['hide-right'])
            copyObj[current[4]].className = styles['next-secound']
        }

        const {onClick} = this.props

        if (_.isFunction(onClick)) {
            onClick(copyObj[current[2]]);
        }

        this.setState({image: copyObj});
    }

    selectImageDoubleClick = index => {
        const {onDoubleClick} = this.props;
        let copyObj = _.clone(this.state.image)

        let current = [
            index - 2,
            index - 1,
            index,
            index + 1,
            index + 2
        ];

        if (_.isFunction(onDoubleClick)) {
            onDoubleClick(copyObj[current[2]]);
        }
    }

    renderObj = () => {
        return this
            .state
            .image
            .map((item, index) => {
                return (
                    <div
                        key={item.id}
                        className={item.className}
                        onClick={() => this.selectImage(index)}
                        onDoubleClick={() => this.selectImageDoubleClick(index)}>
                        <img src={item.src}/>
                    </div>
                )
            })
    }

    render() {
        return <div className={styles['carousel-container']}>
            {this.renderObj()
}
        </div>
    }
}

export default SlideViewPDF