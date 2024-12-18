import { h } from 'preact';

interface Event {
  id: string;
  event_title: string;
  description: string;
  time_start: string;
  date_start: string;
}

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <ul>
      {events.map(event => (
        <li key={event.id}>
          {event.event_title} <br />
          {event.description} <br />
          {event.time_start} {event.date_start}
        </li>
      ))}
    </ul>
  )
}