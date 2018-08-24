import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { connect, actions } from "mirrorx";

import "../models/AppModel";

const MeetupList = styled.ul`
  list-style: none;
`;

const onGroupChecked = e => {
  e.persist();
  actions.app.onGroupChecked(e);
  actions.app.filterData();
};

const Meetup = ({ name, value, selectedGroups, count }) => {
  // console.log(`Meetup`, name, value, selectedGroups, count);
  return (
    <li>
      <label>
        <input
          name={name}
          type="checkbox"
          onChange={onGroupChecked}
          checked={selectedGroups[name]}
        />
        {value} ({count})
      </label>
    </li>
  );
};

const getEventCountMap = data =>
  data &&
  Object.keys(data).length > 0 &&
  Object.entries(data).reduce((acc, [name, { events }]) => {
    acc[name] = events.length;
    return acc;
  });

const mapStateToProps = state => ({
  selectedGroups: state.app.selectedGroups,
  groups: state.app.groups,
  eventCountMap: getEventCountMap(state.app.data)
});
const ConnectedMeetup = connect(mapStateToProps)(Meetup);

const Meetups = ({ selectedGroups, groups, eventCountMap }) => {
  if (!eventCountMap) return null;

  return (
    <MeetupList>
      {Object.keys(selectedGroups).map(key => (
        <ConnectedMeetup
          key={key}
          name={key}
          value={groups[key]}
          count={eventCountMap[key] || 0}
        />
      ))}
    </MeetupList>
  );
};

export default connect(mapStateToProps)(Meetups);
