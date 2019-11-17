import React, { Component, Suspense } from 'react';

import { ChartCard, MiniArea, Pie, MiniProgress, Field, yuan } from 'ant-design-pro/lib/Charts';


import { FormattedMessage } from 'umi/locale';

import { Row, Col, Card } from 'antd';


import { Trend } from 'ant-design-pro'

import numeral from 'numeral';


export default class UrlDistribute extends Component {

    render() {
        return (
            <Card loading={false} title={<FormattedMessage id="app.dashborad.url.distribute.count" defaultMessage="Total Sales" />} bordered={false} bodyStyle={{ padding: 0 }}>
                <Pie
                    hasLegend
                    title="URL分布"
                    total={() => (
                        <span dangerouslySetInnerHTML={{__html:'3321'}}
                            // dangerouslySetInnerHTML={{
                            //     __html: yuan(salesPieData.reduce((pre, now) => now.y + pre, 0)),
                            // }}
                        />
                    )}
                    data={this.props.data}
                    valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
                    height={290}
                />
            </Card>
        )
    }
}