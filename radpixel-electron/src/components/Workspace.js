import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import "./Workspace.css";
import { VerticalDataContainer } from "./VerticalDataContainer";
import { VideoPlayer } from "./VideoPlayer";
import { HorizontalDataContainer } from "./HorizontalDataContainer";
import { ControlBar } from "./ControlBar";

const electron = window.require("electron");
const { ipcRenderer } = electron;
const { shell } = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;

export const Workspace = (props) => {
  const [videoState, setVideoState] = useState("pause"); // one of: "pause", "play", "ffw"
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null); // hacky @TODO clean this up

  const [eventThreshold, setEventThreshold] = useState(150);
  const [eventCount, setEventCount] = useState(null);
  const [pixelData, setPixelData] = useState(null); // info on hot pixels. {num frames: [pixel coords]}

  const [lineChartData, setLineChartData] = useState(null);
  const [histogramData, setHistogramData] = useState(null);

  // for testing purposes with factorial
  // const [number, setNumber] = useState(25);

  const changeVideoState = (newState) => {
    setVideoState(newState);
  };

  const handleUploadClick = (e) => {
    dialog
      .showOpenDialog({
        title: "Open Dialogue",
        message: "Select a video file",
        properties: ["openFile"],
      })
      .then((result) => {
        if (typeof result.filePaths[0] != "undefined") {
          setVideoSrc(`local-video://${result.filePaths[0]}`);

          // trigger event to start background process
          // must pass multiple arguments as an array of strings
          // this query can take up to 50 seconds. Be patient.
          console.log("Starting the background w videoSrc: " + result.filePaths[0]);

          ipcRenderer.send("START_BACKGROUND_VIA_MAIN", {
            data: [result.filePaths[0], eventThreshold.toString()],
          });
        }
      });
  };

  const handleThresholdChange = (val) => {
    setEventThreshold(val);
  };

  useEffect(() => {
    // setting up an event listener to read data that background process
    // will send via the main process after processing the data we
    // send from visiable renderer process
    ipcRenderer.on("MESSAGE_FROM_BACKGROUND_VIA_MAIN", (event, args) => {
      const aggData = JSON.parse(args);
      setEventCount(aggData.eventCount);
      setLineChartData(aggData.eventsTime);
      setHistogramData(aggData.histogram);
      setPixelData(aggData.hotpixels);
    });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Row className="body-row">
        <Col span={16} style={{ bottom: "60px", top: "0px" }}>
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
            <HorizontalDataContainer lineChartData={lineChartData} />
          </Row>
        </Col>
        <Col span={8} style={{ bottom: "60px", top: "0px" }}>
          <Row>
            <VerticalDataContainer
              eventThreshold={eventThreshold}
              thresholdChange={(val) => handleThresholdChange(val)}
              eventCount={eventCount}
              pixelData={pixelData}
              histogramData={histogramData}
            />
          </Row>
        </Col>
      </Row>
      <Row className="footer-row">
        <Col span={24}>
          <ControlBar
            videoState={videoState}
            changeVideoState={(newState) => changeVideoState(newState)}
            currentTime={videoTime}
            updateTime={(time) => setVideoTime(time)}
            videoDuration={videoDuration}
            uploadClick={() => handleUploadClick()}
          />
        </Col>
      </Row>
    </div>
  );
};
