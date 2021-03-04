import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import "./Workspace.css";
import { GraphContainer } from "./GraphContainer";
import { VideoPlayer } from "./VideoPlayer";
import { StatsContainer } from "./StatsContainer";
import { ControlBar } from "./ControlBar";

const electron = window.require("electron");
const { ipcRenderer } = electron;
const { shell } = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;

export const Workspace = (props) => {
  const [videoState, setVideoState] = useState("pause"); // one of: "pause", "play", "ffw"
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoSrc, setVideoSrc] = useState("alpha_manyevents.mp4");
  const [videoDuration, setVideoDuration] = useState(null); // hacky @TODO clean this up

  const [eventThreshold, setEventThreshold] = useState("150"); // this must be a string!!
  const [eventCount, setEventCount] = useState(null);

  const [lineChartData, setLineChartData] = useState(null);

  const changeVideoState = (newState) => {
    setVideoState(newState);
  };

  useEffect(() => {
    // this is an expensive query, so let's make sure we only run it when necessary
    if (!eventCount && !lineChartData) {
      // setting up an event listener to read data that background process
      // will send via the main process after processing the data we
      // send from visiable renderer process
      ipcRenderer.on("MESSAGE_FROM_BACKGROUND_VIA_MAIN", (event, args) => {
        console.log("got message from the background: ", JSON.parse(args));
        const aggData = JSON.parse(args);
        setEventCount(aggData.eventCount);
        setLineChartData(aggData.eventsTime);
      });

      // trigger event to start background process
      // must pass multiple arguments as an array of strings
      // this query can take up to 50 seconds. Be patient.
      ipcRenderer.send("START_BACKGROUND_VIA_MAIN", {
        data: [
          "/Users/willmiller/Projects/eece4950/radpixel/radpixel-electron/public/alpha_manyevents.mp4",
          "150",
        ],
      });
    }
  }, []);

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
            <StatsContainer
              eventThreshold={eventThreshold}
              eventCount={eventCount}
            />
          </Row>
        </Col>
        <Col span={8}>
          <Row style={{ height: "100%" }}>
            <GraphContainer lineChartData={lineChartData} />
          </Row>
        </Col>
      </Row>
      <Row className="footer-row">
        <Col span={24}>
          <button
            id="upload"
            onClick={() => {
              dialog
                .showOpenDialog({
                  title: "Open Dialogue",
                  message: "First Dialog",
                  //pass 'openDirectory' to strictly open directories
                  properties: ["openFile"],
                })
                .then((result) => {
                  shell.openPath(result.filePaths[0]);
                  console.log(result.filePaths[0]);
                });
            }}
          >
            Upload File{" "}
          </button>
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
