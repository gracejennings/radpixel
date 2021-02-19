import React, { Component } from "react";
// import logo from './logo.svg';
import { Workspace } from "./components/Workspace";

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {
	componentDidMount() {
		// setting up an event listener to read data that background process
		// will send via the main process after processing the data we
		// send from visiable renderer process
		ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
		});

		// trigger event to start background process
		// can be triggered pretty much from anywhere after
		// you have set up a listener to get the information
		// back from background process, as I have done in line 13
		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
			number: 25,
		});
  }
  
  render() {
    return (
      <div>
        <Workspace />
      </div>
    );
  }
}

export default App;
