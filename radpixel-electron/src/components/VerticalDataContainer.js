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
  ScatterChart,
  Rectangle,
  Scatter,
  LabelList,
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

  const formatHistogramData = () => {
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
    } else {
      return [];
    }
  };

  // quadrantData always has 4 elements - top left, top right, bottom left, bottom right
  const formatQuadrantData = () => {

    const formattedData = [];

    if (props.quadrantData) {
      const total = props.quadrantData.reduce((a, b) => a + b, 0);
      for (var i=0; i<4; ++i) {
        let color;
        if (props.quadrantData[i] / total < 0.25 ) {
          color = "yellow";
        } else if (props.quadrantData[i] / total < 0.50 ) {
          color = "orange";
        } else if (props.quadrantData[i] / total < 0.75 ) {
          color = "red";
        } else {
          color = "purple";
        }

        let x;
        let y;
        if (i === 0) {
          x = 0;
          y = 1;
        } else if (i === 1) {
          x = 1;
          y = 1;
        } else if (i === 2) {
          x = 0;
          y = 0;
        } else {
          x = 1;
          y = 0;
        }

        formattedData.push({
          data: [{
            count: props.quadrantData[i],
            x: x,
            y: y,
          }],
          color: color
        });
      }
    } 

    console.log("fire!", formattedData);


    return formattedData;

  }

  const CustomShape = (props) => {
    return (
        <Rectangle
          {...props}
          height={87}
          width={112}
          x={props.x + 5}
          y={props.y - 84}
        />      
    )
  };

  const renderCustomLabel = ({x, y, width, height, value}) => {
    return (
      <g>
        <text x={x + 60} y={y - 35} textAnchor="middle" >{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</text>
      </g>
    )
  };

  return (
    <>
      <LabelWrapper style={{ marginTop: 10 }}>
        <Title level={4}>Event Count by Quadrant</Title>
      </LabelWrapper>
      <div style={{width: "100%"}}>
        <ScatterChart width={300} height={220} style={{paddingLeft: "10%", paddingRight: "5%", marginBottom: "-40px"}}>
          <XAxis dataKey="x" type="number" domain={[0,2]} tickCount={3} tick={<div />} />
          <YAxis dataKey="y" type="number" domain={[0,2]} tickCount={3} tick={<div />} />
          <CartesianGrid />
          {formatQuadrantData().map(el => (<Scatter 
            data={el.data}
            fill={el.color}
            shape={CustomShape}
          >
            <LabelList dataKey="count" content={renderCustomLabel} />
          </Scatter>))}
        </ScatterChart>
      </div>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Hot pixel data</Title>
      </LabelWrapper>
      <PlotWrapper>
        <PixelTable pixelData={props.pixelData} />
      </PlotWrapper>
      <Divider />
      <LabelWrapper>
        <Title level={4}>Pixel Value Histogram</Title>
      </LabelWrapper>
      <PlotWrapper>
        <ResponsiveContainer width="99%" height={200} style={{marginLeft: "30px"}}>
          {props.histogramData ? (
            <BarChart data={formatHistogramData()}>
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
