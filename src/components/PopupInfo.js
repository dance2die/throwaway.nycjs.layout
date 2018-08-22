import React from "react";
import styled, { css } from "styled-components";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const smallFont = css`
  font-size: 0.85rem;
`;

const lessImportant = css`
  ${smallFont} color: rgba(46, 62, 72, 0.6);
`;

const padding = css`
  padding: 0.5em;
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: rgb(46, 62, 72);
`;

const Header = styled.div`
  ${padding} display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HeaderTitle = styled.div`
  display: flex;
`;

const EventLink = styled.a.attrs({
  href: props => props.href,
  target: "_new"
})`
  & {
    color: black;
    font-weight: bold;
  }

  &:link {
    text-decoration: none;
  }

  &:visited {
    text-decoration: none;
  }

  &:hover {
    text-decoration: underline;
  }

  &:active {
    text-decoration: underline;
  }
`;

const HeaderBody = styled.div`
  display: flex;
`;

const EventStatus = styled.span`
  ${lessImportant} color: black;
  font-style: italic;
`;
const EventRsvp = styled.span`
  ${lessImportant} margin-left: 0.25em;
`;

const Content = styled.aside`
  display: flex;
  flex-direction: column;
`;

const ContentBody = styled.div`
  display: flex;
  flex-direction: row;
  ${padding};
`;

const ContentEmoji = styled.div`
  display: flex;
  align-items: flex-start;
  flex-basis: 2em;
`;

const ContentDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ContentDescriptionTitle = styled.div`
  font-size: 0.9rem;
`;
const ContentDescriptionBody = styled.div`
  ${lessImportant};
`;

const Photo = styled.img.attrs({
  src: props => props.src
})`
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.45em;
`;

const OrganizerPhoto = styled(Photo)`
  margin-left: 0;
`;

const Footer = styled.footer`
  ${padding} display: flex;
  align-items: center;
`;

const FooterTitle = styled.div`
  ${padding} ${smallFont}
  display: flex;
  align-items: center;
`;

const FooterBody = styled.div``;

const PopupInfo = ({ group, event }) => {
  const {
    name: eventName,
    status,
    venue,
    time,
    how_to_find_us,
    event_url,
    waitlist_count
  } = event;

  const {
    name: venueName,
    address_1,
    address_2,
    address_3,
    state,
    city
  } = venue;

  const { group_photo } = group;
  const { name: organizerName, photo } = group.organizer;

  const address = `${address_1} ${address_2 || ""} ${address_3 ||
    ""} · ${state}, ${city}`;

  const rsvpDifference = +event.rsvp_limit - +event.yes_rsvp_count;
  const rsvp =
    +waitlist_count > 0
      ? `${waitlist_count} on waitlist`
      : rsvpDifference
        ? `${rsvpDifference} spots left!`
        : "";

  const dateTime = new Date(time);
  const dayOfWeek = days[dateTime.getDay()];
  const date = dateTime.toLocaleDateString();
  const startTime = dateTime.toLocaleTimeString();

  return (
    <PopupContainer>
      <Header>
        <HeaderTitle>
          <Photo src={group_photo.thumb_link} />
          <EventLink href={event_url}>
            <span className="popup_event_name">{eventName}</span>
          </EventLink>
        </HeaderTitle>
        <HeaderBody>
          <EventStatus>{status}</EventStatus>
          <EventRsvp>{rsvp}</EventRsvp>
        </HeaderBody>
      </Header>
      <Content>
        <ContentBody>
          <ContentEmoji>⏳</ContentEmoji>
          <ContentDescription>
            <ContentDescriptionTitle>
              {`${dayOfWeek}, ${date}`}
            </ContentDescriptionTitle>
            <ContentDescriptionBody>
              {`Starts @ ${startTime}`}
            </ContentDescriptionBody>
          </ContentDescription>
        </ContentBody>
        <ContentBody>
          <ContentEmoji>📍</ContentEmoji>
          <ContentDescription>
            <ContentDescriptionTitle>{venueName}</ContentDescriptionTitle>
            <ContentDescriptionBody>{address}</ContentDescriptionBody>
          </ContentDescription>
        </ContentBody>
        <ContentBody>
          <ContentEmoji>🤔</ContentEmoji>
          <ContentDescription>
            <ContentDescriptionTitle>How to find us</ContentDescriptionTitle>
            <ContentDescriptionBody>{how_to_find_us}</ContentDescriptionBody>
          </ContentDescription>
        </ContentBody>
      </Content>
      <Footer>
        <FooterTitle>Organized By {organizerName}</FooterTitle>
        <FooterBody>
          <OrganizerPhoto src={photo.thumb_link} />
        </FooterBody>
      </Footer>
    </PopupContainer>
  );
};

export default PopupInfo;
