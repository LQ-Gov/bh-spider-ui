import React, { Fragment } from 'react';

import {
    Card,
    Icon,
    Input,
    Button,
    Table,
    Form,
    Checkbox,
    Tag
} from 'antd';
import { connect } from 'dva';

import styles from './style.less';

import HandleButton from './Common';

import Highlighter from 'react-highlight-words';


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
    },
};

@connect(({ rule2, node }) => ({
    data: rule2.data,
    nodes: node.nodes
}))
@Form.create()
export default class NodeCreate extends React.PureComponent {


    state = {
        searchText: '',
        visible: false,
    }


    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({ type: 'node/fetch' });
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
            title: '状态',
            dataIndex: 'online',
            render: (text) => { return text === false ? (<Tag color='red'>掉线</Tag>) : (<Tag color='#87d068'>在线</Tag>) },
            filters: [{ text: '在线', value: true }, { text: '掉线', value: false }],
            onFilter: (value, record) => value === false ? record.online === false : true,
        }
    ]
    render() {
        const { data, form, nodes, dispatch } = this.props;
        const { getFieldDecorator } = form;
        const decorator = getFieldDecorator;

        const selection = {
            selectedRowKeys: data.nodes,
            onChange: (selectedRowKeys, selectedRows) => {
                dispatch({ type: 'rule2/refresh', payload: { nodes: selectedRowKeys } })
            }
        }
        return (
            // className={styles.stepForm}
            <Fragment>
                <span>选择分配节点，不选择时则允许全部调度</span>
                <Table rowSelection={selection} rowKey="ip" columns={this.columns} dataSource={nodes} size="small" bordered pagination={{ size: 'default' }} />
                <HandleButton style={{ textAlign: 'center' }} back finish />
            </Fragment>
        );
    }
}