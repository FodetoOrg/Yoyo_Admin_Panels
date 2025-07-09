# Backend Implementation Guide - Hotel Admin Dashboard

## 🎯 **IMPLEMENTED FEATURES** (Frontend Ready)

### 1. **Authentication & Authorization**
- ✅ **Phone-based Authentication** (Firebase integration)
- ✅ **JWT Token Management** (Access + Refresh tokens)
- ✅ **Role-based Access Control**
  - `superAdmin` - Full system access
  - `hotel` - Hotel-specific access
  - `user` - Customer access
- ✅ **View As Functionality** (Super admin can view as hotel admin)

**Backend APIs Needed:**
```
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token  
GET  /api/v1/auth/me
```

### 2. **User Management**
- ✅ **Customer Management** (View only for super admin)
- ✅ **Hotel Admin Management** (CRUD for super admin)
- ✅ **Staff Management** (Placeholder ready)

**Backend APIs Needed:**
```
GET  /api/v1/auth/users?role={role}&page={page}&limit={limit}
POST /api/v1/auth/addHotelAdmin
GET  /api/v1/hotels/hotelUsers?hotelId={hotelId}
```

### 3. **City Management**
- ✅ **City CRUD** (Super admin only)
- ✅ **State-wise organization**
- ✅ **Hotel count tracking**

**Backend APIs Needed:**
```
GET    /api/v1/cities
POST   /api/v1/cities
GET    /api/v1/cities/{cityId}
PUT    /api/v1/cities/{cityId}
DELETE /api/v1/cities/{cityId}
```

### 4. **Hotel Management**
- ✅ **Hotel CRUD** (Super admin)
- ✅ **Hotel-specific dashboard** (Hotel admin)
- ✅ **Commission rate management**
- ✅ **Multi-image upload support**
- ✅ **Amenities management**
- ✅ **Location coordinates**

**Backend APIs Needed:**
```
GET  /api/v1/hotels
POST /api/v1/hotels
GET  /api/v1/hotels/{hotelId}
PUT  /api/v1/hotels/{hotelId}
```

### 5. **Room Type Management**
- ✅ **Simple Room Type CRUD** (Super admin only)
- ✅ **Name and Description only** (Simplified)
- ✅ **Status management**

**Backend APIs Needed:**
```
GET    /api/v1/room-types
POST   /api/v1/room-types
GET    /api/v1/room-types/{roomTypeId}
PUT    /api/v1/room-types/{roomTypeId}
DELETE /api/v1/room-types/{roomTypeId}
```

### 6. **Room Management**
- ✅ **Room CRUD** (Hotel admin + Super admin)
- ✅ **Room status management** (available, occupied, maintenance, out_of_order)
- ✅ **Hourly and daily booking options**
- ✅ **Multi-image support**
- ✅ **Amenities per room**
- ✅ **Floor and capacity management**

**Backend APIs Needed:**
```
GET    /api/v1/hotels/{hotelId}/rooms
POST   /api/v1/hotels/{hotelId}/rooms
GET    /api/v1/hotels/{hotelId}/rooms/{roomId}
PUT    /api/v1/hotels/{hotelId}/rooms/{roomId}
DELETE /api/v1/hotels/{hotelId}/rooms/{roomId}
```

### 7. **Booking Management**
- ✅ **Booking list with filters** (Hotel admin + Super admin)
- ✅ **Status tracking** (confirmed, pending, cancelled, completed)
- ✅ **Payment status tracking**
- ✅ **Date range filtering**
- ✅ **Guest information**

**Backend APIs Needed:**
```
GET /api/v1/bookings?hotelId={hotelId}&status={status}&page={page}
GET /api/v1/bookings/{bookingId}
PUT /api/v1/bookings/{bookingId}/status
```

### 8. **Invoice Management**
- ✅ **Invoice generation and tracking**
- ✅ **Tax calculations**
- ✅ **Payment status tracking**
- ✅ **Due date management**

**Backend APIs Needed:**
```
GET /api/v1/invoices?hotelId={hotelId}&status={status}
GET /api/v1/invoices/{invoiceId}
PUT /api/v1/invoices/{invoiceId}
POST /api/v1/invoices/generate
```

### 9. **Payment Management**
- ✅ **Transaction tracking**
- ✅ **Payment method tracking**
- ✅ **Refund management**
- ✅ **Payment status updates**

**Backend APIs Needed:**
```
GET /api/v1/payments?hotelId={hotelId}&status={status}
GET /api/v1/payments/{paymentId}
POST /api/v1/payments/{paymentId}/refund
PUT /api/v1/payments/{paymentId}/status
```

### 10. **Coupon Management** (Super Admin Only)
- ✅ **Coupon CRUD**
- ✅ **Percentage and fixed amount discounts**
- ✅ **Usage limits and tracking**
- ✅ **Date range validity**
- ✅ **Price increase percentage option**
- ✅ **Advanced mapping system**
  - City-based mapping (auto-selects all hotels in city)
  - Individual hotel mapping
  - Room type restrictions
  - Mixed mapping scenarios

**Backend APIs Needed:**
```
GET    /api/v1/coupons
POST   /api/v1/coupons
GET    /api/v1/coupons/{couponId}
PUT    /api/v1/coupons/{couponId}
DELETE /api/v1/coupons/{couponId}

# Coupon Mapping
GET  /api/v1/coupons/{couponId}/mappings
POST /api/v1/coupons/{couponId}/mappings
PUT  /api/v1/coupons/{couponId}/mappings
```

### 11. **Revenue Management** (Super Admin Only)
- ✅ **Commission tracking per hotel**
- ✅ **Payment status management** (pending, paid, overdue)
- ✅ **Period-based revenue calculation**
- ✅ **Payment initiation and tracking**
- ✅ **Two-tab interface** (Need to Pay / Already Paid)

