import React, { Component, Suspense } from 'react';

import { ChartCard, MiniArea, Pie, MiniProgress, Field, yuan } from 'ant-design-pro/lib/Charts';


import { FormattedMessage } from 'umi/locale';

import { Row, Col, Card } from 'antd';


import { Trend } from 'ant-design-pro'

import numeral from 'numeral';

import styles from './style.less'





export default class EventLoop extends Component {

    render() {
        const {total,weekOnWeek,dayOnDay,day} = this.props

        return (
            <ChartCard
                bordered={false}
                title={
                    <FormattedMessage id="app.dashborad.resource.url.total.count" defaultMessage="Total Sales" />
                }

                total={() => numeral(total).format('0,0')}

                footer={
                    <Field
                        label={<FormattedMessage id="app.dashborad.resource.url.day.count" defaultMessage="Daily Sales" />}
                        value={`${numeral(day).format('0,0')}`}
                    />
                }

                contentHeight={46}
            >

                <Trend flag="up" style={{ marginRight: 16 }}>
                    <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
                    <span className={styles.trendText}>{weekOnWeek}%</span>
                </Trend>
                <Trend flag="down">
                    <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
                    <span className={styles.trendText}>{dayOnDay}%</span>
                </Trend>

            </ChartCard>
        )
    }
}