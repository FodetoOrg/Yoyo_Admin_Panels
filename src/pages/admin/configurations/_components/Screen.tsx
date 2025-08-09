import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Wrench,
    Smartphone,
    Upload,
    Star,
    ImageIcon,
    CreditCard,
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    X,
    Plus
} from 'lucide-react';

const ConfigurationsScreen = () => {
    const [configurations, setConfigurations] = useState({
        app_maintenance: { value: false, type: 'boolean', description: 'Enable/disable app maintenance mode', category: 'app' },
        panel_maintenance: { value: false, type: 'boolean', description: 'Enable/disable admin panel maintenance mode', category: 'app' },
        update_app: { value: false, type: 'boolean', description: 'Force app update requirement', category: 'app' },
        featured_hotels: { value: [], type: 'array', description: 'Array of featured hotel IDs', category: 'app' },
        app_banner_image: { value: '', type: 'string', description: 'Banner image URL for app', category: 'ui' },
        banner_coupon_code: { value: '', type: 'string', description: 'Coupon code for banner promotion', category: 'ui' },
        online_payment_global_enabled: { value: true, type: 'boolean', description: 'Global online payment enable/disable', category: 'payment' }
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState({});
    const [newHotelId, setNewHotelId] = useState('');

    // Mock data for demonstration - replace with actual API calls
    useEffect(() => {
        // Load configurations from API
        loadConfigurations();
    }, []);

    const loadConfigurations = async () => {
        setLoading(true);
        try {
            // Mock API call - replace with actual implementation
            // const response = await fetch('/api/configurations');
            // const data = await response.json();

            // For demo purposes, using mock data
            setTimeout(() => {
                setConfigurations(prev => ({
                    ...prev,
                    featured_hotels: {
                        ...prev.featured_hotels,
                        value: ['hotel-123', 'hotel-456', 'hotel-789']
                    },
                    app_banner_image: {
                        ...prev.app_banner_image,
                        value: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop'
                    },
                    banner_coupon_code: {
                        ...prev.banner_coupon_code,
                        value: 'WELCOME25'
                    }
                }));
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Failed to load configurations:', error);
            setLoading(false);
        }
    };

    const updateConfiguration = async (key, newValue) => {
        setSaving(prev => ({ ...prev, [key]: true }));

        try {
            // Mock API call - replace with actual implementation
            // const response = await fetch(`/api/configurations/${key}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     value: newValue,
            //     type: configurations[key].type,
            //     description: configurations[key].description,
            //     category: configurations[key].category
            //   })
            // });

            setTimeout(() => {
                setConfigurations(prev => ({
                    ...prev,
                    [key]: { ...prev[key], value: newValue }
                }));
                setSaving(prev => ({ ...prev, [key]: false }));
            }, 500);
        } catch (error) {
            console.error(`Failed to update ${key}:`, error);
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

    const addHotelId = () => {
        if (newHotelId.trim()) {
            const currentHotels = configurations.featured_hotels.value;
            if (!currentHotels.includes(newHotelId.trim())) {
                updateConfiguration('featured_hotels', [...currentHotels, newHotelId.trim()]);
                setNewHotelId('');
            }
        }
    };

    const removeHotelId = (hotelId) => {
        const currentHotels = configurations.featured_hotels.value;
        updateConfiguration('featured_hotels', currentHotels.filter(id => id !== hotelId));
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
        <div className="p-6 flex flex-col gap-6  mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">App Configurations</h1>
                    <p className="text-muted-foreground">Manage application settings and features</p>
                </div>
                <Button onClick={loadConfigurations} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* App Control Settings */}
                <Card className={getStatusColor(configurations.app_maintenance.value, 'boolean')}>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Wrench className="h-5 w-5" />
                            <CardTitle>App Control</CardTitle>
                            {getStatusIcon(configurations.app_maintenance.value || configurations.panel_maintenance.value, 'boolean')}
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
                            </div>
                            <div className="flex items-center space-x-2">
                                {saving.app_maintenance && <RefreshCw className="h-4 w-4 animate-spin" />}
                                <Switch
                                    id="app-maintenance"
                                    checked={configurations.app_maintenance.value}
                                    onCheckedChange={(checked) => handleBooleanChange('app_maintenance', checked)}
                                    disabled={saving.app_maintenance}
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
                            </div>
                            <div className="flex items-center space-x-2">
                                {saving.panel_maintenance && <RefreshCw className="h-4 w-4 animate-spin" />}
                                <Switch
                                    id="panel-maintenance"
                                    checked={configurations.panel_maintenance.value}
                                    onCheckedChange={(checked) => handleBooleanChange('panel_maintenance', checked)}
                                    disabled={saving.panel_maintenance}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="update-app">Force App Update</Label>
                                <p className="text-sm text-muted-foreground">
                                    Require users to update the app before using
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {saving.update_app && <RefreshCw className="h-4 w-4 animate-spin" />}
                                <Switch
                                    id="update-app"
                                    checked={configurations.update_app.value}
                                    onCheckedChange={(checked) => handleBooleanChange('update_app', checked)}
                                    disabled={saving.update_app}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Featured Hotels */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5" />
                            <CardTitle>Featured Hotels</CardTitle>
                        </div>
                        <CardDescription>
                            Manage hotels that appear as featured in the app
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Enter hotel ID"
                                value={newHotelId}
                                onChange={(e) => setNewHotelId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addHotelId()}
                            />
                            <Button onClick={addHotelId} disabled={!newHotelId.trim() || saving.featured_hotels}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {configurations.featured_hotels.value.map((hotelId) => (
                                <Badge key={hotelId} variant="secondary" className="flex items-center space-x-1">
                                    <span>{hotelId}</span>
                                    <button
                                        onClick={() => removeHotelId(hotelId)}
                                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                                        disabled={saving.featured_hotels}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>

                        {configurations.featured_hotels.value.length === 0 && (
                            <p className="text-sm text-muted-foreground">No featured hotels configured</p>
                        )}
                    </CardContent>
                </Card>

                {/* Banner Configuration */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="h-5 w-5" />
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
                                    value={configurations.app_banner_image.value}
                                    onChange={(e) => handleStringChange('app_banner_image', e.target.value)}
                                />
                                <Button
                                    onClick={() => handleStringSave('app_banner_image')}
                                    disabled={saving.app_banner_image}
                                >
                                    {saving.app_banner_image ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {configurations.app_banner_image.value && (
                            <div className="flex flex-col gap-2">
                                <Label>Preview</Label>
                                <div className="border rounded-lg overflow-hidden max-w-md">
                                    <img
                                        src={configurations.app_banner_image.value}
                                        alt="Banner preview"
                                        className="w-full h-32 object-cover"
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
                                    value={configurations.banner_coupon_code.value}
                                    onChange={(e) => handleStringChange('banner_coupon_code', e.target.value)}
                                />
                                <Button
                                    onClick={() => handleStringSave('banner_coupon_code')}
                                    disabled={saving.banner_coupon_code}
                                >
                                    {saving.banner_coupon_code ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Settings */}
                <Card className={getStatusColor(configurations.online_payment_global_enabled.value, 'boolean')}>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <CardTitle>Payment Settings</CardTitle>
                            {getStatusIcon(configurations.online_payment_global_enabled.value, 'boolean')}
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
                            </div>
                            <div className="flex items-center space-x-2">
                                {saving.online_payment_global_enabled && <RefreshCw className="h-4 w-4 animate-spin" />}
                                <Switch
                                    id="online-payment"
                                    checked={configurations.online_payment_global_enabled.value}
                                    onCheckedChange={(checked) => handleBooleanChange('online_payment_global_enabled', checked)}
                                    disabled={saving.online_payment_global_enabled}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>



        </div>
    );
};

export default ConfigurationsScreen;