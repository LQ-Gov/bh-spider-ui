import React, { Component, Suspense, Fragment } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';

import { FormattedMessage, formatMessage } from 'umi/locale';

import PageLoading from '@/components/PageLoading';

import { Charts, WaterWave } from 'ant-design-pro/lib/Charts';

import { Row, Col, Card } from 'antd';
import EventLoop from './EventLoop';
import UrlCount from './UrlCount'
import Node from './Node'
import Health from './Health'
import Connection from './Connection'
import URL from './URL'
import Line from './Line'


import UrlDistribute from './UrlDistribute'

// const StoreCard = React.lazy(() => import('./StoreCard'));
// const TopSearch = React.lazy(() => import('../Dashboard/TopSearch'));
// const ProportionSales = React.lazy(() => import('../Dashboard/ProportionSales'));
// const OfflineData = React.lazy(() => import('../Dashboard/OfflineData'));

// @connect(({ chart, loading }) => ({
//     chart,
//     loading: loading.effects['chart/fetch'],
// }))

@connect(({ dashboard, loading }) => ({
  dashboard,
  loading: loading.effects['dashboard/fetch'],
}))
class Index extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
  };



  componentDidMount() {
    const { dispatch } = this.props;

    // dispatch({type:'dashboard/fetch'})

    // this.reqRef = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'chart/fetch',
    //   });
    // });
  }

  render() {
    // const { salesType, currentTabKey } = this.state;
    // const { chart, loading } = this.props;

    const { dashboard } = this.props
    return (

      <GridContent>
        <Row gutter={20}>
          <Col span={6}>
            <EventLoop total={this.props.dashboard.eventLoopTotalCount} data={this.props.dashboard.eventLoopSecondCount} day={this.props.dashboard.eventLoopDayCount} />
          </Col>
          <Col span={6}>
            <UrlCount total={dashboard.urlTotalCount} day={dashboard.urlDayCount} weekOnWeek={dashboard.urlWeekOnWeekGrown} dayOnDay={dashboard.urlDayOnDayGrown} />
          </Col>
          <Col span={6}>
            <Node total={dashboard.nodeCount} survival={dashboard.survivalNodeCount} />
          </Col>
          <Col span={6}>
            <Connection />
            {/* <Health data={dashboard.resourceUsedScale} /> */}
          </Col>

        </Row>


        <Row gutter={20} style={{ marginTop: 20 }}>
          <Col span={8} >
            <Line title='CPU占用率(MASTER)' height={268} />
          </Col>
          <Col span={8}>
            <Line title='内存占用率(MASTER)' height={268} />
          </Col>
          <Col span={8}>
            <URL />
          </Col>
        </Row>

        <Row gutter={20} style={{ marginTop: 20 }}>
          {/* <Col span={14} >
            <Rank waiting={dashboard.waitingCountRank} crawled={dashboard.crawlCountRank} error={dashboard.errorCountRank} />
          </Col> */}

          <Col span={6}>
            <Line title='CPU占用率(WORKER)' height={230} />
          </Col>
          <Col span={6}>
            <Line title='内存占用率(WORKER)' height={230} />
          </Col>
          <Col span={6}>
            <Line title='带宽占用率(WORKER)' height={230} />
          </Col>
          <Col span={6}>
            <Line title='磁盘占用率(WORKER)' height={230} />
          </Col>
        </Row>

      </GridContent>
    );
  }
}

export default Index;
