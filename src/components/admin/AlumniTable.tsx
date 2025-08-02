import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type AlumniTableProps, type Alumni } from '../../types';

const AlumniTable = ({ members, loading, onEdit, onDelete }: AlumniTableProps) => {
  if (loading) {
    return <p>Loading alumni...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Passout Year</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <TableRow key={member.id}>
            <TableCell>
              {member.image && (
                <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded" />
              )}
            </TableCell>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.designation}</TableCell>
            <TableCell>{member.category}</TableCell>
            <TableCell>{member.contact}</TableCell>
            <TableCell>{member.location}</TableCell>
            <TableCell>{member.passout_year}</TableCell>
            <TableCell>{member.featured ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(member)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(member.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlumniTable; 