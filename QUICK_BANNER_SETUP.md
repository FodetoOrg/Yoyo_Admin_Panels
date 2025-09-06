# 🚀 Quick Setup: Add Notification Banner to All Pages

## Option 1: Add to Your Existing Layout (Easiest)

In your main layout file (e.g., `Layout.astro`), add this component at the very top of the `<body>`:

```astro
---
// Layout.astro
import NotificationSystemWrapper from '@/components/notifications/NotificationSystemWrapper';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Your existing head content -->
    <style>
      /* Add these animations */
      @keyframes gradient-x {
        0%, 100% { background-position: left center; }
        50% { background-position: right center; }
      }
      .animate-gradient-x {
        animation: gradient-x 15s ease infinite;
        background-size: 200% 200%;
      }
    </style>
  </head>
  <body>
    <!-- ADD THIS LINE - Notification Banner -->
    <NotificationSystemWrapper client:load showBanner={true} showModal={false} />
    
    <!-- Your existing content -->
    <slot />
  </body>
</html>
```

That's it! The banner will now show on ALL pages when notifications are blocked.

## Option 2: Add to Individual Pages

If you only want the banner on specific pages:

```astro
---
// pages/admin/dashboard.astro
import Layout from '@/layouts/Layout.astro';
import GlobalNotificationBanner from '@/components/notifications/GlobalNotificationBanner';
import NotificationProvider from '@/components/notifications/NotificationProvider';
---

<Layout>
  <NotificationProvider client:load>
    <GlobalNotificationBanner client:load />
  </NotificationProvider>
  
  <!-- Your page content -->
</Layout>
```

## What the Banner Does

✅ **Shows automatically** when notifications are blocked  
✅ **Sticky at top** of every page  
✅ **Browser-specific instructions** (Chrome, Firefox, Safari, Edge)  
✅ **Auto-detects** when user enables notifications  
✅ **Auto-refreshes** the page when fixed  
✅ **Non-blocking** - users can still use the app  

## How It Looks

- **Collapsed**: Red/orange gradient bar at top with warning message
- **Expanded**: Shows step-by-step instructions for enabling notifications
- **Auto-hides**: Disappears when notifications are enabled

## Testing

1. **See the banner**: 
   - Go to browser settings → Site settings → Notifications → Block
   - Refresh page - banner appears!

2. **Remove the banner**:
   - Click lock icon in address bar
   - Change Notifications to "Allow"
   - Page auto-refreshes and banner disappears

## Customization

### Change Colors
In `GlobalNotificationBanner.tsx`, find:
```tsx
className="... bg-gradient-to-r from-red-600 via-orange-600 to-red-600 ..."
```
Change to your preferred colors, e.g.:
```tsx
className="... bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 ..."
```

### Change Message
In `GlobalNotificationBanner.tsx`, find:
```tsx
"Notifications are blocked - You must enable them to continue using this application"
```
Change to your preferred message.

## Common Issues

**Banner not showing?**
- Notifications must be blocked in browser
- User role must require notifications (check backend)

**Page content hidden behind banner?**
- The banner automatically adds padding to body
- If issues persist, add `pt-16` class to your main container

**Animation not working?**
- Ensure the CSS animations are included in your layout

## That's It! 
Your notification banner is now active on all pages! 🎉
