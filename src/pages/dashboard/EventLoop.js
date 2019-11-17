import React, { Component, Suspense } from 'react';

import { FormattedMessage } from 'umi/locale';

import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, yuan } from 'ant-design-pro/lib/Charts';


// import createG2 from 'g2-react';
// import { Stat } from 'g2';

import { Chart, Axis, Tooltip, Geom } from 'bizcharts';

import numeral from 'numeral';

import 'ant-design-pro/dist/ant-design-pro.css';

// const Line = createG2(chart => {
//     // ff7f0e
//     chart.line().position('x*y').color('blue').shape('spline').size(2);
//     chart.axis("x", { title: null }).axis('y', { title: 'null' })
//     chart.render();
// });


class EventLoop extends Component {

    render() {

        const {data,total,day} = this.props


        return (
            <ChartCard
                bordered={false}
                title={
                    <FormattedMessage id="app.dashborad.resource.eventloop.total.count" defaultMessage="Total Sales" />
                }
                total={numeral(total).format('0,0')}

                footer={
                    <Field
                        label={<FormattedMessage id="app.dashborad.resource.eventloop.day.count" defaultMessage="Daily Sales" />}
                        value={`￥${numeral(day).format('0,0')}`}
                    />
                }



                contentHeight={46}
            >
                {/* <Chart height={150} data={[{ x: 1, y: 10 }, { x: 2, y: 23 }, { x: 3, y: 75 },{ x: 4, y: 40 },{ x: 5, y: 50 },{ x: 6, y: 23 }]} padding={[0]} forceFit>
                    <Axis name="x" />
                    <Axis name="y" grid={null} visible={false} />
                    <Tooltip crosshairs={{ type: "cross" }} showTitle={false} />
                    <Geom type="area" position="x*y" size={2} color={'blue'} shape={'smooth'} />
                    <Geom type="line" position="x*y" size={2} color={'blue'} shape={'smooth'} />
                </Chart> */}


                <MiniArea ref='chart' height={30} data={data} />
            </ChartCard>
        )
    }
}


export default EventLoop;