**Backend APIs Needed:**
```
GET /api/v1/revenue?status={status}&period={period}
GET /api/v1/revenue/{hotelId}
POST /api/v1/revenue/{recordId}/pay
PUT /api/v1/revenue/{recordId}/status
```

### 12. **Dynamic Pricing Management** (Super Admin Only)
- ✅ **City-based price adjustments**
- ✅ **Hotel-specific pricing**
- ✅ **Room type pricing**
- ✅ **Percentage and fixed amount adjustments**
- ✅ **Date range effectiveness**
- ✅ **Reason tracking**

**Backend APIs Needed:**
```
POST /api/v1/pricing/adjust
GET  /api/v1/pricing/history
PUT  /api/v1/pricing/{adjustmentId}
DELETE /api/v1/pricing/{adjustmentId}
```

### 13. **Dashboard Analytics**
- ✅ **Super Admin Dashboard** (System-wide stats)
- ✅ **Hotel-specific Dashboard** (Hotel admin view)
- ✅ **City-wise analytics** (Super admin)
- ✅ **Hotel-wise analytics** (Super admin)
- ✅ **Revenue charts and graphs**
- ✅ **Booking trends**
- ✅ **Occupancy rates**

**Backend APIs Needed:**
```
GET /api/v1/analytics/dashboard?type={super|hotel}&hotelId={hotelId}
GET /api/v1/analytics/cities/{cityId}
GET /api/v1/analytics/hotels/{hotelId}
GET /api/v1/analytics/revenue?period={period}
```

---

## 🚧 **FEATURES TO IMPLEMENT** (Frontend Ready, Backend Needed)

### 1. **File Upload System**
- **Image compression and optimization**
- **Multiple file upload support**
- **Base64 to file conversion**
- **File size and type validation**

**Backend APIs Needed:**
```
POST /api/v1/upload/images
DELETE /api/v1/upload/images/{imageId}
```

### 2. **Advanced Filtering**
- **Date range filtering**
- **Multi-column filtering**
- **Search functionality**
- **Export capabilities**

### 3. **Notification System**
- **Real-time notifications**
- **Email notifications**
- **SMS notifications**
- **Push notifications**

---

## 📊 **DATABASE SCHEMA REQUIREMENTS**

### Core Tables Needed:
1. **users** (id, name, phone, role, firebaseUid, status, createdAt, updatedAt)
2. **cities** (id, name, state, numberOfHotels, createdAt, updatedAt)
3. **hotels** (id, name, description, address, cityId, ownerId, amenities, images, commissionRate, mapCoordinates, status, createdAt, updatedAt)
4. **room_types** (id, name, description, status, createdAt, updatedAt)
5. **rooms** (id, hotelId, roomNumber, name, type, capacity, bedType, size, floor, pricePerNight, pricePerHour, isHourlyBooking, isDailyBooking, amenities, images, status, createdAt, updatedAt)
6. **bookings** (id, userId, hotelId, roomId, checkIn, checkOut, guests, totalAmount, status, paymentStatus, createdAt, updatedAt)
7. **invoices** (id, bookingId, userId, hotelId, amount, tax, totalAmount, status, dueDate, paidDate, createdAt, updatedAt)
8. **payments** (id, bookingId, userId, amount, currency, status, paymentMethod, transactionDate, createdAt, updatedAt)
9. **coupons** (id, code, description, discountType, discountValue, maxDiscountAmount, minOrderAmount, validFrom, validTo, usageLimit, usedCount, priceIncreasePercentage, status, createdAt, updatedAt)
10. **coupon_mappings** (id, couponId, cityId, hotelId, roomTypeId, createdAt)
11. **revenue_records** (id, hotelId, period, totalRevenue, commissionRate, commissionAmount, payableAmount, status, dueDate, paidDate, createdAt, updatedAt)
12. **price_adjustments** (id, cities, hotels, roomTypes, adjustmentType, adjustmentValue, reason, effectiveDate, expiryDate, createdAt, updatedAt)

---

## 🔐 **ROLE-BASED ACCESS SUMMARY**

### Super Admin Access:
- ✅ All system features
- ✅ User management
- ✅ City management  
- ✅ Hotel management
- ✅ Room type management
- ✅ Coupon management
- ✅ Revenue management
- ✅ Dynamic pricing
- ✅ System analytics
- ✅ View as hotel admin functionality

### Hotel Admin Access:
- ✅ Hotel-specific dashboard
- ✅ Bookings management
- ✅ Invoice management
- ✅ Payment management
- ✅ Room management
- ✅ Hotel analytics

### Customer Access:
- ❌ No admin panel access
- ✅ Customer-facing booking interface (separate implementation)

---

## 🚀 **IMPLEMENTATION PRIORITY**

### Phase 1 (Core Features):
1. Authentication & Authorization APIs
2. User Management APIs
3. City & Hotel Management APIs
4. Room Management APIs

### Phase 2 (Business Logic):
5. Booking Management APIs
6. Invoice & Payment APIs
7. Dashboard Analytics APIs

### Phase 3 (Advanced Features):
8. Coupon Management APIs
9. Revenue Management APIs
10. Dynamic Pricing APIs
11. File Upload System
12. Notification System

---

## 📝 **API RESPONSE FORMATS**

All APIs should follow this consistent format:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Success/Error message",
  "status": 200|400|401|403|404|500
}
```

For paginated responses:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

This comprehensive guide covers all implemented frontend features and their corresponding backend API requirements. The frontend is fully functional and ready to integrate with these APIs once implemented.