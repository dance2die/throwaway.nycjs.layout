import React, { Component, Fragment } from "react";
import ReactMapGL, { Marker, NavigationControl, Popup } from "react-map-gl";
import debounce from "tiny-debounce";
import { actions, connect } from "mirrorx";
import "../models/AppModel";

import ReactDOM from "react-dom";
import CityPin from "./CityPin";
import PopupInfo from "./PopupInfo";

// Copied from https://codesandbox.io/s/m4xq07441x

const defaultSettings = {
  latitude: 40.74526200643681,
  longitude: -73.96736208883843,
  zoom: 12,
  pitch: 50.0
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
        width: 0,
        height: 0,
        pitch: defaultSettings.pitch,
        latitude: defaultSettings.latitude,
        longitude: defaultSettings.longitude,
        zoom: defaultSettings.zoom
      },
      initialFilterHeight: null,
      isLoaded: false,
      popupInfo: null
    };
  }

  setViewportSizeState = () => {
    // because https://github.com/uber/react-map-gl/issues/135
    // you cannot enter % or vh/vw for uber's react-map-gl viewport.width/height
    const viewport = { ...this.state.viewport };
    const { headerContainer, filterContainer } = this.props;

    const { width: headerWidth, height: headerHeight } = document
      .querySelector("header")
      .getBoundingClientRect();
    // const {
    //   width: filterWidth,
    //   height: filterHeight
    // } = filterContainer.current.getBoundingClientRect();
    const { width: filterWidth, height: filterHeight } = document
      .querySelector("aside")
      .getBoundingClientRect();
    // if (!document.querySelector(".DayPicker-Months")) return;
    // const { width: filterWidth, height: filterHeight } = document
    //   .querySelector(".DayPicker-Months")
    //   .getBoundingClientRect();

    const { width: footerWidth, height: footerHeight } = document
      .querySelector("footer")
      .getBoundingClientRect();

    const offsetWidth = filterWidth;
    const width = Math.floor(window.innerWidth - filterWidth);
    let height = filterHeight - headerHeight - footerHeight;

    const { initialFilterHeight } = this.state;

    if (initialFilterHeight === null) {
      this.setState({ initialFilterHeight: height });
    } else {
      height = Math.floor(window.innerHeight - headerHeight - footerHeight);
    }
    // height = Math.floor(window.innerHeight - headerHeight - footerHeight);

    const isMobile = width <= filterWidth;

    viewport.width = Math.floor(isMobile ? filterWidth : width);
    viewport.height = Math.floor(isMobile ? window.innerHeight * 0.65 : height);

    // viewport.height =
    //   viewport.height < filterHeight ? filterHeight : viewport.height;

    // // prettier-ignore
    // console.log(
    //   `filterWidth,window.innerWidth,viewport.width`,
    //   filterWidth, window.innerWidth, viewport.width);
    // // prettier-ignore
    // console.log(
    //   `filterHeight,window.innerHeight,viewport.height`,
    //   filterHeight,window.innerHeight,viewport.height);

    this.setState({ viewport });
  };

  windowResizeHandler = e => this.setViewportSizeState();

  debouncedWindowResizeHandler = debounce(this.windowResizeHandler, 300);

  componentDidMount() {
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

const mapStateToProps = state => ({ data: state.app.filteredData });
export default connect(mapStateToProps)(Map);
