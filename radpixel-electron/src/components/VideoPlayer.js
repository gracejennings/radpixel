import React, { useCallback, useEffect, useRef, useState } from "react";
import "./VideoPlayer.css";

const TIME_GRANULARITY = 10; // number of milliseconds between updates

// this is kinda just a wrapper for the videojs Video component. most props are passed straight through.
export const VideoPlayer = (props) => {
  const [duration, setDuration] = useState(0);
  const [intervalId, setIntervalId] = useState();

  const previousUrl = useRef(props.videoSrc);
  const videoRef = useRef();

  useEffect(() => {
    // reload video if source changed
    if (previousUrl.current !== props.videoSrc && videoRef.current) {
      videoRef.current.load();
      previousUrl.current = props.videoSrc;

      console.log('setInterval call');
      const interval = setInterval(() => {
        props.updateTime(videoRef.current.currentTime);
      }, TIME_GRANULARITY);
      setIntervalId(interval);
    }

    // didUnmount
    return function cleanup() {
      console.log('clearing interval');
      clearInterval(intervalId);
    };

  }, [props.videoSrc]);

  useEffect(() => {
    if (videoRef.current) {
      // external control handling
      switch (props.videoState) {
        case "play":
          videoRef.current.playbackRate = 1.0;
          videoRef.current.play();
          break;
        case "pause":
          videoRef.current.pause();
          break;
        case "ffw":
          videoRef.current.playbackRate = 2.0;
          videoRef.current.play();
          break;
        case "end":
          videoRef.current.pause();
          videoRef.current.currentTime = duration;
          break;
        case "beg":
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        default:
          videoRef.current.pause(); // maybe ??
      }
    }
  }, [props.videoState])

  const onDurationReady = (e) => {
    setDuration(e.target.duration);
    props.updateDuration(e.target.duration);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {props.videoSrc ? (
        <video
          width="100%"
          height="100%"
          ref={videoRef}
          style={{ objectFit: "fill" }}
          onLoadedMetadata={(e) => onDurationReady(e)}
        >
          <source src={props.videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div>Upload a video to get started...</div>
      )}
    </div>
  );
};
