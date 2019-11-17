import React, { Fragment } from 'react';
import { Steps, Card, Spin } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect } from 'dva';

@connect()
class Create extends React.PureComponent {

  componentWillMount() {
    const { location, dispatch } = this.props

    var id = location.query['id']
    dispatch({ type: 'rule2/reset' })

    if (id) {
      dispatch({ type: 'rule2/fetchOne', id: id }).then(data => {
        dispatch({ type: 'rule2/reset', payload: { data: data } });
      })
    }
  }

  render() {
    const { children, location } = this.props;

    var blocks = location.pathname.split('/')

    var index = blocks[blocks.length - 1]

    return (
      <PageHeaderWrapper
        title="新建规则"
        tabActiveKey={location.pathname}
      >

        <Card bordered={false}>
          <Fragment>
            <Steps current={index - 1}>
              <Steps.Step title="配置基础信息" />
              <Steps.Step title="配置组件链" />
              <Steps.Step title="配置节点" />
              <Steps.Step title="完成" />
            </Steps>
          </Fragment>
        </Card>
        <Card style={{ marginTop: 20 }} bordered={false}>{children}</Card>
      </PageHeaderWrapper>
    );
  }
}
export default Create;
