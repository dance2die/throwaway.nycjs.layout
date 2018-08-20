/**
 * ToDos
 * 1. ✅ Create group name checkbox list from `data` props
 * 2. ✅ Set Calendar selected days from `data` props
 * 3. ✅ Update Map markers according to
 *    3.1 ✅ Currently selected calendar day
 *    3.2 ✅ Currently checked group names
 * 4. 🚫 Implemente data filters (in AppModel)
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
`;
const Body = styled.div`
  display: flex;
  flex: 1;
`;
const FilterContainer = styled.aside`
  flex: 3;
  background-color: coral;
`;
const MapContainer = styled.section`
  flex: 5;
  background-color: orangered;
`;
const Footer = styled.footer`
  background: gold;
  color: white;
`;

const CalendarContainer = styled.div`
  border-bottom: 1px solid rgb(100, 100, 100, 0.1);
  margin-bottom: 0.5em;
`;
const ListContainer = styled.div``;

const Meetup = styled.li``;

const meetups = { ReactNYC: "React NYC", vueJsNYC: "Vue NYC" };

class App extends Component {
  // // Set the date selected on the calendar
  // onDayClick = e => {
  //   actions.app.setDate(e);
  // };

  // Initialize Meetup records globally
  componentWillMount() {
    actions.app.addData(data);
    actions.app.filterData();
    actions.app.addGroups(meetups);
    actions.app.setSelectedDate(new Date());
  }

  componentDidCatch(err, info) {
    console.log(`err, info`, err, info);
  }

  render() {
    return (
      <AppContainer>
        <Header>NYC JavaScript Meetups</Header>
        <Body>
          <FilterContainer>
            <CalendarContainer>
              <Calendar />
            </CalendarContainer>
            <ListContainer>
              <Meetups />
            </ListContainer>
          </FilterContainer>
          <MapContainer>
            <Map />
          </MapContainer>
        </Body>
        <Footer>
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
