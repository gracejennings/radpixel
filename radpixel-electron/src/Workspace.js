import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import './Workspace.css';

const Container = styled.div`
    border: 1px solid black;
    border-radius: 0.25px;
    width: 100%;
`;

export const Workspace = (props) => {
    return (
        <div style={{height: '100vh'}}>
            <Row gutter={[16, 16]} style={{height: '90%'}}>
                <Col span={16}>
                    <Row style={{height: '80%'}}>
                        <Container>
                            Player
                        </Container>
                    </Row>
                    <Row style={{height: '20%'}}>
                        <Container>
                            Stats
                        </Container>
                    </Row>
                </Col>
                <Col span={8}>
                    <Row style={{height: '50%'}}>
                        <Container>
                            Graph 1
                        </Container>
                    </Row>
                    <Row style={{height: '50%'}}>
                        <Container>
                            Graph 2
                        </Container>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} >
                <Col span={24}>
                    <Container>
                        Control panel
                    </Container>
                </Col>
            </Row>
        </div>
    )
};

