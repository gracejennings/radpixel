import React, { useState } from "react";
import { Workspace } from "./Workspace";
import "./Startpage.css";
import { Button, Typography, Space } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

const electron = window.require("electron");
const remote = electron.remote;
const { dialog } = remote;
const { Title, Text } = Typography;

export const Startpage = (props) => {
  const [pythonPath, setPythonPath] = useState("python3");
  const [pythonSelected, setPythonSelected] = useState(false);

  const handleSelectClick = () => {
    dialog
      .showOpenDialog({
        title: "Select Python Interpreter",
        message: "Select Python Interpreter",
        //pass 'openDirectory' to strictly open directories
        properties: ["openFile"],
      })
      .then((result) => {
        // <Workspace />
        //shell.openPath(result.filePaths[0]);
        if (typeof result.filePaths[0] != "undefined") {
          setPythonPath(result.filePaths[0]);
          setPythonSelected(true);
        }
      });
  };

  const handleSystemClick = () => {
    setPythonPath("python3");
    setPythonSelected(true);
  };

  return (
    <div style={{ height: "100vh" }}>
      {pythonSelected ? (
        <Workspace pythonPath={pythonPath} />
      ) : (
        <div className="wrapper">
          <Title level={1}>RadPixel</Title>
          <Space
            direction="vertical"
            style={{ textAlign: "left", margin: "0px 100px" }}
          >
            <Text>
              Please select a Python interpreter for processing. The interpreter
              is an executable called "python", "python3", or
              "python&lt;version&gt;" and is usually in a folder called "bin".
            </Text>
            <Text>
              OpenCV and NumPy are the only required dependencies. You will need
              to install both.
            </Text>
            <Text>
              We recommend using a virtual environment to avoid conflicting
              dependencies. However, if you prefer to use system Python, select
              "Use System" below.
            </Text>
          </Space>
          <Space direction="horizontal" style={{marginTop: "20px"}}>
            <Button
              id="select"
              onClick={handleSelectClick}
              size="large"
              type="primary"
              icon={<FileSearchOutlined />}
            >
              Select Python Interpreter
            </Button>
            <Button
              id="system"
              onClick={handleSystemClick}
              size="large"
              type="default"
            >
              Use System
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};
