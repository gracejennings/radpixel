import React from "react";
import {
  FastForwardOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PauseOutlined,
  CaretRightOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Statistic } from "antd";
import { Button } from "antd";
import styled from "styled-components";

const ControlWrapper = styled.div`
  text-align: center;
  font-size: 40px;
  background-color: lightgray;
  display: grid;
  grid-template-columns: 350px auto 350px;
`;

const UploadWrapper = styled.div`
  margin: 10px 10px 10px 10px;
  font-size: 16px;
  grid-column-start: 1;
  justify-self: start;
  display: flex;
`;

export const ControlBar = (props) => {
  // clicking step backward sends the video to the beginning in its paused state
  const handleStepBackward = () => {
    props.changeVideoState("beg");
  };

  // clicking step forward sends the video to the end in paused state
  const handleStepForward = () => {
    props.changeVideoState("end");
  };

  const handleUploadClick = () => {
    props.uploadClick();
  };

  return (
    <ControlWrapper>
      <UploadWrapper>
        <Button
          id="upload"
          onClick={handleUploadClick}
          type="primary"
          icon={<UploadOutlined />}
          size="large"
        >
          Upload File
        </Button>
        <div style={{ fontSize: 12, marginLeft: 5 }}>
          {props.videoSrc
            ? `Current file: ${
                props.videoSrc.split("/")[props.videoSrc.split("/").length - 1]
              }`
            : ""}
        </div>
      </UploadWrapper>
      <div style={{ gridColumnStart: 2 }}>
        <StepBackwardOutlined onClick={handleStepBackward} />
        {props.videoState === "play" || props.videoState === "ffw" ? (
          <PauseOutlined onClick={() => props.changeVideoState("pause")} />
        ) : (
          <CaretRightOutlined onClick={() => props.changeVideoState("play")} />
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
      </div>
      <div style={{ gridColumnStart: 3, justifySelf: "end" }}>
        <Statistic title="seconds" value={props.currentTime} precision={2} />
      </div>
    </ControlWrapper>
  );
};
