# RADPIXEL

This Electron desktop application ( Linux supported ) applies image processing algorithms to an input video clip to analyze the effects of irradiation on imagers. 

## Getting Started 

Clone this repo to get started. This contains all of the source code necessary to edit, build, and package the application. The three dependencies you will need preinstalled are [python3](https://www.python.org/downloads/),  [OpenCV](https://opencv.org/) and [NumPY](https://numpy.org/). To run, you will need to be able to select a Python interpreter.

### Development Mode

In the ```radpixel-electron``` project directory run ```npm start``` to launch the app locally. The page will reload as you save edits and any errors will appear in the development console. 

### Building

The build config is located in the package.json. This is currently configured for Linux with a target rpm package. To start the build process run ```npm run build-linux```. 

### Installing on Linux Machine

The resulting .rpm file can be distributed and installed on Linux. It has been tested on CentOS7 and CentOS8. 


## Architecture

1. **Main Process**: [/public/electron.js](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/public/electron.js)
There can only be one main process throughout an electron app lifecycle. The purpose of the main process is to create and manage additional renderer processes. Each renderer process is run by a BrowserWindow instance for its own Web page/GUI
2. **Visible Renderer Process**: [src/App.js](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/src/App.js) Each BrowserWindow created by the main process yields a renderer process to show the webpage. To make use of native OS features, every renderer process has to communicate with the main process. The remote module allows you to access the main process features directly from the renderer process
3. **Hidden Renderer Process**: [/background/startup_aggregate.html](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/background/startup_aggregate.html) The hidden renderer process does not have a visible browser window. The goal of this window is to perform heavy computational tasks in the background by receiving messages from the python script
4. **Python Script**: [/scripts/startup_aggregate.py](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/scripts/startup_aggregate.py) To make it work with the electron code, we used a Npm module called python-shell which lets us execute external python scripts from the nodeJS application

The communication between the processes is made possible with Electron’s built in IPC modules: [ipcMain](https://www.electronjs.org/docs/api/ipc-main) and [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer).

### Built With
- [Electron](https://www.electronjs.org/docs) - framework for creating desktop applications using web technologies (HTML/CSS, JS)
- [React](https://reactjs.org/)  - JavaScript library for creating front end user interfaces
- [AntDesign](https://ant.design/) - React UI library 
- [Python](https://docs.python.org/3/)  - used for writing image processing code

### Ongoing and Future Development

1. Investigate methods to export completed analysis