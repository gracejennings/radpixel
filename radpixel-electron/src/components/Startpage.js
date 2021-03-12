import React, { useState, useEffect } from "react";
import { Workspace } from "./Workspace";

const electron = window.require("electron");
const { ipcRenderer } = electron;
const { shell } = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;

export const Startpage = (props) => {
    const [videoSrc, setVideoSrc] = useState("alpha_manyevents.mp4");

        return (
        <div>
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
                    <Workspace />
                      //shell.openPath(result.filePaths[0]);
                      console.log(result.filePaths[0]);
                      setVideoSrc(result.filePaths[0]);
                    });
                }}
              ></button>
              <Workspace videoSrc={"alpha_manyevents.mp4"}/>

        </div>
        
        );

};