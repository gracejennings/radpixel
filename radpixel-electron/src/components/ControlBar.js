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

const UploadWrapper = styled.div`
  float: left;
  margin: 10px 10px 10px 10px;
  font-size: 16px;
  color: green;
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

  const handleUploadClick = () => {
    props.uploadClick();
  }

  return (
    <ControlWrapper>
      <UploadWrapper >
        <button
            id="upload"
            onClick={handleUploadClick}
            style={{float: 'left'}}
        >
          Upload File{" "}
        </button>
        <div>
          {props.videoSrc ? `Current: ${props.videoSrc.split("/")[props.videoSrc.split("/").length-1]}`: ''}
        </div>
      </UploadWrapper>
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
