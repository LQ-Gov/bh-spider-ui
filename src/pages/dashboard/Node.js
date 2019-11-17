import React, { Component, Suspense } from 'react';

import { ChartCard, MiniArea, MiniBar, MiniProgress, Field, yuan } from 'ant-design-pro/lib/Charts';

import { FormattedMessage } from 'umi/locale';


import { Trend } from 'ant-design-pro'

import numeral from 'numeral';

import styles from './style.less'

export default class Node extends Component {

    level=(survival,total)=>{
        var value = survival/total
        if(value>0.8) return 1
        if(value<=0.3) return -1

        return 0
    }

    color=(level)=>{
        if(level==-1) return 'red'
        if(level==0) return 'yellow'
        return 'green'
    }
    
    render() {

        const {survival,total} = this.props

        const level = this.level(survival,total)
        return (
            <ChartCard
                bordered={false}
                title={
                    <FormattedMessage id="app.dashborad.resource.node.count" defaultMessage="Total Sales" />
                }

                total={() => `${survival}/${total}`}

                contentHeight={46}

                footer={
                    <Field
                        label={<FormattedMessage id="app.analysis.safe.level" defaultMessage="Daily Sales" />}
                        value={<span style={{color:this.color(level)}}><FormattedMessage id={`app.analysis.safe.level.${level}`} /></span>}
                    />
                }
            >

                <MiniProgress percent={100*(survival/total)} color={this.color(level)} strokeWidth={10} target={80} />
            </ChartCard>
        )
    }
}