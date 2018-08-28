import React, { Component } from "react";
import DayPicker from "react-day-picker";
import { connect, actions } from "mirrorx";

import { isSameDate } from "../utils/date";

import "react-day-picker/lib/style.css";

// http://react-day-picker.js.org/docs/matching-days/
// https://codesandbox.io/s/r5w1kv3k6o
class Calendar extends Component {
  highlighted = day =>
    this.props.eventDays &&
    this.props.eventDays.some(selectedDay => isSameDate(day, selectedDay));

  onDayClick = clickedDate => {
    const { selectedDate } = this.props;
    isSameDate(selectedDate, clickedDate)
      ? actions.app.setSelectedDate(null)
      : actions.app.setSelectedDate(clickedDate);
    actions.app.filterData();
  };

  // https://stackoverflow.com/a/47388600/4035
  render() {
    const { selectedDate, eventDays } = this.props;
    const { highlighted } = this;

    if (!eventDays) return null;

    return (
      <DayPicker
        modifiers={{ highlighted, selectedDate }}
        onDayClick={this.onDayClick}
      />
    );
  }
}

const extractDates = data =>
  data &&
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
