import React, { useState, Component} from "react";
import { Row, Col } from "antd";
import "./Workspace.css";
import { GraphContainer } from "./GraphContainer";
import { VideoPlayer } from "./VideoPlayer";
import { StatsContainer } from "./StatsContainer";
import { ControlBar } from "./ControlBar";

const electron = window.require('electron');
const { ipcRenderer } = electron;


class Work extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoState: 'pause',
      videoTime: 0,
      videoSrc: 'alpha_manyevents.mp4',
      videoDuration: null
    };
  }

  componentDidMount() {
    console.log('inside component did mount', this);
    
		// setting up an event listener to read data that background process
		// will send via the main process after processing the data we
		// send from visiable renderer process
		ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
      console.log(args, this);
      console.log('In the App.js on message from backrgound', this);
		});

		// trigger event to start background process
		// can be triggered pretty much from anywhere after
		// you have set up a listener to get the information
		// back from background process, as I have done in line 13
		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
			number: 25,
    });
    console.log('finished component did mount', this);
    }

    
    changeVideoState = (newState) => {
      this.setState({videoState: newState});
    };  
    setVideoTime = (time) => {
      this.setState({videoTime: (time)});
    }; 
    setVideoDuration = (duration) => {
      this.setState({videoDuration: duration});
    }; 

    render() {
      return (
        <div style={{ height: "100vh" }}>
          <Row className="body-row">
            <Col span={16}>
              <Row style={{ height: "80%" }}>
                <VideoPlayer
                  videoState={this.state.videoState}
                  videoSrc={this.state.videoSrc}
                  videoTime={this.state.videoTime}
                  updateTime={(time) => this.setVideoTime(time)}
                  updateDuration={(duration) => this.setVideoDuration(duration)}
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
            <p>var</p>
            <Col span={24}>
              <ControlBar
                videoState={this.state.videoState}
                changeVideoState={(newState) => this.changeVideoState(newState)}
                currentTime={this.state.videoTime}
                updateTime={(time) => this.setVideoTime(time)}
                videoDuration={this.state.videoDuration}
              />
            </Col>
          </Row>
        </div>
      );
    } 
    
}

// export default Workspace;
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
      <Work>
      {/* <Row className="body-row">
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
        <p>var</p>
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
      </Row> */}
      </Work>
    </div>
  );
};
