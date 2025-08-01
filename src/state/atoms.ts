
import { atom } from 'recoil';
import { GalleryItem } from '../types/gallery';

export const userState = atom({
  key: 'userState',
  default: {
    isAuthenticated: false,
    user: null,
  },
});

export const announcementsState = atom({
  key: 'announcementsState',
  default: [],
});

export const alumniListState = atom({
  key: 'alumniListState',
  default: [],
});

export const mobileMenuState = atom({
  key: 'mobileMenuState',
  default: false,
});

export const galleryState = atom({
  key: 'galleryState',
  default: {
    items: [] as GalleryItem[],
    loading: true,
    error: null as string | null,
    lastFetched: null as number | null,
  },
});
