// Import React types
import { type ChangeEvent, type FormEvent, type MouseEvent, type DragEvent, type RefObject, type ComponentType } from 'react';

// Auth Types
export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  form: LoginFormData;
  loading: boolean;
  error: string | null;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword: (e: MouseEvent) => void;
}

// Context Types
export interface User {
  email?: string | null;
  admin?: boolean;
  mobile?: number | string;
  name?: string;
  passout_year?: number;
  reg_id?: number;
  role?: string;
  password?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName?: string,
    extra?: {
      admin?: boolean;
      mobile?: number | string;
      name?: string;
      passout_year?: number;
      reg_id?: number;
    }
  ) => Promise<void>;
  loginWithGoogle: (extra?: {
    admin?: boolean;
    mobile?: number | string;
    name?: string;
    passout_year?: number;
    reg_id?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ModalContextType {
  shown: boolean;
  setShown: (value: boolean) => void;
}

export interface GalleryContextType {
  galleryItems: GalleryItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refreshGallery: () => Promise<void>;
  loadMore: () => Promise<void>;
}

// Gallery Types
export interface GalleryProviderProps {
  children: React.ReactNode;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  sl_no: string | number;
}

export interface GalleryFormData {
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  sl_no: string;
}

// Admin Table Types
export interface GalleryTableProps {
  gallery: GalleryItem[];
  loading: boolean;
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

export interface GalleryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGallery: GalleryItem | null;
  form: GalleryFormData;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onImageUpload: (url: string, file?: File) => void;
  selectedImageFile: File | null;
  singleUploadLoading: boolean;
}

export interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: GalleryFormData;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onBulkImageUpload: (urls: string[], files?: File[]) => void;
  bulkUploadFiles: File[];
  bulkUploadLoading: boolean;
  bulkUploadProgress: number;
  getNextSlNo: () => number;
}

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading: boolean;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: string | string[];
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image1: string;
  image2: string;
  image3: string;
}

export interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editEvent: Event | null;
  form: EventFormData;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onImageUpload: (field: string, url: string, file?: File) => void;
}

// Alumni Types
export interface Alumni {
  id: string;
  name: string;
  designation: string;
  category: string;
  contact: string;
  location: string;
  passout_year: string;
  featured: boolean;
  image: string;
}

export interface AlumniFormData {
  name: string;
  designation: string;
  category: string;
  contact: string;
  location: string;
  passout_year: string;
  featured: boolean;
  image: string;
}

export interface AlumniTableProps {
  members: Alumni[];
  loading: boolean;
  onEdit: (alumni: Alumni) => void;
  onDelete: (id: string) => void;
}

export interface AlumniFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAlumni: Alumni | null;
  form: AlumniFormData;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onImageUpload: (url: string, file?: File) => void;
}

// Donation Types
export interface DonationFormData {
  name: string;
  email: string;
  amount: string;
  note: string;
}

export interface QuickAmount {
  label: string;
  value: string;
}

export interface DonationFormProps {
  donationForm: DonationFormData;
  selectedAmount: string;
  quickAmounts: QuickAmount[];
  onAmountSelect: (amount: string) => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export interface ImpactArea {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface ImpactAreasProps {
  impactAreas: ImpactArea[];
}

export interface PaymentMethod {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

export interface ContactSecurityInfoProps {
  // No props needed for this component as it's static content
}

// Upload Types
export interface ImageUploadProps {
  onImageUpload: (url: string, file?: File) => void;
  onMultipleImageUpload?: (urls: string[], files?: File[]) => void;
  currentImage?: string;
  className?: string;
  fieldName?: string;
  multiple?: boolean;
  onClearLocalStorage?: () => void;
}

export interface FileUploadAreaProps {
  dragActive: boolean;
  error: string | null;
  multiple: boolean;
  onDrag: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onChooseFiles: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export interface ImagePreviewProps {
  preview: string | null;
  selectedFile: File | null;
  uploading: boolean;
  onRemove: () => void;
}

export interface MultipleImagePreviewProps {
  selectedFiles: File[];
  previews: string[];
  uploading: boolean;
  onRemoveImage: (index: number) => void;
}

// Modal Types
export interface ModalProviderProps {
  children: React.ReactNode;
}

export interface DeleteInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteInfo: {
    uid: string;
    email: string;
  };
}

export interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: {
    title?: string;
    description?: string;
    date?: string;
    venue?: string;
    image?: string;
    link?: string;
    reg_url?: string;
    venue_url?: string;
  } | null;
}

export interface ExcelExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
  title?: string;
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  selectedFields: any;
  filename: string;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
} 