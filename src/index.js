import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import styled, { injectGlobal } from "styled-components";
import mirror, { actions, connect, render } from "mirrorx";

import "./models/AppModel";
import Calendar from "./components/Calendar";
import Meetups from "./components/Meetups";

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

const meetups = { reactnyc: "React NYC", vueJsNYC: "Vue NYC" };

class App extends Component {
  // Set the date selected on the calendar
  onDayClick = e => {
    actions.app.setDate(e);
  };

  // Initialize Meetup records globally
  componentWillMount() {
    actions.app.addData(data);
    actions.app.addSelectedGroups(
      Object.keys(meetups).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
    actions.app.setDate(new Date());
  }

  componentDidCatch(err, info) {
    console.log(`err, info`, err, info);
  }

  getSelectedDays = () => {
    const selectedDays = [
      new Date(2018, 7, 2),
      new Date(2018, 7, 3),
      new Date(2018, 7, 21),
      new Date(2018, 7, 12),
      new Date(2018, 7, 19)
    ];
    return selectedDays;
  };

  render() {
    // console.log(`this.props`, this.props);

    return (
      <AppContainer>
        <Header>NYC JavaScript Meetups</Header>
        <Body>
          <FilterContainer>
            <CalendarContainer>
              <Calendar
                selectedDays={this.getSelectedDays()}
                onDayClick={this.onDayClick}
              />
            </CalendarContainer>
            <ListContainer>
              <Meetups meetups={meetups} />
            </ListContainer>
          </FilterContainer>
          <MapContainer>Content</MapContainer>
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
