# Stream Video Integration

This directory contains the integration with Stream Video SDK for enabling video calls in the EduGather application.

## Installation

Make sure to install the required dependencies:

```bash
npm install @stream-io/video-react-sdk uuid
```

The Stream Video SDK requires these peer dependencies which you might already have in your project:
- React 16.8+ (`react` and `react-dom`)
- Redux (`@reduxjs/toolkit` and `react-redux`)

## Implementation Steps

1. **Add the Stream provider to your app's entry point:**

```jsx
// In App.tsx or similar root component
import { StreamProvider, StreamVideoWrapper } from '@/features/root/stream';

function App() {
  return (
    <Provider store={store}>
      <StreamProvider>
        <StreamVideoWrapper>
          {/* Your app content */}
          <Router>
            <Routes>
              {/* ... your routes */}
            </Routes>
          </Router>
        </StreamVideoWrapper>
      </StreamProvider>
    </Provider>
  );
}
```

2. **Add the CallNotification component to show incoming call alerts:**

```jsx
// In your layout component
import { CallNotification } from '@/features/root/stream';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main>{children}</main>
      <Footer />
      <CallNotification />
    </div>
  );
};
```

3. **Add a button to initiate calls:**

```jsx
import { StartCallButton } from '@/features/root/stream';

const ContactCard = ({ user }) => {
  return (
    <div className="contact-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      
      <StartCallButton 
        participants={[user._id]} 
        callType="video"
        onCallStarted={(callId) => {
          // Handle call started (e.g., navigate to call page)
          navigate(`/call/${callId}`);
        }}
      >
        Video Call
      </StartCallButton>
    </div>
  );
};
```

4. **Create a call page or component:**

```jsx
import { VideoCall } from '@/features/root/stream';
import { useParams } from 'react-router-dom';

const CallPage = () => {
  const { callId } = useParams();
  
  return (
    <div className="call-page">
      <VideoCall callId={callId} />
    </div>
  );
};
```

5. **Import styles in your main CSS file:**

```css
@import '@stream-io/video-react-sdk/dist/css/styles.css';
@import './features/root/stream/styles/videoCall.css';
```

## Redux Integration

The Stream integration uses Redux for state management. The following pieces are available:

- `streamReducer`: Add to your Redux store
- `useGetStreamConfigQuery`: Hook to fetch Stream API key
- `useGetStreamTokenQuery`: Hook to fetch user-specific Stream token
- `useCreateUpdateStreamUserMutation`: Hook to create/update user profile in Stream
- `useStreamClient`: Hook to access the Stream client instance

## Backend Requirements

The integration requires the following backend endpoints:

- `GET /api/v1/stream/config`: Returns Stream API key
- `GET /api/v1/stream/token`: Returns user-specific Stream token
- `POST /api/v1/stream/user`: Creates/updates user profile in Stream

These endpoints are already implemented in the backend.

## Example Page

Check out the example implementation in:
- `src/features/root/stream/example/VideoCallExample.tsx`

This provides a ready-to-use implementation that you can customize for your needs. 