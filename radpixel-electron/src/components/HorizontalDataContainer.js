import React from "react";
import styled from "styled-components";
import { Typography, Statistic, Divider, InputNumber, Button } from "antd";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
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
      <Title level={4} style={{ paddingTop: "15px" }}>
        Event Count by Video Frame
      </Title>
      <ResponsiveContainer height="45%">
        {props.lineChartData ? (
          <LineChart data={props.lineChartData}>
            <Line
              type="monotone"
              dataKey="events"
              stroke="#8884d8"
              dot={false}
              isAnimationActive={false}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis
              dataKey="frame"
              type="number"
              domain={[0, props.frameCount]}
              label={{
                value: "Video Frame",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Event Count",
                angle: -90,
                position: "insideBottomLeft",
                offset: 20,
              }}
            />
            <Tooltip />
          </LineChart>
        ) : (
          <div>
            {props.pythonScriptRunning ? "Loading chart data..." : "No data"}
          </div>
        )}
        {/* <div>`Frames: ${props.frameCount}`</div> */}
      </ResponsiveContainer>
      <Divider />
      <Title level={4}>Total Event Count and Threshold</Title>
      <StatsContainer>
        {props.eventCount ? (
          <Statistic
            title={`Event count - pixels over threshold`}
            value={props.eventCount}
          />
        ) : (
          <div>{props.pythonScriptRunning ? "Loading..." : "No data"}</div>
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
