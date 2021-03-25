import React, { useState } from "react";
import styled from "styled-components";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Slider, Typography, Statistic, Divider, InputNumber } from "antd";
import { PixelTable } from "./PixelTable";

const { Title } = Typography;

const PlotWrapper = styled.div`
  width: 100%;
  margin-right: 30px;
  margin-left: 10px;
`;

const StatsWrapper = styled.div`
  width: 100%;
  margin-left: 25px;
`;

const LabelWrapper = styled.div`
  margin-left: 15px;
`;

export const VerticalDataContainer = (props) => {
  const [histBinsOmitted, setHistBinsOmitted] = useState(6);

  const formatData = () => {
    if (props.histogramData) {
      const formattedData = [];
      for (
        var i = histBinsOmitted;
        i < props.histogramData.values.length;
        ++i
      ) {
        formattedData.push({
          bin: props.histogramData.bins[i + 1], // we choose the right bin edges here
          count: props.histogramData.values[i],
        });
      }
      return formattedData;
    }
  };

  return (
    <>
      <LabelWrapper style={{ marginTop: 24 }}>
        <Title level={4}>Statistics</Title>
      </LabelWrapper>
      <StatsWrapper>
        {props.eventCount ? (
          <Statistic
            title={`Event count - pixels over threshold`}
            value={props.eventCount}
          />
        ) : (
          <div>Loading...</div>
        )}
        <div style={{ marginTop: 25 }}>
          <InputNumber
            min={0}
            max={256}
            defaultValue={props.eventThreshold}
            onChange={(val) => props.thresholdChange(val)}
          />
          <div>Set pixel event threshold (out of 256)</div>
        </div>
      </StatsWrapper>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Hot pixel data</Title>
      </LabelWrapper>
      <StatsWrapper>
        <PixelTable pixelData={props.pixelData} />
      </StatsWrapper>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Plots</Title>
      </LabelWrapper>
      <PlotWrapper>
        <ResponsiveContainer width="99%" height={200}>
          {props.histogramData ? (
            <BarChart data={formatData()}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="bin" />
              <YAxis />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          ) : (
            <div>Loading chart data...</div>
          )}
        </ResponsiveContainer>
        <Title level={5}>Pixel value histogram</Title>
        {props.histogramData ? (
          <div>
            <Slider
              defaultValue={6}
              max={20}
              onChange={(value) => setHistBinsOmitted(value)}
            />
            <div>
              Omit lower pixel value bins from plot (y-axis changes dynamically)
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </PlotWrapper>
      {/* <PlotWrapper>
        <ResponsiveContainer width="99%" height={200}>
          <LineChart data={[{x: 0, y: 1}, {x: 1, y: 2}]}>
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="x" />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
        <Title level={5}>Example plot</Title>
      </PlotWrapper> */}
    </>
  );
};
