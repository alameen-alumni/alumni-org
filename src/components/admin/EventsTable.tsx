import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type EventsTableProps, type Event } from '../../types';

const EventsTable = ({ events, loading, onEdit, onDelete }: EventsTableProps) => {
  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map(event => (
          <TableRow key={event.id}>
            <TableCell>
              {Array.isArray(event.image) ? (
                event.image[0] && <img src={event.image[0]} alt={event.title} className="w-16 h-16 object-cover rounded" />
              ) : (
                event.image && <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded" />
              )}
            </TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell className="max-w-xs truncate">{event.description}</TableCell>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.time}</TableCell>
            <TableCell>{event.venue}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" onClick={() => onEdit(event)} className="mr-2">Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(event.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventsTable; 