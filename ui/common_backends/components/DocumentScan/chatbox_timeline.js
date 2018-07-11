import React, { Component } from 'react'
import { Modal, Icon } from 'antd'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import Scrollbar from 'react-smooth-scrollbar'

import cls from './style/index.scss'
import './style/timeline.css'

const maxHeightScreen = (window.screen.availHeight - (window.outerHeight - window.innerHeight)) - 200

const icon_style = {
    background: 'rgb(33, 150, 243)', 
    color: '#fff',
    textAlign: 'center',
    lineHeight: '58px',
    fontSize: '2em'
}

class TimelineActicity extends Component {
    
    render() {
        const { isOpen, handleClose } = this.props

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_tonav']}`}
                visible={isOpen}
                title={<span className="ttu">Timeline Message Activity</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="95%"
            >         
                <div className="vertical-timeline-container">                
                    <VerticalTimeline>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            date="2011 - present"
                            iconStyle={icon_style}
                            icon={<Icon type="message" />}
                        >
                            <h3 className="vertical-timeline-element-title">Creative Director</h3>
                            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
                            <p>Creative Direction, User Experience, Visual Design, Project Management, Team Leading</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            date="2010 - 2011"
                            iconStyle={icon_style}
                            icon={<Icon type="message" />}
                        >
                            <h3 className="vertical-timeline-element-title">Art Director</h3>
                            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
                            <p>Creative Direction, User Experience, Visual Design, SEO, Online Marketing</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            date="2008 - 2010"
                            iconStyle={icon_style}
                            icon={<Icon type="message" />}
                        >
                            <h3 className="vertical-timeline-element-title">Web Designer</h3>
                            <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
                            <p>User Experience, Visual Design</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            date="2006 - 2008"
                            iconStyle={icon_style}
                            icon={<Icon type="message" />}
                        >
                            <h3 className="vertical-timeline-element-title">Web Designer</h3>
                            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
                            <p>User Experience, Visual Design</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--education"
                            date="April 2013"
                            iconStyle={{ ...icon_style, background: 'rgb(233, 30, 99)', color: '#fff' }}
                            icon={<Icon type="idcard" />}
                        >
                            <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
                            <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
                            <p>Strategy, Social Media</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--education"
                            date="November 2012"
                            iconStyle={{ ...icon_style, background: 'rgb(233, 30, 99)', color: '#fff' }}
                            icon={<Icon type="idcard" />}
                        >
                            <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
                            <h4 className="vertical-timeline-element-subtitle">Certification</h4>
                            <p>Creative Direction, User Experience, Visual Design</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--education"
                            date="2002 - 2006"
                            iconStyle={{ ...icon_style, background: 'rgb(233, 30, 99)', color: '#fff' }}
                            icon={<Icon type="idcard" />}
                        >
                            <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
                            <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
                            <p>Creative Direction, Visual Design</p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            iconStyle={{ ...icon_style, background: 'rgb(16, 204, 82)', color: '#fff' }}
                            icon={<Icon type="api" />}
                        />
                    </VerticalTimeline>                    
                </div>
            </Modal>
        )
    }

    handleDismiss = () => {
        const { handleClose } = this.props

        let el_timeline = document.querySelectorAll(`span.vertical-timeline-element-icon`)
        let el_content = document.querySelectorAll(`div.vertical-timeline-element-content`)
        
        if(!_.isEmpty(el_timeline) && el_timeline.length > 0) {
            _.map(el_timeline, (v, i) => { 
                if(i > 3) {
                    this.removeClass(v, 'bounce-in')
                    this.addClass(v, 'is-hidden')
                }
            })
        }

        if(!_.isEmpty(el_content) && el_content.length > 0) {
            _.map(el_content, (v, i) => { 
                if(i > 3) {
                    this.removeClass(v, 'bounce-in')
                    this.addClass(v, 'is-hidden')
                }
            })
        }

        handleClose()
    }

    hasClass = (ele, cls) => {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    addClass = (ele, cls) => {
        if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    }

    removeClass = (ele, cls) => {
        if (this.hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }

}


export default TimelineActicity