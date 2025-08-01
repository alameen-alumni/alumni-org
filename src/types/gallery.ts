export interface GalleryItem {
  id?: string;
  category: string;
  date: string;
  description: string;
  sl_no: number;
  image: string;
  title: string;
}

export interface GalleryFormData {
  category: string;
  date: string;
  description: string;
  sl_no: number | '';
  image: string;
  title: string;
}

export const emptyGalleryItem: GalleryFormData = {
  category: '',
  date: '',
  description: '',
  sl_no: '',
  image: '',
  title: '',
}; 