import React, { useState, useEffect } from "react";
import { Workspace } from "./Workspace";
import "./Startpage.css";

const electron = window.require("electron");
const { ipcRenderer } = electron;
const { shell } = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;

export const Startpage = (props) => {
    const [videoSrc, setVideoSrc] = useState("alpha_manyevents.mp4");
    const [fileSelected, setFileSelected] = useState(false);

    return (
      <div style={{ height: "100vh" }}>
        {!fileSelected &&
        <div className="wrapper">
          <div className="centered">
            <p>
              RadPixel
            </p>
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
                      // <Workspace />
                        //shell.openPath(result.filePaths[0]);
                        if (typeof result.filePaths[0] != 'undefined') {
                          console.log(result.filePaths[0]);
                          setVideoSrc(result.filePaths[0]);
                          setFileSelected(true);
                        }
                        
                      });
                  }}
                >
                  Upload File{" "}
            </button>
          </div> 
        </div>
        }
        {fileSelected && <Workspace videoSrc={videoSrc}/>}
      </div>
    ); 

};