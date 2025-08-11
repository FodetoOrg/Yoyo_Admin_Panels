import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, type ApiResponse } from "@/lib/utils/api";
import { ROUTES } from "@/lib/utils/constants";
import {
    Settings,
    Wrench,
    Upload,
    Star,
    Image,
    CreditCard,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    X,
    Plus,
    Clock,
    AlertCircle,
    ChevronDown,
    Check,
    RotateCcw,
    Timer,
    XCircle,
    Play
} from 'lucide-react';
import { UserRole } from '@/lib/utils/auth';

const ConfigurationsScreen = ({
    initialConfigurations = {},
    availableHotels = [],
    apiError = null,
    currentUser = null
}) => {
    const [configurations, setConfigurations] = useState(initialConfigurations);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const [saving, setSaving] = useState({});
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedHotels, setSelectedHotels] = useState([]);
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerCoupon, setBannerCoupon] = useState('');
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [cancellingNoShows, setCancellingNoShows] = useState(false);

    // Auto-clear success messages
    useEffect(() => {
        Object.keys(success).forEach(key => {
            if (success[key]) {
                setTimeout(() => {
                    setSuccess(prev => ({ ...prev, [key]: false }));
                }, 3000);
            }
        });
    }, [success]);

    // Initialize selected hotels from configurations
    useEffect(() => {
        if (configurations.featured_hotels?.value) {
            setSelectedHotels(configurations.featured_hotels.value);
        }
    }, [configurations.featured_hotels?.value]);

    // Initialize banner coupon from configurations
    useEffect(() => {
        if (configurations.app_banner_coupon_code?.value) {
            setBannerCoupon(configurations.app_banner_coupon_code.value);
        }
    }, [configurations.app_banner_coupon_code?.value]);

    const loadConfigurations = async () => {
        setLoading(true);
        setErrors({});

        try {
            const response: ApiResponse<any> = await apiService.get('/api/v1/configurations');

            if (response.success) {
                const apiConfigs = response.data;
                const transformedConfigs = {
                    app_maintenance_mode: {
                        value: apiConfigs.app_maintenance_mode === true || apiConfigs.app_maintenance_mode === 'true',
                        type: 'boolean',
                        description: 'Enable/disable app maintenance mode',
                        category: 'app'
                    },
                    online_payment_global_enabled: {
                        value: apiConfigs.online_payment_global_enabled === true || apiConfigs.online_payment_global_enabled === 'true',
                        type: 'boolean',
                        description: 'Global online payment enable/disable',
                        category: 'payment'
                    },
                    app_banner_image: {
                        value: apiConfigs.app_banner_image || '',
                        type: 'string',
                        description: 'Banner image URL for app',
                        category: 'ui'
                    },
                    app_banner_coupon_code: {
                        value: apiConfigs.app_banner_coupon_code || '',
                        type: 'string',
                        description: 'Coupon code associated with banner',
                        category: 'ui'
                    },
                    featured_hotels: {
                        value: Array.isArray(apiConfigs.featured_hotels) ?
                            apiConfigs.featured_hotels :
                            JSON.parse(apiConfigs.featured_hotels || '[]'),
                        type: 'array',
                        description: 'Array of featured hotel IDs',
                        category: 'app'
                    },
                    default_cancellation_hours: {
                        value: typeof apiConfigs.default_cancellation_hours === 'number' ?
                            apiConfigs.default_cancellation_hours :
                            parseInt(apiConfigs.default_cancellation_hours) || 24,
                        type: 'number',
                        description: 'Default cancellation period in hours',
                        category: 'booking'
                    },
                    auto_cancellation_hours: {
                        value: typeof apiConfigs.auto_cancellation_hours === 'number' ?
                            apiConfigs.auto_cancellation_hours :
                            parseInt(apiConfigs.auto_cancellation_hours) || 1,
                        type: 'number',
                        description: 'Default cancellation period in hours if user doesn\'t show up',
                        category: 'booking'
                    }
                };

                setConfigurations(transformedConfigs);
            } else {
                setErrors({ general: response.message || 'Failed to load configurations' });
            }
        } catch (error) {
            console.error('Failed to load configurations:', error);
            setErrors({ general: error.message || 'Failed to load configurations' });
        } finally {
            setLoading(false);
        }
    };

    const initializeConfigurations = async () => {
        setInitializing(true);
        setErrors({});

        try {
            const response = await apiService.post('/api/v1/configurations/initialize');

            if (response.success) {
                setSuccess({ general: 'Configurations reinitialized successfully' });
                // Reload configurations after initialization
                await loadConfigurations();
            } else {
                setErrors({ general: response.message || 'Failed to reinitialize configurations' });
            }
        } catch (error) {
            console.error('Failed to reinitialize configurations:', error);
            setErrors({ general: error.message || 'Failed to reinitialize configurations' });
        } finally {
            setInitializing(false);
        }
    };

    const triggerCancelNoShows = async () => {
        setCancellingNoShows(true);
        setErrors(prev => ({ ...prev, cancel_no_shows: null }));
        setSuccess(prev => ({ ...prev, cancel_no_shows: false }));

        try {
            const response: ApiResponse<any> = await apiService.post('/api/v1/bookings/admin/jobs/cancel-no-shows');

            console.log('response in cancellation is  ',response)
            if (response.success) {
                const cancelledCount = response.data?.cancelled || 0;
                setSuccess(prev => ({ 
                    ...prev, 
                    cancel_no_shows: `Successfully cancelled ${cancelledCount} no-show booking${cancelledCount !== 1 ? 's' : ''}`
                }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    cancel_no_shows: response.message || 'Failed to cancel no-show bookings' 
                }));
            }
        } catch (error) {
            console.error('Failed to cancel no-show bookings:', error);
            setErrors(prev => ({ 
                ...prev, 
                cancel_no_shows: error.message || 'Failed to cancel no-show bookings' 
            }));
        } finally {
            setCancellingNoShows(false);
        }
    };

    const updateConfiguration = async (key, newValue) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        setErrors(prev => ({ ...prev, [key]: null }));
        setSuccess(prev => ({ ...prev, [key]: false }));

        try {
            // Transform value for API
            let apiValue = newValue;
            if (configurations[key].type === 'boolean') {
                apiValue = newValue.toString();
            } else if (configurations[key].type === 'array') {
                apiValue = JSON.stringify(newValue);
            } else if (configurations[key].type === 'number') {
                apiValue = newValue.toString();
            }

            const response = await apiService.put(`/api/v1/configurations/${key}`, {
                value: apiValue,
                type: configurations[key].type,
                description: configurations[key].description,
                category: configurations[key].category
            });

            if (response.success) {
                setConfigurations(prev => ({
                    ...prev,
                    [key]: { ...prev[key], value: newValue }
                }));
                setSuccess(prev => ({ ...prev, [key]: true }));
            } else {
                setErrors(prev => ({ ...prev, [key]: response.message || 'Failed to update' }));
            }
        } catch (error) {
            console.error(`Failed to update ${key}:`, error);
            setErrors(prev => ({ ...prev, [key]: error.message || 'Failed to update' }));
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleBooleanChange = (key, checked) => {
        updateConfiguration(key, checked);
    };

    const handleStringChange = (key, value) => {
        setConfigurations(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }));
    };

    const handleStringSave = (key) => {
        updateConfiguration(key, configurations[key].value);
    };

    const handleNumberChange = (key, value) => {
        const numValue = parseInt(value) || 0;
        setConfigurations(prev => ({
            ...prev,
            [key]: { ...prev[key], value: numValue }
        }));
    };

    const handleNumberSave = (key) => {
        updateConfiguration(key, configurations[key].value);
    };

    const toggleHotelSelection = (hotelId) => {
        setSelectedHotels(prev => {
            if (prev.includes(hotelId)) {
                return prev.filter(id => id !== hotelId);
            } else {
                return [...prev, hotelId];
            }
        });
    };

    const updateFeaturedHotels = () => {
        updateConfiguration('featured_hotels', selectedHotels);
        setIsDropdownOpen(false);
    };

    const removeHotelId = (hotelId) => {
        const currentHotels = configurations.featured_hotels.value;
        const updatedHotels = currentHotels.filter(id => id !== hotelId);
        updateConfiguration('featured_hotels', updatedHotels);
        setSelectedHotels(updatedHotels);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBannerImage(file);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const uploadBannerAndCoupon = async () => {
        if (!bannerImage && !bannerCoupon) {
            setErrors(prev => ({ ...prev, banner_upload: 'Please select an image or enter a coupon code' }));
            return;
        }

        setUploadingBanner(true);
        setErrors(prev => ({ ...prev, banner_upload: null }));

        try {
            let base64Image = null;

            // Convert image to base64 if file is selected
            if (bannerImage) {
                base64Image = await convertFileToBase64(bannerImage);
            }

            const requestBody = {
                ...(base64Image && { banner_image: base64Image }),
                ...(bannerCoupon && { coupon_code: bannerCoupon })
            };

            console.log('requestBody in banner ',requestBody)

            const response: ApiResponse<any> = await apiService.post('/api/v1/configurations/banner', requestBody);

            if (response.success) {
                setSuccess(prev => ({ ...prev, banner_upload: true }));
                setBannerImage(null);
                setBannerCoupon('');
                // Reset file input
                const fileInput = document.getElementById('banner-image-upload');
                if (fileInput) {
                    fileInput.value = '';
                }
                // Reload configurations to get the new image URL
                await loadConfigurations();
            } else {
                setErrors(prev => ({ ...prev, banner_upload: response.message || 'Failed to upload banner' }));
            }
        } catch (error) {
            console.error('Failed to upload banner:', error);
            setErrors(prev => ({ ...prev, banner_upload: error.message || 'Failed to upload banner' }));
        } finally {
            setUploadingBanner(false);
        }
    };

    const getStatusIcon = (value, type) => {
        if (type === 'boolean') {
            return value ?
                <CheckCircle className="h-4 w-4 text-green-500" /> :
                <AlertTriangle className="h-4 w-4 text-red-500" />;
        }
        return <Settings className="h-4 w-4 text-blue-500" />;
    };

    const getStatusColor = (value, type) => {
        if (type === 'boolean') {
            return value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
        }
        return 'bg-blue-50 border-blue-200';
    };

    const getHotelName = (hotelId) => {
        const hotel = availableHotels.find(h => h.id === hotelId);
        return hotel ? `${hotel.name} (${hotel.city})` : hotelId;
    };

    const canManageGlobalSettings = currentUser?.role === UserRole.SUPER_ADMIN;

    if (loading) {
        return (
            <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-lg">Loading configurations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col gap-6 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">App Configurations</h1>
                    <p className="text-muted-foreground">
                        Manage application settings and features
                        {!canManageGlobalSettings && ' (Limited access as Hotel Admin)'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadConfigurations} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    {canManageGlobalSettings && (
                        <Button
                            onClick={initializeConfigurations}
                            variant="outline"
                            disabled={initializing}
                        >
                            {initializing ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <RotateCcw className="h-4 w-4 mr-2" />
                            )}
                            Reinitialize
                        </Button>
                    )}
                </div>
            </div>

            {/* API Error Alert */}
            {(apiError || errors.general) && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {apiError || errors.general}
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Alert */}
            {success.general && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        {success.general}
                    </AlertDescription>
                </Alert>
            )}

            {/* Permission Warning for Hotel Admins */}
            {!canManageGlobalSettings && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You have limited access to configuration settings. Only Super Admins can modify global app settings.
                    </AlertDescription>
                </Alert>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* App Control Settings - Super Admin Only */}
                {canManageGlobalSettings && (
                    <Card className={getStatusColor(configurations.app_maintenance_mode?.value, 'boolean')}>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Wrench className="h-5 w-5" />
                                <CardTitle>App Control</CardTitle>
                                {getStatusIcon(configurations.app_maintenance_mode?.value, 'boolean')}
                            </div>
                            <CardDescription>
                                Control app accessibility
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="app-maintenance">App Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable to put the mobile app in maintenance mode
                                    </p>
                                    {errors.app_maintenance_mode && (
                                        <p className="text-sm text-red-500">{errors.app_maintenance_mode}</p>
                                    )}
                                    {success.app_maintenance_mode && (
                                        <p className="text-sm text-green-500">✓ Updated successfully</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {saving.app_maintenance_mode && <RefreshCw className="h-4 w-4 animate-spin" />}
                                    <Switch
                                        id="app-maintenance"
                                        checked={configurations.app_maintenance_mode?.value || false}
                                        onCheckedChange={(checked) => handleBooleanChange('app_maintenance_mode', checked)}
                                        disabled={saving.app_maintenance_mode}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Featured Hotels - Super Admin Only */}
                {canManageGlobalSettings && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Star className="h-5 w-5" />
                                <CardTitle>Featured Hotels</CardTitle>
                            </div>
                            <CardDescription>
                                Select hotels from available options to feature in the app
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {/* Multi-select dropdown for available hotels */}
                            {availableHotels.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <Label>Select Featured Hotels</Label>
                                    <div className="relative">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            disabled={saving.featured_hotels}
                                        >
                                            <span>
                                                {selectedHotels.length === 0
                                                    ? "Select hotels..."
                                                    : `${selectedHotels.length} hotel${selectedHotels.length !== 1 ? 's' : ''} selected`
                                                }
                                            </span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                                                <div className="p-2">
                                                    {availableHotels.map((hotel) => (
                                                        <div
                                                            key={hotel.id}
                                                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                            onClick={() => toggleHotelSelection(hotel.id)}
                                                        >
                                                            <div className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded">
                                                                {selectedHotels.includes(hotel.id) && (
                                                                    <Check className="h-3 w-3 text-blue-600" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{hotel.name}</div>
                                                                <div className="text-sm text-gray-500">{hotel.city} • ID: {hotel.id}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t p-2">
                                                    <Button
                                                        onClick={updateFeaturedHotels}
                                                        disabled={saving.featured_hotels}
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        {saving.featured_hotels ? (
                                                            <>
                                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Update Featured Hotels
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Currently selected hotels */}
                                    <div className="flex flex-col gap-2">
                                        <Label>Currently Featured Hotels</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {configurations.featured_hotels?.value?.map((hotelId) => {
                                                const hotel = availableHotels.find(h => h.id === hotelId);
                                                return (
                                                    <Badge key={hotelId} variant="secondary" className="flex items-center space-x-1">
                                                        <div className="flex flex-col">
                                                            {hotel ? (
                                                                <>
                                                                    <span className="font-medium">{hotel.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{hotel.city} • {hotelId}</span>
                                                                </>
                                                            ) : (
                                                                <span>{hotelId} (Hotel not found)</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeHotelId(hotelId)}
                                                            className="ml-2 hover:bg-red-100 rounded-full p-0.5"
                                                            disabled={saving.featured_hotels}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                );
                                            })}
                                        </div>

                                        {(!configurations.featured_hotels?.value || configurations.featured_hotels.value.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No featured hotels selected</p>
                                        )}
                                    </div>

                                    {errors.featured_hotels && (
                                        <p className="text-sm text-red-500">{errors.featured_hotels}</p>
                                    )}
                                    {success.featured_hotels && (
                                        <p className="text-sm text-green-500">✓ Updated successfully</p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">No hotels available to select from</p>
                                    <p className="text-sm text-muted-foreground mt-1">Make sure hotels are loaded in the system</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Banner Configuration - Super Admin Only */}
                {canManageGlobalSettings && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Image className="h-5 w-5" />
                                <CardTitle>App Banner</CardTitle>
                            </div>
                            <CardDescription>
                                Upload banner image and set coupon code
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {/* Image Upload */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="banner-image-upload">Banner Image</Label>
                                <Input
                                    id="banner-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploadingBanner}
                                />
                                {bannerImage && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: {bannerImage.name}
                                    </p>
                                )}
                            </div>

                            {/* Coupon Code */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="coupon-code">Coupon Code</Label>
                                <Input
                                    id="coupon-code"
                                    placeholder="WELCOME25"
                                    value={bannerCoupon}
                                    onChange={(e) => setBannerCoupon(e.target.value)}
                                    disabled={uploadingBanner}
                                />
                            </div>

                            {/* Upload Button */}
                            <Button
                                onClick={uploadBannerAndCoupon}
                                disabled={uploadingBanner || (!bannerImage && !bannerCoupon)}
                                className="w-full"
                            >
                                {uploadingBanner ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Banner & Coupon
                                    </>
                                )}
                            </Button>

                            {errors.banner_upload && (
                                <p className="text-sm text-red-500">{errors.banner_upload}</p>
                            )}
                            {success.banner_upload && (
                                <p className="text-sm text-green-500">✓ Banner updated successfully</p>
                            )}

                            {/* Current Banner Preview */}
                            {configurations.app_banner_image?.value && (
                                <div className="flex flex-col gap-2">
                                    <Label>Current Banner</Label>
                                    <div className="border rounded-lg overflow-hidden max-w-md">
                                        <img
                                            src={configurations.app_banner_image.value}
                                            alt="Current banner"
                                            className="w-full h-32 object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    {configurations.app_banner_coupon_code?.value && (
                                        <Badge variant="outline" className="w-fit">
                                            Current Coupon: {configurations.app_banner_coupon_code.value}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Payment Settings - Super Admin Only */}
                {canManageGlobalSettings && (
                    <Card className={getStatusColor(configurations.online_payment_global_enabled?.value, 'boolean')}>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5" />
                                <CardTitle>Payment Settings</CardTitle>
                                {getStatusIcon(configurations.online_payment_global_enabled?.value, 'boolean')}
                            </div>
                            <CardDescription>
                                Control global payment options
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="online-payment">Global Online Payment</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable or disable online payments globally across the app
                                    </p>
                                    {errors.online_payment_global_enabled && (
                                        <p className="text-sm text-red-500">{errors.online_payment_global_enabled}</p>
                                    )}
                                    {success.online_payment_global_enabled && (
                                        <p className="text-sm text-green-500">✓ Updated successfully</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {saving.online_payment_global_enabled && <RefreshCw className="h-4 w-4 animate-spin" />}
                                    <Switch
                                        id="online-payment"
                                        checked={configurations.online_payment_global_enabled?.value || false}
                                        onCheckedChange={(checked) => handleBooleanChange('online_payment_global_enabled', checked)}
                                        disabled={saving.online_payment_global_enabled}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Booking Settings - Available to both roles */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />
                            <CardTitle>Booking Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Configure booking and cancellation policies
                            {!canManageGlobalSettings && ' (View Only)'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* Default Cancellation Hours */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="cancellation-hours">Default Cancellation Hours</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="cancellation-hours"
                                    type="number"
                                    min="0"
                                    max="168"
                                    placeholder="24"
                                    value={configurations.default_cancellation_hours?.value || 24}
                                    onChange={(e) => handleNumberChange('default_cancellation_hours', e.target.value)}
                                    disabled={!canManageGlobalSettings}
                                />
                                {canManageGlobalSettings && (
                                    <Button
                                        onClick={() => handleNumberSave('default_cancellation_hours')}
                                        disabled={saving.default_cancellation_hours}
                                    >
                                        {saving.default_cancellation_hours ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Default number of hours before check-in that guests can cancel bookings
                            </p>
                            {errors.default_cancellation_hours && (
                                <p className="text-sm text-red-500">{errors.default_cancellation_hours}</p>
                            )}
                            {success.default_cancellation_hours && (
                                <p className="text-sm text-green-500">✓ Updated successfully</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* No-Show Management - Super Admin Only */}
                {canManageGlobalSettings && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <XCircle className="h-5 w-5" />
                                <CardTitle>No-Show Management</CardTitle>
                            </div>
                            <CardDescription>
                                Cancel bookings for guests who don't show up
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-amber-800">Auto-Cancellation Policy</p>
                                            <p className="text-sm text-amber-700 mt-1">
                                                All confirmed bookings that missed their check-in time will be automatically cancelled with a 1-hour buffer period.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={triggerCancelNoShows}
                                    disabled={cancellingNoShows}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    {cancellingNoShows ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Processing No-Shows...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4 mr-2" />
                                            Trigger Auto-Cancel No-Shows
                                        </>
                                    )}
                                </Button>

                                {errors.cancel_no_shows && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {errors.cancel_no_shows}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {success.cancel_no_shows && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {success.cancel_no_shows}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ConfigurationsScreen;