# Stream Integration for EduGather

This directory contains the core integration with Stream SDK for enabling real-time communication in the EduGather application.

## Overview

This integration focuses on the core data and state management for Stream, providing:

1. Redux slices for managing Stream state
2. API integration with the backend endpoints
3. Hooks for initializing Stream

## Installation

```bash
npm install @stream-io/video-react-sdk
```

## Core Integration Components

### 1. Redux Integration

The integration uses Redux for state management:

- `streamReducer`: Add to your Redux store
- `streamSlice.ts`: Manages Stream API key, token, user, and initialization state
- `streamApiSlice.ts`: Connects to backend endpoints

### 2. Backend Communication

The integration requires the following backend endpoints:

- `GET /api/v1/stream/config`: Returns Stream API key
- `GET /api/v1/stream/token`: Returns user-specific Stream token (authenticated)
- `POST /api/v1/stream/user`: Creates/updates user profile in Stream (authenticated)

### 3. Hooks and Context

- `useStreamInit`: Hook to initialize Stream when user is authenticated
- `useStreamClient`: Hook to access Stream configuration state

## Implementation

1. Add the Stream reducer to your Redux store:

```jsx
// src/redux/store/store.ts
import streamReducer from '../features/root/stream/slices/streamSlice';

const store = configureStore({
  reducer: {
    // ... other reducers
    stream: streamReducer,
  },
  // ... middleware configuration
});
```

2. Wrap your application with the StreamProvider:

```jsx
// App.tsx or similar
import { StreamProvider } from '@/features/root/stream';

function App() {
  return (
    <Provider store={store}>
      <StreamProvider>
        {/* Your app content */}
      </StreamProvider>
    </Provider>
  );
}
```

3. Access Stream state in your components using hooks:

```jsx
import { useStreamClient } from '@/features/root/stream';

function MyComponent() {
  const { isLoading, isInitialized, apiKey, token } = useStreamClient();
  
  // Use Stream state as needed
  
  return (
    // Your component UI
  );
}
```

## UI Components

UI components for video calls, notifications, etc. will be implemented separately. 