import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "./VideoPlayer.css";

const TIME_GRANULARITY = 10; // number of milliseconds between updates

// this code ripped straight from videojs docs: https://docs.videojs.com/tutorial-react.html
// I hate class components!!! >:( @TODO turn this into a functional component
class Video extends React.Component {
  componentDidMount() {
    this.player = videojs(
      this.videoNode,
      this.props.options,
      function onPlayerReady() {
        console.log("Video.js Ready", this);
      }
    );
    this.player.fill(true);

    switch (this.props.state) {
      case "play":
        this.player.playbackRate(1.0);
        this.player.play();
        break;
      case "pause":
        this.player.pause();
        break;
      case "ffw":
        this.player.playbackRate(2.0);
        this.player.play();
        break;
      default:
        this.player.pause(); // maybe??
    }

    this.duration = 0; // we'll set this value a little later once the component updates

    this.interval = setInterval(
      () => this.props.updateTime(this.player.currentTime()),
      TIME_GRANULARITY
    );
  }

  componentDidUpdate(prevProps) {
    switch (this.props.state) {
      case "play":
        this.player.playbackRate(1.0);
        this.player.play();
        break;
      case "pause":
        this.player.pause();
        break;
      case "ffw":
        this.player.playbackRate(2.0);
        this.player.play();
        break;
      default:
        this.player.pause(); // maybe??
    }

    // sometimes the duration is only computed once the video has started. known issue
    if (this.player.duration() && this.player.duration() !== this.duration) {
      this.duration = this.player.duration();
      this.props.updateDuration(this.player.duration());
    }

    // this is to handle the user changing the video time, e.g. skip-forward or skip-backward
    this.player.currentTime(this.props.time);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }

    clearInterval(this.interval);
  }

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div data-vjs-player>
          <video
            ref={(node) => (this.videoNode = node)}
            className="video-js"
          ></video>
        </div>
      </div>
    );
  }
}

// this is kinda just a wrapper for the videojs Video component. most props are passed straight through.
export const VideoPlayer = (props) => {
  const videoJsOptions = {
    controls: false, // @TODO video should be controlled from elsewhere
    sources: [
      {
        src: props.videoSrc,
        type: "video/mp4",
      },
    ],
  };

  const videoRef = useRef();
  const previousUrl = useRef(props.videoSrc);

  useEffect(() => {
    if (previousUrl.current !== props.videoSrc && videoRef.current) {
      videoRef.current.load();
      previousUrl.current = props.videoSrc;
    }
  }, [props.videoSrc]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {/* {props.videoSrc ? <Video
        state={props.videoState}
        updateTime={(time) => props.updateTime(time)}
        options={videoJsOptions}
        updateDuration={(duration) => props.updateDuration(duration)}
        time={props.videoTime}
      /> : <div>Upload a video to get started...</div>} */}
      <video width="100%" height="100%" controls autoPlay ref={videoRef}>
        <source src={props.videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};
