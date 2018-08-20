import React, { Component, Fragment } from "react";
import ReactMapGL, { Marker, NavigationControl, Popup } from "react-map-gl";
import debounce from "tiny-debounce";
import { actions, connect } from "mirrorx";
import "../models/AppModel";

import ReactDOM from "react-dom";
import CityPin from "./CityPin";
import PopupInfo from "./PopupInfo";

// Copied from https://codesandbox.io/s/m4xq07441x

const defaultLocation = {
  latitude: 40.775306,
  longitude: -73.95117
};

class Markers extends Component {
  buildMarkers = data =>
    Object.keys(data).map(groupName => {
      const group = data[groupName];

      return group.events.map(event => (
        <Marker
          key={event.id}
          latitude={event.venue.lat}
          longitude={event.venue.lon}
        >
          <CityPin
            size={20}
            onClick={() => this.props.onClick({ popupInfo: { group, event } })}
          />
        </Marker>
      ));
    });

  render() {
    const { data } = this.props;
    if (!data) return <div>Loading Markers...</div>;
    return <Fragment>{this.buildMarkers(data)}</Fragment>;
  }
}

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pitch: 50.0,
        latitude: 40.750355,
        longitude: -73.986755,
        zoom: 11.5
      },
      popupInfo: null
    };
  }

  setViewportSizeState = () => {
    const viewport = { ...this.state.viewport };
    if (this.parentNode) {
      const { width, height } = this.parentNode.getBoundingClientRect();
      viewport.width = width;
      viewport.height = height;
      this.setState({ viewport });
    }
  };

  windowResizeHandler = e => this.setViewportSizeState();

  debouncedWindowResizeHandler = debounce(this.windowResizeHandler, 300);

  componentDidMount() {
    // https://github.com/okonet/react-container-dimensions/blob/master/src/index.js
    // because https://github.com/uber/react-map-gl/issues/135
    // you cannot enter % or vh/vw for uber's react-map-gl viewport.width/height
    this.parentNode = ReactDOM.findDOMNode(this).parentNode;
    this.setViewportSizeState();
    window.addEventListener("resize", this.debouncedWindowResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedWindowResizeHandler);
  }

  updateViewport = viewport => this.setState({ viewport: { ...viewport } });

  // https://github.com/uber/react-map-gl/blob/master/examples/controls/src/app.js
  _renderPopup() {
    const { popupInfo } = this.state;
    if (!popupInfo) return;

    const { group, event } = popupInfo;

    return (
      <Popup
        tipSize={5}
        anchor="top"
        longitude={event.venue.lon}
        latitude={event.venue.lat}
        onClose={() => this.setState({ popupInfo: null })}
      >
        <PopupInfo group={group.group} event={event} />
      </Popup>
    );
  }

  componentDidCatch(error, info) {
    console.log(`error, info`, error, info);
  }

  onMarkersClick = ({ popupInfo }) => this.setState({ popupInfo });

  render() {
    const { viewport } = this.state;
    const { data } = this.props;

    return (
      <div>
        <ReactMapGL
          style={{ textAlign: "left" }}
          mapboxApiAccessToken={
            "pk.eyJ1IjoiZGFuY2UyZGllIiwiYSI6ImNqa3Voa254bDk1bjEzcW1sOTFlbjl0eW8ifQ.d72JL668F0_uoLLK1lqhGQ"
          }
          {...viewport}
          onViewportChange={this.updateViewport}
        >
          <div style={{ position: "absolute", right: 0 }}>
            <NavigationControl
              onViewportChange={this.updateViewport}
              showCompass={false}
            />
          </div>
          <Markers data={data} onClick={this.onMarkersClick} />

          {this._renderPopup()}
        </ReactMapGL>
      </div>
    );
  }
}

const mapStateToProps = state => ({ data: state.app.data });
export default connect(mapStateToProps)(Map);
