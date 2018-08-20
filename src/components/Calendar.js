import React, { Component, Fragment } from "react";
import DayPicker from "react-day-picker";
import { connect, actions } from "mirrorx";

import { isSameDate } from "../utils/date";

import "react-day-picker/lib/style.css";

// http://react-day-picker.js.org/docs/matching-days/
// https://codesandbox.io/s/r5w1kv3k6o
class Calendar extends Component {
  highlighted = day =>
    this.props.eventDays.some(selectedDay => isSameDate(day, selectedDay));

  onDayClick = clickedDate => {
    const { selectedDate } = this.props;
    // ? actions.app.clearSelectedDate()
    isSameDate(selectedDate, clickedDate)
      ? actions.app.setSelectedDate(null)
      : actions.app.setSelectedDate(clickedDate);
    actions.app.filterData();
  };

  // https://stackoverflow.com/a/47388600/4035
  render() {
    const { selectedDate } = this.props;

    console.log(`calendar.selectedDate`, selectedDate);

    return (
      <DayPicker
        modifiers={{ highlighted: this.highlighted, selectedDate }}
        onDayClick={this.onDayClick}
      />
    );
  }
}

const extractDates = data =>
  Object.keys(data).reduce((acc, groupName) => {
    acc.push(...data[groupName].events.map(event => new Date(event.time)));
    return acc;
  }, []);

const mapStateToProps = state => ({
  eventDays: extractDates(state.app.data),
  selectedDays: extractDates(state.app.filteredData),
  selectedDate: state.app.selectedDate
});
export default connect(mapStateToProps)(Calendar);
