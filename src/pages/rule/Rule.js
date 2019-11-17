import React, { Component } from 'react';
import { Table, Card, Form, Input, Button, Divider, Radio, Row, Col, Switch } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';

import Link from 'umi/link';


@connect(({ rule2, loading }) => ({
  list: rule2.list,
  loading: loading.effects['rule2/fetch'],
}))
class Rule extends Component {
  columns = [
    {
      title: '规则表达式',
      dataIndex: 'pattern',
    },
    {
      title: 'cron表达式',
      dataIndex: 'cron',
    },
    {
      title: '并发数',
      dataIndex: 'parallelCount',
      render: (text) => {
        if (text === 0) return <span style={{ color: '#f50' }}>自动</span>;
        return text;
      },
    },

    
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '队列详情(进行中/异常/总计)',
      dataIndex: 'queue',
    },
    {
      title: '运行状态',
      dataIndex: 'state',
      render: (text, record) => {
        if (record.valid === false) return (<span style={{ color: '#CC3333' }}>清理中</span>)
        return (<Switch checked={record.running}></Switch>)
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <span>
          <Link to={`/rule/content/${record.id}`}>详情</Link>
          <Divider type="vertical" />
          <Link to={`/rule/edit?id=${record.id}`}>编辑</Link>
          <Divider type="vertical" />
          <a onClick={() => this.delete(record.id)}>删除</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'rule2/fetch' });
  }


  delete = (id) => {
    this.props.dispatch({ type: 'rule2/delete', id: id });

  }

  submitURLComponent = (
    <div style={{ textAlign: 'center' }}>
      <Input.Search
        defaultValue="http://www.toutiao.com/a6654061509418680835/"
        placeholder="输入URL"
        enterButton="提交种子"
        size="large"
        onSearch={value => {
          this.props.dispatch({ type: 'rule2/submitURL', url: value });
        }}
        style={{ width: 522 }}
      />
    </div>
  );

  render() {
    return (
      <PageHeaderWrapper title="规则列表" content={this.submitURLComponent}>
        <Card bordered={false}>
          <Form layout="inline">
            <Row>
              <Col lg={12}>
                <Form.Item>
                  <Button
                    onClick={() => {
                      router.push('/rule/create');
                    }}
                  >
                    新增
                  </Button>
                </Form.Item>
              </Col>

              <Col lg={12} style={{ textAlign: 'right' }}>
                <Form.Item>
                  <Radio.Group defaultValue="all" buttonStyle="solid">
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="running">运行</Radio.Button>
                    <Radio.Button value="stopping">停止</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item style={{ marginRight: 0 }}>
                  <Input.Search placeholder="输入文本" onSearch={value => console.log(value)} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="id"
            loading={this.props.loading}
            columns={this.columns}
            dataSource={this.props.list}
            size="small"
            bordered
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Rule;
