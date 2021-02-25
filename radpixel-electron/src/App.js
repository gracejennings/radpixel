import React, { Component } from "react";
// import logo from './logo.svg';
import { Workspace } from "./components/Workspace";

// const electron = window.require('electron');
// const { ipcRenderer } = electron;

class App extends Component {
  
  render() {
    return (
      <div>
        <p>
			Edit <code>src/App.js</code> and save to reload.
		</p>
        <Workspace />
      </div>
    );
  }
}

export default App;
