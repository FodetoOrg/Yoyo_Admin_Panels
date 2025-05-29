export const CONSTANTS = {
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
};

export const ROUTES = {
  LOGIN_ROUTE: "/api/v1/auth/login",
  VERIFY_ME_ROUTE: "/api/v1/auth/me",
  REFRESH_TOKEN_ROUTE: "/api/v1/auth/refresh-token",
  GET_ALL_HOTELS_ROUTE: "/api/v1/hotels",
  CREATE_HOTEL_ROUTE: "/api/v1/hotels",
  GET_HOTEL_ROUTE: (hotelId: string) => `/api/v1/hotels/${hotelId}`,
  GET_CITIES_ROUTE: "/api/v1/cities",
  GET_CITY_ROUTE: (cityId: string) => `/api/v1/cities/${cityId}`,
  CREATE_CITY_ROUTE: "/api/v1/cities",
  UPDATED_CITY_ROUTE: (cityId: string) => `/api/v1/cities/${cityId}`,
  GET_ALL_USERS_ROUTE: (userType: string, page: number, limit: number) =>
    `/api/v1/auth/users?role=${userType}&page=${page}&limit=${limit}`,
  CREATE_HOTEL_ADMIN_ROUTE: "/api/v1/auth/addHotelAdmin",
  GET_HOTEL_ALLUSERS_ROUTE: "/api/v1/hotels/hotelUsers",
  GET_ALL_CITIES_ROUTE: "/api/v1/cities",
};

export const STATES_OPTIONS = [
  { label: "Andhra Pradesh", value: "AP" },
  { label: "Arunachal Pradesh", value: "AR" },
  { label: "Assam", value: "AS" },
  { label: "Bihar", value: "BR" },
  { label: "Chhattisgarh", value: "CG" },
  { label: "Goa", value: "GA" },
  { label: "Gujarat", value: "GJ" },
  { label: "Haryana", value: "HR" },
  { label: "Himachal Pradesh", value: "HP" },
  { label: "Jharkhand", value: "JH" },
  { label: "Karnataka", value: "KA" },
  { label: "Kerala", value: "KL" },
  { label: "Madhya Pradesh", value: "MP" },
  { label: "Maharashtra", value: "MH" },
  { label: "Manipur", value: "MN" },
  { label: "Meghalaya", value: "ML" },
  { label: "Mizoram", value: "MZ" },
  { label: "Nagaland", value: "NL" },
  { label: "Odisha", value: "OR" },
  { label: "Punjab", value: "PB" },
  { label: "Rajasthan", value: "RJ" },
  { label: "Sikkim", value: "SK" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Telangana", value: "TG" },
  { label: "Tripura", value: "TR" },
  { label: "Uttar Pradesh", value: "UP" },
  { label: "Uttarakhand", value: "UK" },
  { label: "West Bengal", value: "WB" },
];

export const AMENITIES_OPTIONS = [
  { label: "WiFi", value: "wifi" },
  { label: "Pool", value: "pool" },
  { label: "Gym", value: "gym" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Spa", value: "spa" },
  { label: "Parking", value: "parking" },
  { label: "Room Service", value: "room_service" },
  { label: "Business Center", value: "business_center" },
];
