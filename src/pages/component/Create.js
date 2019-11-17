import React, { Component } from 'react';
import { Modal, Upload, Icon, Form, Input, Select, Row, Col } from 'antd';
import { connect } from 'dva';

@connect()
@Form.create()
class Create extends Component {


  initialState = {
    type: '',
    name: '',
    description: '',
    file: null,
  }

  state = { ...this.initialState };

  // 拦截文件上传
  beforeUploadInterceptor = file => {
    var lastDotIndex = file.name.lastIndexOf('.')
    var extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex + 1) : null


    if (!extension || !['GROOVY', 'JAR'].includes(extension.toUpperCase())) {
      alert("不支持的类型,请上传JAR,GROOVY类型的文件")
      return false;
    }

    var name = file.name.substring(0, lastDotIndex)
    this.setState({ file: file, name: name, type: extension.toUpperCase() });
    return true;
  };

  submit = () => {
    const { form, dispatch, onOk } = this.props;
    const values = form.getFieldsValue();
    values.file = this.state.file;
    dispatch({ type: 'component/submit', payload: values });
    onOk && onOk();
  };

  unit = (size) => {
    if (size >= (1024 * 1024)) return (size / 1024 / 1024).toFixed(2) + "MB";

    if (size >= 1024) return (size / 1024).toFixed(2) + "KB";

    return size + 'Bytes';


  }

  render() {
    const { visible, onCancel, form } = this.props;
    const { type, name, description, file } = this.state
    const decorator = form.getFieldDecorator;

    return (
      <Modal title="新增组件" visible={visible}
        onOk={this.submit.bind(this)} onCancel={onCancel}
        afterClose={() => { this.setState(this.initialState) }}>
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Form.Item>
              <Upload.Dragger beforeUpload={this.beforeUploadInterceptor} showUploadList={false}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  {this.state.file ? this.state.file.name : '点击或将文件拖动到此处以上传'}
                </p>
                <p className="ant-upload-hint">
                  {file
                    ? `${this.unit(file.size)}`
                    : 'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files'}
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="名称">
                {decorator('name', { initialValue: name })(
                  <Input placeholder="输入组件名称" />
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="类型">
                {decorator('type', { initialValue: type })(
                  <Select placeholder="选择组件类型" defalutValue='GROOVY'>
                    <Select.Option value="JAR">JAR</Select.Option>
                    <Select.Option value="GROOVY">GROOVY</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Form.Item label="描述">
              {decorator('description', {
                initialValue: description,
              })(<Input.TextArea autosize={{ minRows: 3, maxRows: 6 }} />)}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default Create;
