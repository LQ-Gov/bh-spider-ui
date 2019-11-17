import React from "react";
import {
    G2,
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
import { Card } from "antd";

import DataSet from "@antv/data-set";

const { Html } = Guide;
export default class URL extends React.Component {



    render() {

        var data = [{ type: 'error', value: 5 }, { type: 'queue', value: 7 }, { type: 'finish', value: 10 }]

        return (

            <Card bordered={false} title={'URL分布'} bodyStyle={{padding:5}}>
                <Chart
                    height={200}
                    data={data}
                    padding={[0, 0, 0, 0]}
                    forceFit
                >
                    <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                    <Axis name="type" />
                    <Legend
                        position="right"
                        offsetY={-80}
                        offsetX={-100}
                    />
                    <Tooltip
                        showTitle={true}
                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                    />
                    {/* <Guide>
                        <Html
                            position={["50%", "50%"]}
                            html="<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>主机<br><span style=&quot;color:#262626;font-size:2.5em&quot;>200</span>台</div>"
                            alignX="middle"
                            alignY="middle"
                        />
                    </Guide> */}
                    <Geom
                        type="intervalStack"
                        position="value"
                        color="type"
                        // color={["type", ['#FF4500', '#32CD32', '#1E90FF']]}
                        // tooltip={[
                        //     "type*value",
                        //     (item, percent) => {
                        //         percent = percent * 100 + "%";
                        //         return {
                        //             name: item,
                        //             value: percent
                        //         };
                        //     }
                        // ]}
                        style={{
                            lineWidth: 1,
                            stroke: "#fff"
                        }}
                    >
                        {/* <Label
                            content="percent"
                            formatter={(val, item) => {
                                return item.point.item + ": " + val;
                            }}
                        /> */}
                    </Geom>
                </Chart>
            </Card>
        )
    }
}