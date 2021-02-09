import React from 'react';
import videojs from 'video.js';
import './VideoPlayer.css';

// this code ripped straight from videojs docs: https://docs.videojs.com/tutorial-react.html
class Video extends React.Component {
    componentDidMount() {
      this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
        console.log('Video.js Ready', this)
      });
    }
    componentWillUnmount() {
      if (this.player) {
        this.player.dispose()
      }
    }
    render() {
      return (
          <div data-vjs-player>
            <video ref={ node => this.videoNode = node } className="video-js"></video>
          </div>
      )
    }
}

export const VideoPlayer = (props) => {
    const videoJsOptions = {
        autoplay: true,
        controls: false,
        height: '400px',
        sources: [{
          src: '/path/to/video.mp4',
          type: 'video/mp4'
        }]
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <Video { ...videoJsOptions} />
        </div>
    )
};