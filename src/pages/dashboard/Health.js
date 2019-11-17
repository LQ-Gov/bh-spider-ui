import React, { Component, Suspense } from 'react';

// import { Row, Col, Icon, Tooltip } from 'antd';

import { FormattedMessage } from 'umi/locale';

import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, yuan, WaterWave } from 'ant-design-pro/lib/Charts';

import numeral from 'numeral';


export default class Health extends Component {


    render() {
        const {data} = this.props
        return (
            <ChartCard
                bordered={false}
                title={
                    <FormattedMessage id="app.dashborad.resource.used.count" defaultMessage="Total Sales" />
                }

                total={() => yuan(126560)}

                footer={
                    <Field
                        label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Daily Sales" />}
                        value={`${numeral(data.length?data[data.length-1]:0).format('0,0')}`}
                    />
                }

                contentHeight={46}
            >

                <MiniArea height={30} data={data} />



            </ChartCard>
        )
    }

}