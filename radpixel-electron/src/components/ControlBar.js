import React from "react";
import {
  FastForwardOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { Statistic } from "antd";
import styled from "styled-components";

const ControlWrapper = styled.div`
  text-align: center;
  font-size: 40px;
  background-color: lightgray;
`;

export const ControlBar = (props) => {
  // clicking step backward sends the video to the beginning in its paused state
  const handleStepBackward = () => {
    props.updateTime(0);
    props.changeVideoState("pause");
  };

  // clicking step forward sends the video to the end in paused state
  const handleStepForward = () => {
    props.updateTime(props.videoDuration);
    props.changeVideoState("pause");
  };

  return (
    <ControlWrapper>
      <StepBackwardOutlined onClick={handleStepBackward} />
      {props.videoState === "pause" ? (
        <CaretRightOutlined onClick={() => props.changeVideoState("play")} />
      ) : (
        <PauseOutlined onClick={() => props.changeVideoState("pause")} />
      )}
      {props.videoState === "ffw" ? (
        <FastForwardOutlined
          onClick={() => props.changeVideoState("pause")}
          style={{ color: "white" }}
        />
      ) : (
        <FastForwardOutlined onClick={() => props.changeVideoState("ffw")} />
      )}
      <StepForwardOutlined onClick={handleStepForward} />
      <span style={{ float: "right" }}>
        <Statistic title="seconds" value={props.currentTime} precision={2} />
      </span>
    </ControlWrapper>
  );
};
