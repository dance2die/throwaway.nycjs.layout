import React, { Component, Fragment } from "react";
import DayPicker from "react-day-picker";
import { connect, actions } from "mirrorx";

import "react-day-picker/lib/style.css";

// http://react-day-picker.js.org/docs/matching-days/
// https://codesandbox.io/s/r5w1kv3k6o
class Calendar extends Component {
  highlighted = day => {
    // Clear time to compare by date
    day.setHours(0, 0, 0);

    return this.props.selectedDays.some(selectedDay => {
      // Clear time to compare by date
      selectedDay.setHours(0, 0, 0);
      return selectedDay.getTime() === day.getTime();
    });
  };

  // https://stackoverflow.com/a/47388600/4035
  render() {
    const { selectedDay } = this.props;

    return (
      <DayPicker
        modifiers={{ highlighted: this.highlighted, selectedDay }}
        onDayClick={e => actions.app.setSelectedDate(e)}
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
  selectedDays: extractDates(state.app.data)
});
export default connect(mapStateToProps)(Calendar);
