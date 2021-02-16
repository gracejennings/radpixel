import React from 'react';
import { Row, Col, Statistic } from 'antd';

export const StatsContainer = (props) => {
    
    const stats = [
        {title: 'stat1', value: 100.23}, 
        {title: 'stat2', value: 0}, 
        {title: 'stat3', value: 0.1123}
    ];

    return (
        <>
            {
                stats.map((val, idx) => (
                    <Col flex="auto">
                        <Statistic title={val.title} value={val.value} />
                    </Col>
                ))
            }
        </>        
    )
};