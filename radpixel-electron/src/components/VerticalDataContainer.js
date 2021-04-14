import React, { useState } from "react";
import styled from "styled-components";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import {
  Slider,
  Typography,
  Statistic,
  Divider,
  InputNumber,
  Button,
} from "antd";
import { PixelTable } from "./PixelTable";
import { LoadingOutlined } from "@ant-design/icons";

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

  const handleRunClick = () => {
    props.restartScript();
  };

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "50%",
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
      </StatsWrapper>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Hot pixel data</Title>
      </LabelWrapper>
      <PlotWrapper>
        <PixelTable pixelData={props.pixelData} />
      </PlotWrapper>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Plots</Title>
      </LabelWrapper>
      <PlotWrapper>
        <ResponsiveContainer width="99%" height={200} style={{marginLeft: "30px"}}>
          {props.histogramData ? (
            <BarChart data={formatData()}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="bin" />
              <YAxis />
              <Bar dataKey="count" fill="#8884d8" />
              <Tooltip />
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
    </>
  );
};
