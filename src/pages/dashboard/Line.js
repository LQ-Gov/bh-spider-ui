import React, { Component, Suspense } from 'react';

import { Row, Col, Card, Statistic } from 'antd';

import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";


export default class Line extends Component {



    render() {

        var data = [
            { time: '1', type: 'high', value: 1 },
            { time: '1', type: 'middle', value: 2 },
            { time: '1', type: 'low', value: 5 },

            { time: '2', type: 'high', value: 2 },
            { time: '2', type: 'middle', value: 1 },
            { time: '2', type: 'low', value: 7 },

            { time: '3', type: 'high', value: 2 },
            { time: '3', type: 'middle', value: 6 },
            { time: '3', type: 'low', value: 3 },
        ]

        const {title,height}=this.props


        return (
            <Card size="small" title={title} style={{height:height}}>
                <Chart height={height-60} padding={{ top: 20, right: 10, bottom: 20, left: 30 }} data={data} forceFit>
                    <Axis name="time" />
                    <Axis name="value" />
                    <Tooltip crosshairs={{ type: "cross" }} showTitle={false} />
                    <Geom type="line" position="time*value" color={["type", ['#FF4500', '#32CD32', '#1E90FF']]} size={2} shape={'smooth'} />
                </Chart>
            </Card>
        )
    }

}