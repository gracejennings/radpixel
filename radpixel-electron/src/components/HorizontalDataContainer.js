import React from "react";
import styled from "styled-components";
import {
  Typography,
  Statistic,
  Divider,
  InputNumber,
  Button,
} from "antd";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const StatsContainer = styled.div`
  padding: 0px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const HorizontalDataContainer = (props) => {

  const handleRunClick = () => {
    props.restartScript();
  };

  return (
    <Wrapper>
      <Title level={4} style={{paddingTop: "15px"}}>Event count by video frame</Title>
      <ResponsiveContainer height="45%">
        {props.lineChartData ? (
          <LineChart data={props.lineChartData}>
            <Line
              type="monotone"
              dataKey="events"
              stroke="#8884d8"
              dot={false}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="frame" />
            <YAxis width={40} />
            <Tooltip />
          </LineChart>
        ) : (
          <div>Loading chart data...</div>
        )}
      </ResponsiveContainer>
      <Divider />
      <Title level={4} >Total Event Count and Threshold</Title>
      <StatsContainer>
        {props.eventCount ? (
            <Statistic
              title={`Event count - pixels over threshold`}
              value={props.eventCount}
            />
          ) : (
            <div>Loading...</div>
        )}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <InputNumber
              min={0}
              max={256}
              defaultValue={props.eventThreshold}
              onChange={(val) => props.thresholdChange(val)}
            />
            {props.videoSrc ? (
              <Button
                id="run"
                onClick={handleRunClick}
                type="primary"
                icon={props.pythonScriptRunning ? <LoadingOutlined /> : null}
                style={{ minWidth: 90 }}
              >
                {props.pythonScriptRunning ? "" : "Run Script"}
              </Button>
            ) : null}
          </div>
          <div>Set pixel event threshold (out of 256)</div>
        </div>
      </StatsContainer>
    </Wrapper>
  );
};
