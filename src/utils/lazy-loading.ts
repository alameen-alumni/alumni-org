import { lazy } from 'react';

// Lazy loading configuration for better code splitting
export const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
  return lazy(importFn);
};

// Preload function for critical components
export const preloadComponent = (importFn: () => Promise<any>) => {
  return () => {
    const promise = importFn();
    return promise;
  };
};

// Chunk configuration for different page types
export const pageChunks = {
  // Main pages - load immediately
  main: () => import('../pages/Index'),
  
  // Content pages - load on demand
  content: () => import('../pages/Events'),
  gallery: () => import('../pages/Gallery'),
  alumni: () => import('../pages/Alumni'),
  
  // Admin pages - load only when needed
  admin: () => import('../pages/AdminPanel'),
  
  // Form pages - load when user starts filling
  forms: () => import('../pages/reunion2k25'),
};

// Lazy load with retry mechanism
export const lazyWithRetry = (importFn: () => Promise<any>, retries = 3) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const attempt = () => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000);
            } else {
              reject(error);
            }
          });
      };
      attempt();
    });
  });
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload main page components
  pageChunks.main();
  pageChunks.content();
};

// Lazy load with prefetch hint
export const lazyWithPrefetch = (importFn: () => Promise<any>) => {
  const Component = lazy(importFn);
  
  // Add prefetch hint
  const prefetch = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = window.location.pathname;
    document.head.appendChild(link);
  };
  
  return { Component, prefetch };
};
