import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal } from "antd";
import "./Workspace.css";
import { VerticalDataContainer } from "./VerticalDataContainer";
import { VideoPlayer } from "./VideoPlayer";
import { HorizontalDataContainer } from "./HorizontalDataContainer";
import { ControlBar } from "./ControlBar";

const electron = window.require("electron");
const { ipcRenderer } = electron;
const remote = electron.remote;
const { dialog } = remote;

export const Workspace = (props) => {
  const [pythonPath, setPythonPath] = useState(props.pythonPath);
  const [pythonScriptRunning, setPythonScriptRunning] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [pythonErrorMessage, setPythonErrorMessage] = useState("");

  const [videoState, setVideoState] = useState("pause"); // one of: "pause", "play", "ffw", "end", "beg"
  const [videoTime, setVideoTime] = useState(0); // in seconds
  const [videoSrc, setVideoSrc] = useState(null);

  const [eventThreshold, setEventThreshold] = useState(150);
  const [eventCount, setEventCount] = useState(null);
  const [pixelData, setPixelData] = useState(null); // info on hot pixels. {num frames: [pixel coords]}
  const [quadrantData, setQuadrantData] = useState(null); // [top left, top right, bottom left, bottom right]

  const [frameCount, setFrameCount] = useState(null);
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
          // trigger event to start background process
          // must pass multiple arguments as an array of strings
          // this query can take up to 50 seconds. Be patient.
          ipcRenderer.send("START_BACKGROUND_VIA_MAIN", {
            data: [result.filePaths[0], eventThreshold.toString()],
            pythonPath: pythonPath,
          });

          setVideoSrc(result.filePaths[0]);
          setEventCount(null);
          setPixelData(null);
          setLineChartData(null);
          setHistogramData(null);
          setQuadrantData(null);

          setPythonScriptRunning(true);
        }
      });
  };

  const handleInterpreterChange = () => {
    dialog
      .showOpenDialog({
        title: "Select Python Interpreter",
        message: "Select Python Interpreter",
        //pass 'openDirectory' to strictly open directories
        properties: ["openFile"],
      })
      .then((result) => {
        if (typeof result.filePaths[0] != "undefined") {
          setPythonPath(result.filePaths[0]);
          setShowErrorModal(false);
          setVideoSrc(null);
        }
      });
  };

  const handleRestart = () => {
    ipcRenderer.send("START_BACKGROUND_VIA_MAIN", {
      data: [videoSrc, eventThreshold.toString()],
      pythonPath: pythonPath,
    });

    setEventCount(null);
    setPixelData(null);
    setFrameCount(null);
    setLineChartData(null);
    setHistogramData(null);
    setQuadrantData(null);
    
    setPythonScriptRunning(true);
  };

  const handleThresholdChange = (val) => {
    setEventThreshold(val);
  };

  useEffect(() => {
    // setting up an event listener to read data that background process
    // will send via the main process after processing the data we
    // send from visiable renderer process
    ipcRenderer.on("MESSAGE_FROM_BACKGROUND_VIA_MAIN", (event, args) => {
      if (args.error) {
        // error message has already been stringified, no need to parse
        setPythonErrorMessage(args.error);
        setShowErrorModal(true);
        
        setPythonScriptRunning(false);
      } else if (args.message === "start") {
        setFrameCount(aggData.frameCount);
        console.log("Received the event count to intialize graph", frameCount);
      } else if (args.message === "progress") {
        setEventCount(aggData.eventCount);
        setLineChartData(aggData.eventsTime);
      } else {
        // real data has already been parsed
        setEventCount(args.message.eventCount);
        setLineChartData(args.message.eventsTime);
        setHistogramData(args.message.histogram);
        setPixelData(args.message.hotpixels);
        setQuadrantData(args.message.quadrants);
        
        setPythonScriptRunning(false);
      }
    });

    // listen for python PID
    ipcRenderer.on("PID_FROM_BACKGROUND_VIA_MAIN", (event, args) => {
      if (!args) {
        setPythonErrorMessage(
          "The Python process was not created. Please make sure that you selected a valid Python interpreter on the local filesystem."
        );
        setShowErrorModal(true);

        setPythonScriptRunning(false);
      }
    });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Row className="body-row">
        <Col span={13} style={{ bottom: "60px", top: "0px" }}>
          <Row style={{ height: "60%" }}>
            <VideoPlayer
              videoState={videoState}
              videoSrc={videoSrc}
              updateTime={(time) => setVideoTime(time)}
            />
          </Row>
          <Row align="middle" style={{ height: "40%" }}>
            <HorizontalDataContainer 
              frameCount={frameCount}
              lineChartData={lineChartData} 
              eventCount={eventCount}
              eventThreshold={eventThreshold}
              thresholdChange={(val) => handleThresholdChange(val)}
              pythonScriptRunning={pythonScriptRunning}
              restartScript={() => handleRestart()}
              videoSrc={videoSrc}
            />
          </Row>
        </Col>
        <Col span={11} style={{ bottom: "60px", top: "0px" }}>
          <Row>
            <VerticalDataContainer
              eventThreshold={eventThreshold}
              thresholdChange={(val) => handleThresholdChange(val)}
              eventCount={eventCount}
              pixelData={pixelData}
              histogramData={histogramData}
              pythonScriptRunning={pythonScriptRunning}
              videoSrc={videoSrc}
              restartScript={() => handleRestart()}
              quadrantData={quadrantData}
            />
          </Row>
        </Col>
      </Row>
      <Row className="footer-row">
        <Col span={24}>
          <ControlBar
            videoState={videoState}
            videoSrc={videoSrc}
            changeVideoState={(newState) => changeVideoState(newState)}
            currentTime={videoTime}
            uploadClick={() => handleUploadClick()}
          />
        </Col>
      </Row>
      <Modal
        title="Python Error"
        visible={showErrorModal}
        style={{ color: "red" }}
        footer={[
          <Button type="primary" onClick={handleInterpreterChange}>
            Change Python Interpreter
          </Button>,
        ]}
      >
        <p>{pythonErrorMessage}</p>
      </Modal>
    </div>
  );
};
