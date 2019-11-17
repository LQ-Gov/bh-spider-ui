import React, { Component, Suspense } from 'react';
import { Table, Card, Tag, Input, Button, Icon, Divider, Drawer, List } from 'antd';
import { DescriptionList } from 'ant-design-pro'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

import Highlighter from 'react-highlight-words';
import numeral from 'numeral';


const { Description } = DescriptionList;

@connect(({ node, loading }) => ({
  data: node,
  loading: loading.effects['node/profile'],
}))
class Node extends Component {

  state = {
    searchText: '',
    visible: false,
  }
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          查询
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  columns = [
    {
      title: '主机名称',
      dataIndex: 'hostname',
      ...this.getColumnSearchProps('hostname')
    },
    {
      title: '节点IP地址',
      dataIndex: 'ip',
    },

    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '节点类型',
      dataIndex: 'type',
    },

    {
      title: 'CPU利用率',
      dataIndex: 'CPUUtilization',
      render: (text) => (numeral(text * 100).format('0.00') + "%"),
      sorter: (a, b) => a.CPUUtilization - b.CPUUtilization
    },
    {
      title: '内存占用率',
      dataIndex: 'memoryOccupancy',
      render: (text) => (numeral(text * 100).format('0.00') + "%"),
      sorter: (a, b) => a.memoryOccupancy - b.memoryOccupancy
    },
    {
      title: '磁盘占用率',
      dataIndex: 'diskOccupancy',
      render: (text) => (numeral(text * 100).format('0.00') + "%"),
      sorter: (a, b) => a.diskOccupancy - b.diskOccupancy
    },
    {
      title: '状态',
      dataIndex: 'online',
      render: (text) => { return text === false ? (<Tag color='red'>掉线</Tag>) : (<Tag color='#87d068'>在线</Tag>) },
      filters: [{ text: '在线', value: true }, { text: '掉线', value: false }],
      onFilter: (value, record) => value === false ? record.online === false : true,
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => {
        var btns = []
        if (record.type != 'DEFAULT') {
          btns.push(<Button size='small' onClick={() => { this.watch(record.id) }}>日志监控</Button>)
          btns.push(<Divider type="vertical" />)
        }
        btns.push(<Button type='danger' size='small' ghost onClick={() => { confirm('确定要下线吗?') }}>下线</Button>)


        return (<div>{btns}</div>)
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'node/fetch' });
  }

  onDrawerClose = () => {

    const { dispatch } = this.props

    dispatch({ type: 'node/unwatch' })

    this.setState({ visible: false })
  }

  watch = (id) => {
    const { dispatch } = this.props


    dispatch({ type: 'node/watch', id: id })

    this.setState({ visible: true })
  }

  render() {
    const { base, nodes, stream } = this.props.data;

    return (
      <PageHeaderWrapper title="节点管理">
        <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="运行模式">{base.mode}</Description>
            <Description term="存储引擎">{base.store}</Description>

            {
              base['consistent.protocol'] ? (<Description term="一致性协议">{base['consistent.protocol']}</Description>) : ''
            }{
              base['master.node.count'] ? (<Description term="主节点数">{base['master.node.count']}</Description>) : ''
            }
          </DescriptionList>
        </Card>
        <Card bordered={false}>
          <Table rowKey="id" columns={this.columns} dataSource={nodes} size="small" bordered pagination={{ size: 'default' }} />
        </Card>
        <Drawer
          title="日志"
          placement="bottom"
          closable={false}
          onClose={this.onDrawerClose}
          visible={this.state.visible}
          height={500}
        >
          <List style={{ overflow: 'auto', height: 400 }} size='small' split={false} dataSource={stream} renderItem={(item) => (
            <List.Item>{item.value}</List.Item>
          )}>


          </List>
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default Node;
