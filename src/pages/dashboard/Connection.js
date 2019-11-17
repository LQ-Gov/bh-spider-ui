import React, { Component, Suspense } from 'react';

import { Row, Col, Card, Statistic } from 'antd';

import styles from './style.less'

export default class Connectin extends Component {

    render() {
        return (
            <Card bordered={false} className={styles.dashboardCard}>
                <Statistic title="客户端连接数" value={112893} />
            </Card>
        )
    }
}