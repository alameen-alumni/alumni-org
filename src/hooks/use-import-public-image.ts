import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { type GalleryFormData } from '../types';

export function useImportPublicImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate that a public path exists by fetching it. Returns true if exists.
  async function validatePublicPath(publicPath: string) {
    try {
      const resp = await fetch(publicPath, { method: 'HEAD' });
      return resp.ok;
    } catch (err) {
      return false;
    }
  }

  // Save a gallery entry to Firestore with image set to publicPath
  async function importToFirestore(publicPath: string, overrides?: Partial<GalleryFormData>) {
    setLoading(true);
    setError(null);
    try {
      const galleryData: GalleryFormData = {
        title: overrides?.title ?? publicPath.split('/').pop() ?? 'Imported Image',
        description: overrides?.description ?? '',
        date: overrides?.date ?? '',
        category: overrides?.category ?? '',
        sl_no: overrides?.sl_no ?? '',
        image: publicPath,
      };

      const docRef = await addDoc(collection(db, 'gallery'), galleryData);
      setLoading(false);
      return { id: docRef.id, data: galleryData };
    } catch (err) {
      // err might not be Error, so coerce
      let message = 'Failed to import';
      if (err && typeof err === 'object' && 'message' in err) {
  message = (err as { message?: string }).message ?? message;
      } else if (err) {
        message = String(err);
      }
      setError(message ?? 'Failed to import');
      setLoading(false);
      throw err;
    }
  }

  return { loading, error, validatePublicPath, importToFirestore };
}
