# RADPIXEL

This Electron desktop application (Linux supported) applies image processing algorithms to an input video clip to analyze the effects of radiation on imagers. RadPixel was developed by Grace Jennings, Will Miller, and Juyoung Song for their EECE Senior Design Project at the Vanderbilt School of Engineering.  

## Getting Started 

Clone this repo to get started. This contains all of the source code necessary to edit, build, and package the application. The three dependencies you will need preinstalled are [python3](https://www.python.org/downloads/),  [OpenCV](https://opencv.org/) and [NumPY](https://numpy.org/). To run, you will need to be able to select a Python interpreter with NumPy and OpenCV installed. We recommend isolating your Python environment using [venv](https://docs.python.org/3/library/venv.html), [pipenv](https://pypi.org/project/pipenv/) if you like `pip`, or [conda-env](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#activating-an-environment) if you are using Anaconda.

### Development Mode

In the ```radpixel-electron``` project directory run ```npm install``` and ```npm run start``` to launch the app locally. The page will reload as you save edits and any errors will appear in the development console. 

### Building

The build config is located in the package.json. This is currently configured for RedHat-Based Linux distributions in [package.json](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/package.json). 

	"build": {
	    "appId": "RadPixel",
	    "asar": false,
	    "linux": {
	      "target": [
	        "rpm"
	      ]
	    },
	    "rpm": {
	      "artifactName": "RadPixel.rpm",
	      "icon": "public/RadPixelLogo.png"
	    },
	    "files": [
	      "background/**/*",
	      "build/**/*",
	      "public/RadPixelLogo.png",
	      "node_modules/**/*",
	      "scripts/startup_aggregate.py"
	    ],
	    "extends": null
	  }

Note: ```asar``` is a packer that must be disabled to correctly package the python scripts. You might get a warning that it is not recommended for this to be disabled but this is for developers that do not want the source code to be visible for security purposes.


To start the build process run ```npm run build-linux``` which runs the scripts specified in [package.json](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/package.json).

	"react-build": "react-scripts build",
	"electron-build-linux": "electron-builder --linux -c.extraMetadata.main=build/electron.js",
	"build-linux": "npm run react-build && npm run electron-build-linux", 

You will find the target .rpm file in the /dist directory.

### Installing on Linux Machine

The resulting .rpm file can be distributed and installed on RedHat-based Linux distributions. It has been tested on CentOS 7 and CentOS 8. On CentOS 7, open a terminal and run `$ yum install RadPixel.rpm` to install, and `$ radpixel` to run the application. On CentOS 8, simply double-click the application.

## Imager irradiation

### Overview
Commercial imagers deployed in space are sensitive to radiation and the effects of radiation on imagers can dramatically impact the data (for example, adding noise). Researchers are interested in analyzing the transient effects and degradation of data due to radiation. ISDE is specifically interested in datasets collected by imagers in the following categories: Alpha Particle Button Source, Pulsed X-ray, Laser, and ARACOR.

### Types of radiation effects
The RadPixel application attempts to identify radiation events in the video using the intensity values for pixels in each frame. Pixels have a value between 0 and 256. We allow the user to set a threshold value in this range and any pixel that crosses that intensity threshold in the video is considered an event. Users can leverage the histogram of all pixel values across all frames to determine a suitable threshold value for a given video. All the events in the video are plotted by frame in order to show the radiation event rate over time.

It is also important to distinguish transient events from stuck pixels, also called hot pixels. Transient events are when pixels briefly light up when hit by radiation. Stuck pixels, on the other hand, represent permanent damage to the imager. In order to identify stuck pixels, users can use the Hot Pixels table to see the coordinate locations of the top ten pixels experiencing the most events across all video frames. Pixels that experienced a high number of events are more likely to have sustained permanent damage. Note for the coordinates that in videos the origin is in the top left corner rather than the bottom left.

Read more about imager irradiation effects here:


* [Radiation effects on image sensors](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/10564/105640M/Radiation-effects-on-image-sensors/10.1117/12.2309026.full?SSO=1)
* [NASA: Commercial Sensor Survey Fiscal Year 2008 Compendium Radiation Test Report](https://nepp.nasa.gov/files/16561/08_164_3%20JPL%20Becker%20Compendium%20report%201_09.pdf)

## Architecture

1. **Main Process**: [/public/electron.js](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/public/electron.js)
There can only be one main process throughout an electron app lifecycle. The purpose of the main process is to create and manage additional renderer processes. Each renderer process is run by a BrowserWindow instance for its own Web page/GUI.
2. **Visible Renderer Process**: [src/App.js](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/src/App.js) Each BrowserWindow created by the main process yields a renderer process to show the webpage. To make use of native OS features, every renderer process has to communicate with the main process. The remote module allows you to access the main process features directly from the renderer process.
3. **Hidden Renderer Process**: [/background/startup_aggregate.html](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/background/startup_aggregate.html) The hidden renderer process does not have a visible browser window. The goal of this window is to perform heavy computational tasks in the background by receiving messages from the Python script.
4. **Python Script**: [/scripts/startup_aggregate.py](https://github.com/gracejennings/radpixel/blob/main/radpixel-electron/scripts/startup_aggregate.py) To make it work with the electron code, we used the npm module [python-shell](https://www.npmjs.com/package/python-shell) which allows us to execute external Python scripts from the nodeJS application.

The communication between the processes is made possible with Electron’s built in IPC modules: [ipcMain](https://www.electronjs.org/docs/api/ipc-main) and [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer).

### Built With
- [Electron](https://www.electronjs.org/docs) - framework for creating desktop applications using web technologies (HTML/CSS, JS)
- [React](https://reactjs.org/)  - JavaScript library for creating front end user interfaces
- [AntDesign](https://ant.design/) - React UI library 
- [Python](https://docs.python.org/3/)  - used for writing image processing code

### Ongoing and Future Development

1. Export completed analysis to files, a database, or a website.
2. Provide analysis of dark signal non-uniformity (DNSU) effects.
3. Optimize Python backend with multiple scripts.
