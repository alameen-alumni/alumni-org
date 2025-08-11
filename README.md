# Alumni Organization Web App

Welcome to the official web app for the Alumni Association Midnapur! This site helps alumni connect, share stories, and support each other. It's designed to be easy to use, beautiful on any device, and accessible to everyone.

## Main Features

- **Alumni Carousel:** See a slider of alumni photos at the top of the Alumni page, with images from the Random User API.
- **Featured Alumni:** Meet 12 highlighted alumni from different fields and locations, each with a photo, profession, and category.
- **Alumni Cards:** All alumni cards use real photos and are easy to view on any screen size.
- **Footer with Social Links:** Social media icons use their brand colors and look great on any background. The footer also credits the designers and developers.
- **Donate Page:** Donate easily with a clean, indigo-themed form. No red colors—everything matches the site's style.
- **Login Page:** Modern login with an indigo color scheme, a background image, and a layout that works perfectly on mobile.
- **Mobile Friendly:** Every page and section (Navbar, Footer, Donate, Content, Services, Details, Alumni, Gallery) is full width on mobile. No side scrollbars or extra space.
- **Hero Section:** On mobile, the hero image is at the top with rounded corners and a shadow. The text is below in a dark color for easy reading.
- **Gallery:** Browse event photos by category. Click any image to see it larger.
- **Notice Board:** See important announcements, each with a colored badge for priority.
- **Services:** Explore all the ways the association supports alumni, from scholarships to networking and events.
- **Content & Resources:** Find educational materials, alumni stories, achievements, and more.
- **About Page:** Learn about the association's history, mission, vision, and values.
- **Events & News:** Stay up to date with the latest happenings and upcoming events.
- **404 Page:** Friendly message if you visit a page that doesn't exist.
- **Accessible:** The site is designed for everyone, including those using screen readers.

## Technology Stack

- **React** for building the user interface
- **TypeScript** for safer, more reliable code
- **Tailwind CSS** for fast, responsive styling
- **Radix UI** for accessible components
- **Framer Motion** for smooth animations
- **Embla Carousel** for image sliders
- **Lucide Icons** for crisp, modern icons

## How to Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alumni-org
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   VITE_CLOUDINARY_CLOUD_NAME=
   VITE_CLOUDINARY_UPLOAD_PRESET=
   ```

4. **Firebase Setup**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Add your Firebase configuration to the environment variables

5. **Cloudinary Setup (Optional)**

   - Create a Cloudinary account at [Cloudinary](https://cloudinary.com/)
   - Add your cloud name to the environment variables for image upload functionality

6. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Additional Setup Notes

- The app uses Firebase for authentication and database
- Image uploads are handled by Cloudinary
- Make sure to configure Firebase security rules appropriately
- For deployment, you can use Vercel, Netlify, or any other hosting platform

---

**Design and developed by [Core Team AAM](https://www.alumniassociationmidnapore.org/core-team#developer)**

Enjoy exploring and connecting with your alumni community!
