import React from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Tooltip, Typography } from "antd";

const { Title } = Typography;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export const HorizontalDataContainer = (props) => {
  return (
    <Wrapper>
      <ResponsiveContainer height="80%">
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
      <Title level={4}>Event count by video frame</Title>
    </Wrapper>
  );
};
