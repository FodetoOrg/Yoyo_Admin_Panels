import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService } from "@/lib/utils/api";
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
    Check
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
    const [saving, setSaving] = useState({});
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedHotels, setSelectedHotels] = useState([]);

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

    const loadConfigurations = async () => {
        setLoading(true);
        setErrors({});

        try {
            const response = await apiService.get('/api/v1/configurations');
            
            if (response.success) {
                const apiConfigs = response.data;
                const transformedConfigs = {
                    app_maintenance_mode: {
                        value: apiConfigs.app_maintenance_mode === true || apiConfigs.app_maintenance_mode === 'true',
                        type: 'boolean',
                        description: 'Enable/disable app maintenance mode',
                        category: 'app'
                    },
                    panel_maintenance_mode: {
                        value: apiConfigs.panel_maintenance_mode === true || apiConfigs.panel_maintenance_mode === 'true',
                        type: 'boolean',
                        description: 'Enable/disable admin panel maintenance mode',
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
                <Button onClick={loadConfigurations} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
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
                                {getStatusIcon(configurations.app_maintenance_mode?.value || configurations.panel_maintenance_mode?.value, 'boolean')}
                            </div>
                            <CardDescription>
                                Control app and admin panel accessibility
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

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="panel-maintenance">Admin Panel Maintenance</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable to put the admin panel in maintenance mode
                                    </p>
                                    {errors.panel_maintenance_mode && (
                                        <p className="text-sm text-red-500">{errors.panel_maintenance_mode}</p>
                                    )}
                                    {success.panel_maintenance_mode && (
                                        <p className="text-sm text-green-500">✓ Updated successfully</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {saving.panel_maintenance_mode && <RefreshCw className="h-4 w-4 animate-spin" />}
                                    <Switch
                                        id="panel-maintenance"
                                        checked={configurations.panel_maintenance_mode?.value || false}
                                        onCheckedChange={(checked) => handleBooleanChange('panel_maintenance_mode', checked)}
                                        disabled={saving.panel_maintenance_mode}
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
                                Configure the promotional banner and coupon code
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="banner-image">Banner Image URL</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="banner-image"
                                        placeholder="https://example.com/banner.jpg"
                                        value={configurations.app_banner_image?.value || ''}
                                        onChange={(e) => handleStringChange('app_banner_image', e.target.value)}
                                    />
                                    <Button
                                        onClick={() => handleStringSave('app_banner_image')}
                                        disabled={saving.app_banner_image}
                                    >
                                        {saving.app_banner_image ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.app_banner_image && (
                                    <p className="text-sm text-red-500">{errors.app_banner_image}</p>
                                )}
                                {success.app_banner_image && (
                                    <p className="text-sm text-green-500">✓ Updated successfully</p>
                                )}
                            </div>

                            {configurations.app_banner_image?.value && (
                                <div className="flex flex-col gap-2">
                                    <Label>Preview</Label>
                                    <div className="border rounded-lg overflow-hidden max-w-md">
                                        <img
                                            src={configurations.app_banner_image.value}
                                            alt="Banner preview"
                                            className="w-full h-32 object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="coupon-code">Coupon Code</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="coupon-code"
                                        placeholder="WELCOME25"
                                        value={configurations.app_banner_coupon_code?.value || ''}
                                        onChange={(e) => handleStringChange('app_banner_coupon_code', e.target.value)}
                                    />
                                    <Button
                                        onClick={() => handleStringSave('app_banner_coupon_code')}
                                        disabled={saving.app_banner_coupon_code}
                                    >
                                        {saving.app_banner_coupon_code ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.app_banner_coupon_code && (
                                    <p className="text-sm text-red-500">{errors.app_banner_coupon_code}</p>
                                )}
                                {success.app_banner_coupon_code && (
                                    <p className="text-sm text-green-500">✓ Updated successfully</p>
                                )}
                            </div>
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

                {/* Cancellation Settings - Available to both roles */}
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
                    <CardContent>
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
            </div>
        </div>
    );
};

export default ConfigurationsScreen;