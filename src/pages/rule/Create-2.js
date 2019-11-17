import React, { Fragment } from 'react';
import {
  Card,
  Icon,
  Input,
  Button,
  Select,
  Steps,
  List,
  Menu,
  Dropdown,
  Modal,
  Form,
  Divider
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

// import styles from '../Forms/style.less';
import HandleButton from './Common';

@Form.create()
class GroupCreate extends React.PureComponent {
  item = { name: '' };

  render() {
    const { form, visible, onOk, onCancel } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新建分组"
        visible={visible}
        onOk={() => {
          onOk && onOk(form.getFieldsValue());
        }}
        onCancel={onCancel}
      >
        <Form layout="horizontal">
          <Form.Item label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('name', { initialValue: this.item.name })(
              <Input placeholder="Basic usage" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
@connect(({ component }) => ({
  components: component.list,
}))
class Chain extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { data: this.props.data.slice() };
  }

  create = index => {
    const [...data] = this.state.data;
    data.splice(index + 1, 0, '');

    this.setState({ data });
  };

  remove = index => {
    const { onChange } = this.props;

    const [...data] = this.state.data;
    data.splice(index, 1);

    this.setState({ data });
    onChange && onChange(data);
  };

  update = (text, index) => {
    const { onChange } = this.props;
    const [...data] = this.state.data;
    data[index] = text;

    this.setState({ data });

    onChange && onChange(data);
  };

  menu = index => {
    return (
      <Menu>
        <Menu.Item
          onClick={() => {
            this.create(index);
          }}
        >
          <Icon type="plus" />
          右侧新增节点
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.remove(index);
          }}
        >
          <Icon type="delete" />
          删除此节点
        </Menu.Item>
      </Menu>
    );
  };

  icon = (child, index) => {
    const { editable } = this.props;

    return editable ? (
      <Dropdown overlay={this.menu(index)} trigger={['click']}>
        {child}
      </Dropdown>
    ) : (
        child
      );
  };

  title = (text, index) => {
    const { editable, components } = this.props;

    return editable ? (
      <Fragment>
        <Select
          size="small"
          style={{ minWidth: 100 }}
          onSelect={value => {
            this.update(value, index);
          }}
          defaultValue={text}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          dropdownMatchSelectWidth={false}
        >
          {components
            ? components.map(it => {
              return (
                <Select.Option key={it.name} value={it.name}>
                  {it.name}
                </Select.Option>
              );
            })
            : null}
        </Select>
      </Fragment>
    ) : (
        <span>{text}</span>
      );
  };

  render() {
    const { data } = this.state;
    return (
      <Steps size="small" current={data.length}>
        {data.map((it, index) => {
          return (
            <Steps.Step
              key={+new Date() + Math.random()}
              icon={this.icon(
                <Icon
                  type={index == data.length - 1 ? 'check-circle' : 'right-circle'}
                  theme="filled"
                />,
                index
              )}
              title={this.title(it, index)}
            />
          );
        })}
      </Steps>
    );
  }
}

class Group extends React.PureComponent {
  state = {
    editable: false,
  };

  constructor(props) {
    super(props);

    const { name, components } = this.props.chain;

    Object.assign(this.state, { name, components: (components || []).slice() });

    if (!this.state.components || this.state.components.length == 0) this.state.components = [''];
  }

  save = () => {
    const { onChange } = this.props;
    const { name, components } = this.state;

    const filteredComponents = components.filter(it => it);

    this.setState({ components: filteredComponents });

    onChange && onChange({ name, components: filteredComponents });
  };

  cardExtraContent = item => (
    <div>
      {this.state.editable ? (
        <Button icon="setting" onClick={this.save}>
          保存
        </Button>
      ) : (
          <Button
            icon="setting"
            onClick={() => {
              this.setState({ editable: !this.state.editable });
            }}
          >
            编辑
        </Button>
        )}

      <Button type="danger" icon="delete" style={{ marginLeft: 5 }} onClick={this.props.onRemove}>
        删除
      </Button>
    </div>
  );

  title = text => {
    return this.state.editable ? (
      <Input
        defaultValue={text}
        style={{ width: 100 }}
        onChange={e => this.setState({ name: e.target.value })}
      />
    ) : (
        text
      );
  };

  render() {
    const { name, components } = this.state;
    return (
      <Card hoverable title={this.title(name)} bordered extra={this.cardExtraContent()}>
        <Chain
          data={components}
          editable={this.state.editable}
          onChange={data => this.setState({ components: data })}
        />
      </Card>
    );
  }
}

@connect(({ rule2 }) => ({
  data: rule2.data,
}))
class CreateChain extends React.PureComponent {
  state = {
    createModalVisible: false,
  };

  handleOk = item => {
    const { dispatch, data } = this.props;

    data.chains.push(item);
    dispatch({
      type: 'rule2/refresh',
      payload: {
        ...data,
      },
    });
    this.setState({ createModalVisible: false });
  };

  update = (item, index) => {
    const { data, dispatch } = this.props;

    data.chains[index] = item;

    dispatch({
      type: 'rule2/refresh',
      payload: {
        ...data,
      },
    });
  };

  remove = index => {
    const { data, dispatch } = this.props;

    data.chains.splice(index, 1);

    dispatch({ type: 'rule2/refresh', payload: { ...data } });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'component/fetch', payload: { type: 'GROOVY' } });
  }

  next = () => {
    router.push(`/rule/${this.props.match.params.operation}/3`);
  };

  render() {
    const { data, dispatch } = this.props;
    const { chains } = data;

    return (
      <Fragment>
        <List grid={{ gutter: 24, lg: 1, md: 1, sm: 1, xs: 1 }}>
          {(chains || []).map((it, index) => {
            return (
              <List.Item key={+new Date() + Math.random()}>
                <Group chain={it}
                  onChange={item => {
                    this.update(item, index);
                  }}
                  onRemove={this.remove.bind(this, index)}
                />
              </List.Item>
            );
          })}
          <List.Item>
            <Button
              type="dashed"
              style={{ width: '100%', height: 50 }}
              icon="plus"
              onClick={() => {
                this.setState({ createModalVisible: true });
              }}
            >
              添加
            </Button>
          </List.Item>
        </List>

        <Divider />
        <HandleButton style={{ textAlign: 'center' }} back finish next={this.next.bind(this)} />
        <GroupCreate
          visible={this.state.createModalVisible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ createModalVisible: false });
          }}
        />
      </Fragment>
    );
  }
}

export default CreateChain;
