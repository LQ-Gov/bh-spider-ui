import React, { Suspense, Fragment } from 'react';
import { Table, Card, Drawer, Divider, Button, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import Create from './Create';
import Content from './Content'

import moment from 'moment'


@connect(({ component, loading }) => ({
  component,
  loading: loading.effects['component/fetch'] || loading.effects['component/submit'],
}))
export default class Component extends React.Component {
  state = {
    createVisible: false,

    contentVisible: false,

    selected: null,
    filter: ''
  };


  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      onFilter: (value, record) => record.name.toLowerCase().includes(this.state.filter.toLowerCase()),
    },
    {
      title: '类型',
      dataIndex: 'type',
      filters: [{ text: 'GROOVY', value: 'GROOVY' }, { text: 'JAR', value: 'JAR' }],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm:ss')
      }
    },

    {
      title: '操作',
      dataIndex: '',
      render: (_, record) => {
        const { dispatch } = this.props;
        return (
          <div>
            <a
              onClick={() => {
                dispatch({
                  type: 'component/delete',
                  payload: { name: record.name, hash: record.hash },
                });
              }}
              href="javascript:;"
            >
              删除
            </a>
            <Divider type="vertical" />
            <a
              onClick={name => {
                this.setState({ contentVisible: true, selected: record });
              }}
              href="javascript:;"
            >
              查看详情
            </a>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({ type: 'component/fetch' });
  }

  createCloseHandler = () => {
    this.setState({ createVisible: false });
  };

  render() {
    const components = this.props.component.list
    const { selected, filter } = this.state

    var filteredComponents = components
    if (filter) {
      filteredComponents = components.filter((it) => (it.name.toLowerCase().includes(filter.toLowerCase())));
    }

    return (
      <Fragment>
        {/* <PageHeaderWrapper> */}
        <Card bordered={false}>
          <Row style={{ marginBottom: 10 }}>
            <Col span={7}>
              <Button type="primary" onClick={() => { this.setState({ createVisible: true }) }}>新增</Button>
            </Col>

            <Col span={17}>
              <Input.Search style={{ width: 500 }} placeholder="输入组件名称" enterButton="搜索" onSearch={value => { this.setState({ filter: value }); }} />
            </Col>
          </Row>

          <Row>
            <Table loading={this.props.loading} rowKey='name' size='middle' bordered dataSource={filteredComponents} columns={this.columns} />
          </Row>
        </Card>




        <Create
          visible={this.state.createVisible}
          onOk={this.createCloseHandler}
          onCancel={this.createCloseHandler}
        />

        <Content component={this.state.selected} visible={this.state.contentVisible}
          onClose={() => { this.setState({ contentVisible: false }) }} />
        {/* </PageHeaderWrapper> */}
      </Fragment>
    );
  }
}
