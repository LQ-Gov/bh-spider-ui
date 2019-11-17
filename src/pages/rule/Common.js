import React, { Fragment } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { object } from 'prop-types';

class Back extends React.Component {
  render() {
    return (
      <Button style={this.props.style}
        onClick={() => {
          router.go(-1);
        }}
      >
        上一步
      </Button>
    );
  }
}

class Next extends React.Component {
  ok = () => {
    const { handler } = this.props;
    handler instanceof Function ? handler() : router.push(handler);
  };

  render() {
    const { url, style } = this.props;
    return <Button style={style} onClick={this.ok.bind(this)}>下一步</Button>;
  }
}

@connect(({ rule2 }) => ({
  rule: rule2,
}))
class Finish extends React.Component {
  ok = () => {
    const { dispatch, rule, handler } = this.props;

    var blocks = location.pathname.split('/')

    var operation = blocks[blocks.length - 2]

    let exec = true;
    if (handler && handler instanceof Function) exec = handler() !== false;

    if (exec) dispatch({ type: `rule2/${operation}` }).then(() => { router.push('/rule/list') })
  };

  render() {
    return <Button style={this.props.style} type="primary" onClick={this.ok.bind(this)}>完成</Button>;
  }
}

class HandleButton extends React.Component {


  render() {
    const { back, next, finish, style } = this.props;

    return (
      <div style={style} className={this.props.className}>
        {back ? <Back /> : <Fragment />}
        {next ? <Next style={{ marginLeft: 5 }} handler={next} /> : <Fragment />}
        {finish ? <Finish style={{ marginLeft: 5 }} handler={finish} /> : <Fragment />}
      </div>
    );
  }
}

export default HandleButton;
