import React from 'react';
import videojs from 'video.js';
import './VideoPlayer.css';

// this code ripped straight from videojs docs: https://docs.videojs.com/tutorial-react.html
class Video extends React.Component {
    componentDidMount() {
      this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
        console.log('Video.js Ready', this)
      });
      this.player.fill(true);
    }
    componentWillUnmount() {
      if (this.player) {
        this.player.dispose()
      }
    }
    render() {
      return (
          <div style={{height: '100%', width: '100%'}}>
            <div data-vjs-player>
                <video ref={ node => this.videoNode = node } className="video-js"></video>
            </div>
          </div>
      )
    }
}

export const VideoPlayer = (props) => {
    const videoJsOptions = {
        controls: true, // @TODO video should be controlled from elsewhere
        sources: [{
          src: 'alpha_manyevents.mp4',
          type: 'video/mp4'
        }]
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <Video { ...videoJsOptions} />
            {/* <video src='alpha_manyevents.mp4' type="video/mp4" style={{height: '100%', width: '100%'}} /> */}
        </div>
    )
};