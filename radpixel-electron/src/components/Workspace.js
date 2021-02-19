import React, { useState } from "react";
import { Row, Col } from "antd";
import "./Workspace.css";
import { GraphContainer } from "./GraphContainer";
import { VideoPlayer } from "./VideoPlayer";
import { StatsContainer } from "./StatsContainer";
import { ControlBar } from "./ControlBar";

const electron =window.require('electron');
const {shell} = window.require('electron');
const remote = electron.remote
const {BrowserWindow,dialog} = remote

export const Workspace = (props) => {
  const [videoState, setVideoState] = useState("pause"); // one of: "pause", "play", "ffw"
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoSrc, setVideoSrc] = useState("alpha_manyevents.mp4");
  const [videoDuration, setVideoDuration] = useState(null); // hacky @TODO clean this up

  const changeVideoState = (newState) => {
    setVideoState(newState);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Row className="body-row">
        <Col span={16}>
          <Row style={{ height: "80%" }}>
            <VideoPlayer
              videoState={videoState}
              videoSrc={videoSrc}
              videoTime={videoTime}
              updateTime={(time) => setVideoTime(time)}
              updateDuration={(duration) => setVideoDuration(duration)}
            />
          </Row>
          <Row align="middle" style={{ height: "20%" }}>
            <StatsContainer />
          </Row>
        </Col>
        <Col span={8}>
          <Row style={{ height: "100%" }}>
            <GraphContainer />
          </Row>
        </Col>
      </Row>
      <Row className="footer-row">
        <Col span={24}>
          <button id= "upload" onClick={()=>{
          dialog.showOpenDialog(
              {
                title:'Open Dialogue',
                message:'First Dialog',
                //pass 'openDirectory' to strictly open directories
                properties: ['openFile']
              }
          ).then(result=>{
            shell.openPath(result.filePaths[0])
            console.log(result.filePaths[0]);
            })
        }}>Upload File </button> 
          <ControlBar
            videoState={videoState}
            changeVideoState={(newState) => changeVideoState(newState)}
            currentTime={videoTime}
            updateTime={(time) => setVideoTime(time)}
            videoDuration={videoDuration}
          />
        </Col>
      </Row>
    </div>
  );
};