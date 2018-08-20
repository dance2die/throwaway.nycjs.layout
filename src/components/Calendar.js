import React, { Component, Fragment } from "react";
import DayPicker from "react-day-picker";

import "react-day-picker/lib/style.css";

// http://react-day-picker.js.org/docs/matching-days/
// https://codesandbox.io/s/r5w1kv3k6o
class Calendar extends Component {
  state = {
    selectedDays: this.props.selectedDays
  };

  highlighted = day => {
    // Clear time to compare by date
    day.setHours(0, 0, 0);

    return this.state.selectedDays.some(
      selectedDay => selectedDay.getTime() === day.getTime()
    );
  };

  // https://stackoverflow.com/a/47388600/4035
  render() {
    const { selectedDay } = this.state;

    return (
      <DayPicker
        modifiers={{ highlighted: this.highlighted, selectedDay }}
        onDayClick={this.props.onDayClick}
      />
    );
  }
}

export default Calendar;
