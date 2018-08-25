/**
 * ToDos
 * 1. ✅ Create group name checkbox list from `data` props
 * 2. ✅ Set Calendar selected days from `data` props
 * 3. ✅ Update Map markers according to
 *    3.1 ✅ Currently selected calendar day
 *    3.2 ✅ Currently checked group names
 * 4. ✅ Implemente data filters (in AppModel)
 * 5. ✅ Fix Layout - Height's overflowing thus showing scrollbars
 * 6. ✅ Add a number of events next to Group list checkbox.
 * 7. 🚫 Replace marker SVG with Meetup avatar.
 *      👆 causes an infinite loop... 🤔 abort for now.
 * 999. 🚫 Make it pretty~~~
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
    font-family: 'Roboto', sans-serif;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  // https://uigradients.com/#CoolBlues
  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #6dd5ed,
    #2193b0
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #6dd5ed,
    #2193b0
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: white;
  height: 4em;

  display: flex;
  align-items: center;
  padding-left: 2em;
`;
const Body = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
const FilterContainer = styled.aside`
  flex: 1;
  background-color: white;

  @media (max-width: 600px) {
    order: 2;
  }
`;
const MapContainer = styled.section`
  flex: 5;
  background-color: orangered;
  align-content: stretch;

  @media (max-width: 600px) {
    order: 1;
  }
`;

const StyledMap = styled(Map)`
  height: 100vh;
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

// const meetups = { ReactNYC: "React NYC", vueJsNYC: "Vue NYC" };

class App extends Component {
  // Initialize Meetup records globally
  async componentWillMount() {
    // actions.app.addData(data);
    // actions.app.addGroups(meetups);
    // actions.app.filterData();
    await actions.app.addMeetups();
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
