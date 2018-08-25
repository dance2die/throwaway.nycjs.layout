import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { connect, actions } from "mirrorx";

import "../models/AppModel";

const onGroupChecked = e => {
  e.persist();
  actions.app.onGroupChecked(e);
  actions.app.filterData();
};

const GroupCheckBox = styled.input.attrs({
  name: props => props.name,
  type: "checkbox",
  onChange: props => props.onGroupChecked,
  checked: props => props.checked
})`
  margin: 0.3rem 0;
`;

const ListItem = styled.li`
  margin: 0.3em 1em;
`;

const Label = styled.label`
  // margin: 0 1em;
  display: flex;
  align-items: center;
`;

const LabelValue = styled.span`
  margin-left: 0.5em;
`;
const LabelCount = styled.span`
  margin-left: 0.2em;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
`;

const Meetup = ({ name, value, selectedGroups, count }) => {
  return (
    <ListItem>
      <Label>
        <GroupCheckBox
          name={name}
          onChange={onGroupChecked}
          checked={selectedGroups[name]}
        />
        <LabelValue>{value}</LabelValue>
        <LabelCount>({count})</LabelCount>
      </Label>
    </ListItem>
  );
};

const getEventCountMap = data =>
  data &&
  Object.keys(data).length > 0 &&
  Object.entries(data).reduce((acc, [name, { events }]) => {
    acc[[name]] = events.length;
    return acc;
  }, {});

const mapStateToProps = state => ({
  selectedGroups: state.app.selectedGroups,
  groups: state.app.groups,
  eventCountMap: getEventCountMap(state.app.data)
});
const ConnectedMeetup = connect(mapStateToProps)(Meetup);

const MeetupList = styled.ul`
  list-style: none;
  margin-top: 1em;
`;

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
