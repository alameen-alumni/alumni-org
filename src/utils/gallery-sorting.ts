import { GalleryItem } from '../types/gallery';

/**
 * Sorts gallery items with the following priority:
 * 1. Items with sl_no > 0 (sorted numerically)
 * 2. Items with sl_no = 0 or no sl_no (maintains original order)
 */
export const sortGalleryItems = (items: GalleryItem[]): GalleryItem[] => {
  return [...items].sort((a, b) => {
    // Convert sl_no to numbers for proper comparison
    const aSlNo = typeof a.sl_no === 'string' ? parseInt(a.sl_no) : a.sl_no;
    const bSlNo = typeof b.sl_no === 'string' ? parseInt(b.sl_no) : b.sl_no;
    
    // If both items have sl_no > 0, sort by sl_no
    if (aSlNo !== undefined && aSlNo > 0 && bSlNo !== undefined && bSlNo > 0) {
      return aSlNo - bSlNo;
    }
    // If only one has sl_no > 0, prioritize the one with sl_no > 0
    if (aSlNo !== undefined && aSlNo > 0 && (bSlNo === undefined || bSlNo === 0)) {
      return -1; // a comes first
    }
    if (bSlNo !== undefined && bSlNo > 0 && (aSlNo === undefined || aSlNo === 0)) {
      return 1; // b comes first
    }
    // If both have sl_no = 0 or no sl_no, maintain current order
    return 0;
  });
};

/**
 * Example usage and test cases
 */
export const testGallerySorting = () => {
  const testItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Event 1',
      description: 'Description 1',
      category: 'event',
      date: '2023-01-01',
      image: 'image1.jpg',
      sl_no: 3
    },
    {
      id: '2',
      title: 'Event 2',
      description: 'Description 2',
      category: 'event',
      date: '2023-01-02',
      image: 'image2.jpg',
      sl_no: 0
    },
    {
      id: '3',
      title: 'Event 3',
      description: 'Description 3',
      category: 'event',
      date: '2023-01-03',
      image: 'image3.jpg',
      sl_no: 1
    },
    {
      id: '4',
      title: 'Event 4',
      description: 'Description 4',
      category: 'event',
      date: '2023-01-04',
      image: 'image4.jpg',
      sl_no: undefined
    },
    {
      id: '5',
      title: 'Event 5',
      description: 'Description 5',
      category: 'event',
      date: '2023-01-05',
      image: 'image5.jpg',
      sl_no: 2
    }
  ];

  const sortedItems = sortGalleryItems(testItems);
  
  console.log('Original order:', testItems.map(item => ({ id: item.id, sl_no: item.sl_no })));
  console.log('Sorted order:', sortedItems.map(item => ({ id: item.id, sl_no: item.sl_no })));
  
  // Expected order: Event 3 (sl_no: 1), Event 5 (sl_no: 2), Event 1 (sl_no: 3), Event 2 (sl_no: 0), Event 4 (no sl_no)
  return sortedItems;
}; 