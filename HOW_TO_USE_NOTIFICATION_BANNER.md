# How to Use the Global Notification Banner

## Quick Integration (Recommended)

### Step 1: Import the CSS animations
Add this to your main CSS file or Astro layout:

```css
/* In your global.css or styles.css */
@import '@/styles/notification-banner.css';
```

Or add inline in your layout:

```astro
<style>
  @keyframes gradient-x {
    0%, 100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  :global(.animate-gradient-x) {
    animation: gradient-x 15s ease infinite;
    background-size: 200% 200%;
  }

  :global(.animate-shimmer) {
    animation: shimmer 2s ease-in-out infinite;
  }
</style>
```

### Step 2: Wrap Your App

In your main layout file (e.g., `Layout.astro` or `RootLayout.tsx`):

```tsx
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { NotificationPermissionGuard } from "@/components/notifications/NotificationPermissionGuard";

// Option 1: Use ONLY the global banner (recommended)
<NotificationProvider>
  <NotificationPermissionGuard 
    showGlobalBanner={true}  // Shows sticky banner at top
    useModal={false}         // Disables blocking modal
  >
    {children}
  </NotificationPermissionGuard>
</NotificationProvider>

// Option 2: Use BOTH banner and modal
<NotificationProvider>
  <NotificationPermissionGuard 
    showGlobalBanner={true}  // Shows sticky banner at top
    useModal={true}          // Also shows blocking modal
  >
    {children}
  </NotificationPermissionGuard>
</NotificationProvider>

// Option 3: Use ONLY the modal (original behavior)
<NotificationProvider>
  <NotificationPermissionGuard 
    showGlobalBanner={false} // No banner
    useModal={true}          // Only blocking modal
  >
    {children}
  </NotificationPermissionGuard>
</NotificationProvider>
```

## How It Works

### Global Banner Features:
1. **Sticky Position**: Always visible at the top of every page
2. **Auto-Detection**: Continuously checks if user enabled notifications
3. **Browser-Specific Instructions**: Detects Chrome, Firefox, Safari, Edge
4. **Expandable Instructions**: Click arrow to see step-by-step guide
5. **Auto-Refresh**: Page refreshes automatically when permissions are enabled
6. **Non-Blocking**: Users can still use the app (unlike the modal)

### Banner Behavior:
- Shows ONLY when notifications are blocked/denied AND required
- Pushes page content down (doesn't overlap)
- Animated gradient background for visibility
- Expands to show detailed instructions
- Auto-refreshes when permissions are re-enabled

## Styling Customization

### Custom Colors:
```tsx
// In GlobalNotificationBanner.tsx, modify the className:
<div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
```

### Custom Height:
```tsx
// Adjust the padding in the style tag:
<style jsx global>{`
  body {
    padding-top: ${showBanner ? (isExpanded ? '250px' : '64px') : '0'} !important;
  }
`}</style>
```

## Complete Example in Astro

```astro
---
// Layout.astro
import NotificationProvider from '@/components/notifications/NotificationProvider';
import NotificationPermissionGuard from '@/components/notifications/NotificationPermissionGuard';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      @keyframes gradient-x {
        0%, 100% {
          background-size: 200% 200%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }
      .animate-gradient-x {
        animation: gradient-x 15s ease infinite;
      }
    </style>
  </head>
  <body>
    <NotificationProvider client:load>
      <NotificationPermissionGuard 
        client:load 
        showGlobalBanner={true}
        useModal={false}
      >
        <slot />
      </NotificationPermissionGuard>
    </NotificationProvider>
  </body>
</html>
```

## Testing

1. **Block Notifications**: 
   - Clear site permissions
   - Reload page
   - Click "Block" when prompted
   - Banner should appear at top

2. **Re-enable**: 
   - Follow banner instructions
   - Enable in browser settings
   - Page auto-refreshes when detected

3. **Quick Reset** (Chrome):
   - Click lock icon in address bar
   - Click "Reset permissions"
   - Reload page

## Troubleshooting

### Banner Not Showing:
- Check if `requiresPermission` is true (backend must require notifications)
- Verify `showGlobalBanner={true}` is set
- Check browser console for errors

### Banner Shows But No Auto-Refresh:
- Ensure NotificationPermissionChecker is included
- Check if permission actually changed in browser settings
- Try manual refresh after changing settings

### Styling Issues:
- Ensure animation CSS is included
- Check z-index conflicts with other elements
- Verify Tailwind CSS is working properly
