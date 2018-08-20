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
};

const Meetup = ({ name, value, selectedGroups }) => (
  <li>
    <label>
      <input
        name={name}
        type="checkbox"
        onChange={onGroupChecked}
        checked={selectedGroups[name]}
      />
      {value}
    </label>
  </li>
);

const mapStateToProps = state => ({
  selectedGroups: state.app.selectedGroups,
  groups: state.app.groups
});
const ConnectedMeetup = connect(mapStateToProps)(Meetup);

const Meetups = ({ selectedGroups, groups }) => (
  <MeetupList>
    {Object.keys(selectedGroups).map(key => (
      <ConnectedMeetup key={key} name={key} value={groups[key]} />
    ))}
  </MeetupList>
);

export default connect(mapStateToProps)(Meetups);
