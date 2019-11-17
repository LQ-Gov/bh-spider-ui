import React, { Fragment, Component } from 'react';

import { Form, Card, Descriptions, Empty, Row, Col } from 'antd';

import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import { connect } from 'dva';

import { AutoSizer, List } from 'react-virtualized';

import styles from './style.less'

// import './style.less'

@connect(({ rule2, loading }) => ({
    watch: rule2.watch,
    loading: loading.effects['rule2/watch'],
}))
export default class Content extends Component {

    state = {}


    charData = [
        { time: 1, type: "exception", value: 10 },
        { time: 1, type: "crawling", value: 13 },
        { time: 1, type: "total", value: 20 },
        { time: 2, type: "exception", value: 10 },
        { time: 2, type: "crawling", value: 14 },
        { time: 2, type: "total", value: 20 },
        { time: 3, type: "exception", value: 10 },
        { time: 3, type: "crawling", value: 18 },
        { time: 3, type: "total", value: 20 },

    ]

    componentDidMount() {
        const id = this.props.match.params.id
        const dispatch = this.props.dispatch

        if (id) {
            dispatch({ type: 'rule2/fetchOne', id: id }).then((data) => {
                this.setState({ item: data })

                dispatch({ type: 'rule2/watch', id: id })

            })
        }
    }

    formatChains = (chains) => {
        var list = []

        for (var i in chains) {
            const chain = chains[i]
            list.push(`${chain.name}:${chain.components}`)
        }

        return list
    }


    streamRowRenderer = ({ index, isScrolling, key, style }) => {
        const { stream } = this.props.watch;
        const item = stream[index];


        return (
            <div key={key} style={style}>{item.value}</div>
        );
    };


    render() {
        const item = this.state.item

        if (!item) return (<div></div>)

        const { watch } = this.props

        console.log(watch)




        var urlCount = watch.urlCount

        const stream = watch.stream

        return (
            <Card bordered={false}>
                <Row>
                    <Col>
                        <Card type="inner" title="基本信息" size="small">
                            <Descriptions column={3}>
                                <Descriptions.Item label="规则">{item.pattern}</Descriptions.Item>
                                <Descriptions.Item label="cron表达式">{item.cron}</Descriptions.Item>
                                <Descriptions.Item label="并发数">{item.parallelCount == 0 ? '自动' : item.parallelCount}</Descriptions.Item>
                                <Descriptions.Item label="重复抓取">{item.repeat ? '是' : '否'}</Descriptions.Item>
                                <Descriptions.Item label="抓取策略">{item.policy}</Descriptions.Item>

                                <Descriptions.Item label="代理">{item.proxies ? '无代理' : item.proxies}</Descriptions.Item>
                                <Descriptions.Item label="描述" span={1}>{item.description}</Descriptions.Item>
                                <Descriptions.Item label="分配节点" span={2}>{item.nodes}</Descriptions.Item>

                                <Descriptions.Item label="抓取链" span={3}>{this.formatChains(item.chains)}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                </Row>
                <Row style={{ marginTop: 10 }}>

                    <Col span={17} >
                        <Card type="inner" title="运行走势" size="small" style={{ height: 370 }}>
                            <Chart height={330} data={this.props.watch.urlCount} padding={[60]} forceFit>
                                <Axis name="time" />
                                <Axis name="value" />
                                <Tooltip crosshairs={{ type: "cross" }} showTitle={false} />
                                <Geom type="line" position="time*value" color={["type", ['#FF4500', '#32CD32', '#1E90FF']]} size={2} shape={'smooth'} />
                            </Chart>
                        </Card>
                    </Col>

                    <Col span={7} style={{ paddingLeft: 10 }}>
                        <Card type="inner" title="运行走势" size="small" style={{ height: 370 }}>

                        </Card>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>



                    <Card type="inner" title="实时日志" size="small">
                        {stream.length > 0 ? (
                            <div className={styles.textStreamContainer}>

                                <AutoSizer>
                                    {({ width, height }) => {
                                        return (
                                            <List
                                                isScrolling={true}
                                                rowRenderer={this.streamRowRenderer}
                                                noRowsRenderer={() => (<div>到达底部</div>)}
                                                rowCount={stream.length}
                                                rowHeight={30}
                                                height={height}
                                                width={width}
                                            />)
                                    }
                                    }

                                </AutoSizer>
                            </div>) : (<Empty />)}
                    </Card>
                </Row>

            </Card>
        )
    }
}