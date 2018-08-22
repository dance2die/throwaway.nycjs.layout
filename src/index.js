/**
 * ToDos
 * 1. ✅ Create group name checkbox list from `data` props
 * 2. ✅ Set Calendar selected days from `data` props
 * 3. ✅ Update Map markers according to
 *    3.1 ✅ Currently selected calendar day
 *    3.2 ✅ Currently checked group names
 * 4. ✅ Implemente data filters (in AppModel)
 * 5. 🚫 Fix Layout - Height's overflowing thus showing scrollbars
 */

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import styled, { injectGlobal } from "styled-components";
import mirror, { actions, connect, render } from "mirrorx";

import "./models/AppModel";
import Calendar from "./components/Calendar";
import Meetups from "./components/Meetups";
import Map from "./components/Map";

import data from "./input.json";

import "./styles.css";

injectGlobal`
  *, *:before, *:after
  {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background: gold;
  color: white;
  display: flex;
  height: 5em;
`;
const Body = styled.div`
  display: flex;
  flex: 1;
`;
const FilterContainer = styled.aside`
  flex: 1;
  background-color: coral;
`;
const MapContainer = styled.section`
  flex: 5;
  background-color: orangered;
  align-content: stretch;
`;

const StyledMap = styled(Map)`
  height: 100vh
`;

const Footer = styled.footer`
  background: gold;
  color: white;
  height: 3em;
`;

const CalendarContainer = styled.div`
  border-bottom: 1px solid rgb(100, 100, 100, 0.1);
  margin-bottom: 0.5em;
`;
const ListContainer = styled.div``;

const Meetup = styled.li``;

const meetups = { ReactNYC: "React NYC", vueJsNYC: "Vue NYC" };

class App extends Component {
  // Initialize Meetup records globally
  componentWillMount() {
    actions.app.addData(data);
    actions.app.filterData();
    actions.app.addGroups(meetups);
  }

  componentDidCatch(err, info) {
    console.log(`err, info`, err, info);
  }

  headerContaier = React.createRef();
  filterContainer = React.createRef();
  footerContainer = React.createRef();

  render() {
    return (
      <AppContainer>
        <Header innerRef={this.headerContaier}>NYC JavaScript Meetups</Header>
        <Body>
          <FilterContainer innerRef={this.filterContainer}>
            <CalendarContainer>
              <Calendar />
            </CalendarContainer>
            <ListContainer>
              <Meetups />
            </ListContainer>
          </FilterContainer>
          <MapContainer>
            <StyledMap
              // Needed to calculate Pixel dimension as Uber's MapBox requires a pixel width & height...
              headerContainer={this.headerContaier}
              filterContainer={this.filterContainer}
            />
          </MapContainer>
        </Body>
        <Footer innerRef={this.footerContainer}>
          Created By
          <a href="https://sungkim.co" target="_blank">
            Sung Kim
          </a>
        </Footer>
      </AppContainer>
    );
  }
}

const mapStateToProps = state => ({ ...state.app });
const ConnectedApp = connect(mapStateToProps)(App);

render(<ConnectedApp />, document.getElementById("root"));
