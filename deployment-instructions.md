# PCI Quality Organization Dashboard - Deployment Instructions

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Firebase Setup](#firebase-setup)
4. [Local Development Environment](#local-development-environment)
5. [Production Deployment](#production-deployment)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

## Introduction <a name="introduction"></a>

This document provides detailed instructions for deploying the PCI Quality Organization Dashboard to both development and production environments. The dashboard is built using Next.js and Firebase, making it relatively straightforward to deploy to various hosting platforms.

## System Requirements <a name="system-requirements"></a>

### Development Environment

- Node.js 16.x or higher
- npm 8.x or higher
- Git

### Production Environment

- Hosting platform that supports Next.js applications (Vercel, Netlify, or custom server)
- Firebase project with Firestore and Authentication enabled
- HTTPS-enabled domain

## Firebase Setup <a name="firebase-setup"></a>

### Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "pci-quality-dashboard")
4. Enable Google Analytics if desired
5. Click "Create project"

### Enabling Authentication

1. In your Firebase project, navigate to "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the "Email/Password" sign-in method
4. (Optional) Enable additional sign-in methods as needed

### Setting Up Firestore Database

1. In your Firebase project, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a database location closest to your users
5. Click "Enable"

### Creating Security Rules

1. In your Firebase project, navigate to "Firestore Database" in the left sidebar
2. Click the "Rules" tab
3. Replace the default rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all data
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow admin users to write to all collections
    match /{collection}/{document=**} {
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Allow all users to read user profiles
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Allow users to read and write their own user document
    match /users/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own preferences
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click "Publish"

### Generating Firebase Configuration

1. In your Firebase project, click the gear icon next to "Project Overview" and select "Project settings"
2. Scroll down to the "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register the app with a nickname (e.g., "PCI Quality Dashboard")
5. Click "Register app"
6. Copy the Firebase configuration object (it will look like this):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

7. Save this configuration for later use

## Local Development Environment <a name="local-development-environment"></a>

### Cloning the Repository

1. Open a terminal
2. Run the following command:
   ```
   git clone https://github.com/your-organization/pci-dashboard.git
   cd pci-dashboard
   ```

### Installing Dependencies

1. In the project directory, run:
   ```
   npm install
   ```

### Configuring Firebase

1. Create a file named `.env.local` in the project root directory
2. Add the following environment variables with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
   ```

### Running the Development Server

1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000`

## Production Deployment <a name="production-deployment"></a>

The PCI Quality Organization Dashboard can be deployed to various hosting platforms. Here are instructions for the most common options:

### Deploying to Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. In the project directory, run:
   ```
   vercel login
   ```
4. Follow the prompts to log in
5. Deploy the application:
   ```
   vercel
   ```
6. Follow the prompts to configure your project
7. When asked about environment variables, add all the Firebase configuration variables from your `.env.local` file
8. Once deployment is complete, Vercel will provide you with a URL for your application

### Deploying to Netlify

1. Create an account on [Netlify](https://www.netlify.com/) if you don't have one
2. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. In the project directory, run:
   ```
   netlify login
   ```
4. Follow the prompts to log in
5. Build the application:
   ```
   npm run build
   ```
6. Deploy the application:
   ```
   netlify deploy --prod
   ```
7. Follow the prompts to configure your project
8. When asked about environment variables, add all the Firebase configuration variables from your `.env.local` file
9. Once deployment is complete, Netlify will provide you with a URL for your application

### Deploying to a Custom Server

If you prefer to deploy to your own server:

1. Build the application:
   ```
   npm run build
   ```
2. The build output will be in the `.next` directory
3. Transfer the following files and directories to your server:
   - `.next`
   - `public`
   - `package.json`
   - `next.config.js`
4. On your server, install production dependencies:
   ```
   npm install --production
   ```
5. Set up environment variables on your server with the Firebase configuration
6. Start the production server:
   ```
   npm start
   ```
7. Configure your web server (Nginx, Apache, etc.) to proxy requests to the Next.js server

## Post-Deployment Configuration <a name="post-deployment-configuration"></a>

### Creating the First Admin User

After deploying the application, you need to create the first admin user:

1. Navigate to your deployed application
2. Click "Sign Up" to create a new account
3. After signing up, you'll need to manually set this user as an admin in Firebase:
   - Go to the Firebase Console
   - Navigate to Firestore Database
   - Create a new collection called "users" if it doesn't exist
   - Create a document with the ID matching the user's UID (found in Authentication > Users)
   - Add a field `isAdmin` with value `true`

### Importing Initial Data

To populate the dashboard with initial data:

1. Log in as an admin user
2. Navigate to Admin > Data
3. Click "Import Data"
4. Upload the initial data JSON file (if provided)
5. Alternatively, you can manually create:
   - Factory definitions
   - Role definitions
   - Initial timeline phases

### Setting Up Custom Domain (Optional)

If you want to use a custom domain:

1. Follow the instructions for your hosting platform to configure a custom domain
2. Update the Firebase Authentication authorized domains:
   - Go to the Firebase Console
   - Navigate to Authentication > Settings
   - Add your custom domain to the "Authorized domains" list

## Troubleshooting <a name="troubleshooting"></a>

### Common Deployment Issues

#### Firebase Authentication Not Working

**Issue**: Users cannot sign in after deployment
**Solution**:
1. Ensure your Firebase project's authorized domains include your deployment URL
2. Check that all Firebase environment variables are correctly set
3. Verify that the Authentication service is enabled in Firebase

#### Firestore Permissions Errors

**Issue**: Users receive permission errors when accessing data
**Solution**:
1. Check your Firestore security rules
2. Ensure users have the correct roles assigned
3. Verify that the user document exists in the "users" collection with the correct fields

#### Build Failures

**Issue**: The application fails to build during deployment
**Solution**:
1. Check the build logs for specific errors
2. Ensure all dependencies are correctly installed
3. Verify that all environment variables are correctly set
4. Try running the build locally to debug: `npm run build`

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Firebase documentation](https://firebase.google.com/docs)
3. Contact the development team for support
