import React, { Fragment, Component } from 'react';
import { Form, Icon, Input, Button, Select, Slider, AutoComplete, Divider, Tooltip, Checkbox, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import styles from './style.less';
import HandleButton from './Common';

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

const marks = {
  0: {
    style: {
      color: '#f50',
    },
    label: <strong>自动</strong>,
  },
  50: '50',
  100: '100',
  500: '500',
  1000: '1000',
};
@connect(({ rule2 }) => ({
  data: rule2.data,
}))
@Form.create()
class CreateBasic extends React.Component {


  next = () => {
    this.refresh();
    router.push(`/rule/${this.props.match.params.operation}/2`);
  };

  refresh = () => {
    const { form, dispatch } = this.props;

    form.validateFields((errors, values) => {
      var proxies = values['proxies']
      values['proxies'] = proxies && proxies.length > 0 ? proxies.split('\n') : []
      dispatch({ type: 'rule2/refresh', payload: values });
    });
  };


  options = [
    (<AutoComplete.Option key='1' value={'*/5 * * * * ?'}>*/5 * * * * ?(每隔5秒执行)</AutoComplete.Option>),
    (<AutoComplete.Option key='2' value={'0 */1 * * * ?'}>0 */1 * * * ?(每隔1分钟执行)</AutoComplete.Option>),
    (<AutoComplete.Option key='3' value={'0 */10 * * * ?'}>0 */10 * * * ?(每隔10分钟执行)</AutoComplete.Option>),
    (<AutoComplete.Option key='4' value={'0 0 1 * * ?'}>0 0 1 * * ?(每天凌晨1点执行)</AutoComplete.Option>),
  ]

  render() {
    const { data, form } = this.props;
    const { getFieldDecorator } = form;
    const decorator = getFieldDecorator;



    return (
      // className={styles.stepForm}
      <Fragment>
        <Form layout="horizontal" className={styles.basic} hideRequiredMark>
          <Divider>基本设置<Icon type="setting" style={{ marginLeft: 5 }} /></Divider>
          <Form.Item {...formItemLayout} label={
            <span>
              匹配规则
              <em>
                <Tooltip title='用于匹配URL的规则,基于spring的Ant Path模式'>
                  <Icon type="question-circle" style={{ marginLeft: 4 }} />
                </Tooltip>
              </em>
            </span>
          }
          >
            {decorator('pattern', { initialValue: data.pattern })(<Pattern />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="cron表达式" required>
            {decorator('cron', { initialValue: data.cron, rules: [{ required: true }] })(
              <AutoComplete
                dataSource={this.options}
                name="cron"
                optionLabelProp='value'
              />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label={
            <span>
              并发数
            <em>
                <Tooltip title='每次调度最大的url数,(自动)将根据当前资源使用情况，自动分配调度数量'>
                  <Icon type="question-circle" style={{ marginLeft: 4 }} />
                </Tooltip>
              </em>
            </span>
          }>
            {decorator('parallelCount', { initialValue: data.parallelCount })(
              <Slider marks={marks} max={1000} />
            )}
          </Form.Item>

          <Divider>扩展设置(选填)</Divider>

          <Form.Item {...formItemLayout} label={
            <span>
              抓取属性
            <em>
                <Tooltip title='是否重复:默认只抓取一次,选中后会反复抓取'>
                  <Icon type="question-circle" style={{ marginLeft: 4 }} />
                </Tooltip>
              </em>
            </span>
          }>

            {decorator('repeat', { initialValue: data.repeat, valuePropName: "checked" })(
              <Checkbox>是否重复</Checkbox>
            )}

          </Form.Item>

          <Form.Item {...formItemLayout} label="分配策略" required>
            {decorator('policy', { initialValue: data.policy, rules: [{ required: true }] })(
              <Checkbox.Group style={{ width: '100%' }}>
                <Row>
                  <Col span={8}>
                    <Checkbox value="idle">空闲</Checkbox>
                  </Col>

                  <Col span={8}>
                    <Checkbox value="test1">测试1</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="test2">测试2</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="test3">测试3</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="test4">测试4</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>


          <Form.Item {...formItemLayout} label="描述">
            {decorator('description', { initialValue: data.description })(
              <Input.TextArea autosize={{ minRows: 4, maxRows: 10 }} />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label={
            <span>
              代理
              <em>
                <Tooltip title='请求代理设置,默认使用配置文件中的代理设置'>
                  <Icon type="question-circle" style={{ marginLeft: 4 }} />
                </Tooltip>
              </em>
            </span>
          }>
            {decorator('proxies', { initialValue: data.proxies ? data.proxies.join('\n') : '' })(
              <Input.TextArea autosize={{ minRows: 10, maxRows: 100 }} style={{ width: 200 }} />
            )}

          </Form.Item>

          <Divider />

          <HandleButton
            className={styles.handleButton}
            next={this.next.bind(this)}
            finish={this.refresh.bind(this)}
          />
        </Form>
      </Fragment>
    );
  }
}

class Pattern extends Component {

  constructor(props) {
    super(props);

    this.scheme = 'http://';
    this.section = '';




  }

  refresh = () => {
    const value = `${this.scheme}${this.section}`;
    this.props.onChange(value);
  };

  addonBefore = () => (
    <Select
      value={this.scheme}
      dropdownMatchSelectWidth={false}
      onChange={value => {
        this.scheme = value;
        this.refresh();
      }}
    >
      <Select.Option value="http://">http://</Select.Option>
      <Select.Option value="https://">https://</Select.Option>
      <Select.Option value="[http|https]://">[http|https]://</Select.Option>
    </Select>
  );

  render() {

    const index = this.props.value.indexOf('://');
    if (index > 0) {
      this.scheme = this.props.value.substring(0, index + 3);
      this.section = this.props.value.substring(index + 3);
    }

    return (
      <Input
        value={this.section}
        addonBefore={this.addonBefore()}
        onChange={e => {
          this.section = e.target.value;
          this.refresh();
        }}
      />
    );
  }
}

export default CreateBasic;
