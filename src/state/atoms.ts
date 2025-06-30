
import { atom } from 'recoil';

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
