import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { type GalleryTableProps, type GalleryItem } from '../../types';

const GalleryTable = ({ gallery, loading, onEdit, onDelete }: GalleryTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading gallery images...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SL No</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gallery.map(item => (
          <TableRow key={item.id}>
            <TableCell>
              {(() => {
                const slNo = typeof item.sl_no === 'string' ? parseInt(item.sl_no) : item.sl_no;
                return slNo && slNo > 0 ? slNo : 'N/A';
              })()}
            </TableCell>
            <TableCell>
              {item.image && (
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
              )}
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.category || 'N/A'}</TableCell>
            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
            <TableCell>{item.date || 'N/A'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GalleryTable; 