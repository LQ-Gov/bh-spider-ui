import React, { Suspense, Fragment } from 'react';

import { Descriptions, Modal, Empty } from 'antd';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import moment from 'moment'
import { connect } from 'dva';

import styles from './style.less'

@connect()
export default class Content extends React.PureComponent {
    state = { code: '' }


    render() {
        const { component, visible, onClose, dispatch } = this.props

        if (!component) return (<div></div>)

        if (component.type == 'GROOVY'){
            dispatch({ type: 'component/code', name: component.name }).then((data) => {
                this.setState({ code: data })
            }
            )
        }


        return (
            <Modal footer={null} visible={visible} onCancel={onClose} width={1100}>
                <Descriptions title='详细信息' bordered size='middle'>
                    <Descriptions.Item label='名称'>{component.name}</Descriptions.Item>
                    <Descriptions.Item label='类型'>{component.type}</Descriptions.Item>
                    <Descriptions.Item label='hash值'>{component.hash}</Descriptions.Item>
                    <Descriptions.Item label='创建日期' span={1}>{moment(component.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label='描述' span={2}>{component.description}</Descriptions.Item>

                    <Descriptions.Item label='源码预览' span={3} >
                        {
                            component.type == 'GROOVY' ?
                                (<div style={{ maxWidth: 1000, height: 400, overflow: 'auto' }}>
                                    <SyntaxHighlighter language='java' style={docco}>{this.state.code}</SyntaxHighlighter>
                                </div>
                                ) :
                                (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='不支持的预览组件' />)
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Modal>
        )

    }
}