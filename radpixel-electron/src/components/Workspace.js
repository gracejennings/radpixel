import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import './Workspace.css';
import { GraphContainer } from './GraphContainer';
import { VideoPlayer } from './VideoPlayer';
import { StatsContainer } from './StatsContainer';

const Container = styled.div`
    border: 1px solid black;
    border-radius: 5px;
    width: 100%;
    height: 100%;
`;

export const Workspace = (props) => {
    return (
        <div style={{height: '100vh'}}>
            <Row className="body-row">
                <Col span={16}>
                    <Row style={{height: '80%'}}>
                        <VideoPlayer />
                    </Row>
                    <Row align="middle" style={{height: '20%'}}>
                        <StatsContainer />
                    </Row>
                </Col>
                <Col span={8}>
                    <Row style={{height: '100%'}}>
                        <GraphContainer />
                    </Row>
                </Col>
            </Row>
            <Row className="footer-row">
                <Col span={24}>
                    <Container>
                        Control panel
                    </Container>
                </Col>
            </Row>
        </div>
    )
};

