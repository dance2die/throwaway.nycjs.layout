import React, { Component, Fragment } from "react";
import DayPicker from "react-day-picker";
import { connect, actions } from "mirrorx";

import "react-day-picker/lib/style.css";

// http://react-day-picker.js.org/docs/matching-days/
// https://codesandbox.io/s/r5w1kv3k6o
class Calendar extends Component {
  isSameDate = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.toDateString() === d2.toDateString();
  };

  highlighted = day =>
    this.props.selectedDays.some(selectedDay =>
      this.isSameDate(day, selectedDay)
    );

  onDayClick = clickedDate => {
    const { selectedDate } = this.props;
    actions.app.filterData();
    this.isSameDate(selectedDate, clickedDate)
      ? actions.app.clearSelectedDate()
      : actions.app.setSelectedDate(clickedDate);
  };

  // https://stackoverflow.com/a/47388600/4035
  render() {
    const { selectedDate } = this.props;
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
  selectedDays: extractDates(state.app.filteredData),
  selectedDate: state.app.selectedDate
});
export default connect(mapStateToProps)(Calendar);
