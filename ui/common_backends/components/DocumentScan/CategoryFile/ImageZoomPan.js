import React, {Component} from 'react'
import _ from 'lodash'

class ImageZoomPan extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            src: props.src,
            bgSrc: props.src,
            img: null,
            settings: {
                zoom: props.zoom || 0.10,
                maxZoom: props.maxZoom || 10
            },
            width: 0,
            height: 0,
            bgWidth: 0,
            bgHeight: 0,
            bgPosX: 0,
            bgPosY: 0,
            previousEvent: null
        }
    }

    updateBgStyle = (bgWidth, bgHeight, bgPosX, bgPosY, event) => {
        const {width, height} = this.state;

        if (bgPosX > 0) {
            bgPosX = 0;
        } else if (bgPosX < width - bgWidth) {
            bgPosX = width - bgWidth;
        }

        if (bgPosY > 0) {
            bgPosY = 0;
        } else if (bgPosY < height - bgHeight) {
            bgPosY = height - bgHeight;
        }

        if (event) {
            this.setState({bgWidth, bgHeight, bgPosX, bgPosY, previousEvent: event})
        } else {
            this.setState({bgWidth, bgHeight, bgPosX, bgPosY})
        }
    }

    onStartMove = e => {
        e.preventDefault();

        let previousEvent = {}

        previousEvent.pageX = e.pageX;
        previousEvent.pageY = e.pageY;

        this.setState({previousEvent});
    }

    onEndMove = e => {
        this.setState({previousEvent: null});
    }

    onMove = e => {
        e.preventDefault();

        let {previousEvent} = this.state

        if (previousEvent) {
            const {bgWidth, bgHeight, prevX, prevY} = this.state
            let {bgPosX, bgPosY} = this.state;

            var xShift = e.pageX - previousEvent.pageX;
            var yShift = e.pageY - previousEvent.pageY;

            bgPosX += xShift;
            bgPosY += yShift;

            previousEvent.pageX = e.pageX;
            previousEvent.pageY = e.pageY;

            this.updateBgStyle(bgWidth, bgHeight, bgPosX, bgPosY, previousEvent);
        }
    }

    onWheel = e => {
        var deltaY = 0;

        e.preventDefault();

        if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
            deltaY = e.deltaY;
        }

        const {img} = this.state;
        var rect = img.getBoundingClientRect();

        var offsetX = e.pageX - rect.left - window.pageXOffset;
        var offsetY = e.pageY - rect.top - window.pageYOffset;

        this.doZoom(deltaY, offsetX, offsetY);
    }

    doZoom = (deltaY, offsetX, offsetY) => {
        const {settings, width, height} = this.state;
        let {bgWidth, bgHeight, bgPosX, bgPosY} = this.state;

        var bgCursorX = offsetX - bgPosX;
        var bgCursorY = offsetY - bgPosY;

        var bgRatioX = bgCursorX / bgWidth;
        var bgRatioY = bgCursorY / bgHeight;

        if (deltaY < 0) {
            if (settings.maxZoom == -1 || (bgWidth + bgWidth * settings.zoom) / width <= settings.maxZoom) {
                bgWidth += bgWidth * settings.zoom;
                bgHeight += bgHeight * settings.zoom;
            }
        } else {
            bgWidth -= bgWidth * settings.zoom;
            bgHeight -= bgHeight * settings.zoom;
        }

        bgPosX = offsetX - (bgWidth * bgRatioX);
        bgPosY = offsetY - (bgHeight * bgRatioY);

        if (bgWidth >= width || bgHeight >= height) {
            this.updateBgStyle(bgWidth, bgHeight, bgPosX, bgPosY);
        }
    }

    initImg = () => {
        const {img} = this.refs;
        let width,
            height;

        width = img.width;
        height = img.height;

        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;;
        canvas.height = img.naturalHeight;
        let src = canvas.toDataURL();

        this.setState({
            src,
            img,
            width,
            height,
            bgWidth: width,
            bgHeight: height
        });
    }

    onDoubleClick = () => {
        const {onDoubleClick} = this.props;

        if (_.isFunction(onDoubleClick)) {
            onDoubleClick();
        }
    }

    render() {
        const {
            src,
            bgSrc,
            cursor,
            bgWidth,
            bgHeight,
            bgPosX,
            bgPosY
        } = this.state;

        const {style, className} = this.props

        return (<img
            src={src}
            ref="img"
            className={className}
            onLoad={this.initImg}
            onDoubleClick={this.onDoubleClick}
            onWheel={e => this.onWheel(e)}
            onMouseDown={e => this.onStartMove(e)}
            onMouseMove={e => this.onMove(e)}
            onMouseUp={e => this.onEndMove(e)}
            onMouseLeave={e => this.onEndMove(e)}
            style={{
            cursor: 'grab',
            backgroundImage: `url('${bgSrc}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${bgWidth}px ${bgHeight}px`,
            backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            ...style
        }}/>)
    }
}

export default ImageZoomPan