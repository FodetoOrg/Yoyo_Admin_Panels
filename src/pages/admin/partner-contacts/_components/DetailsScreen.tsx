import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Hotel, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Hash, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import PageContainer from '@/components/PageContainer';

interface PartnerContact {
  id: string;
  hotelName: string;
  numberOfRooms: number;
  hotelDescription?: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  city: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  submittedAt?: string;
  updatedAt?: string;
  processedBy?: string;
  processedAt?: string;
}

interface Props {
  partnerContact: PartnerContact | null;
  user: any;
  error?: string | null;
}

const PartnerContactDetailsScreen = ({ partnerContact, user, error }: Props) => {
  const [notes, setNotes] = useState(partnerContact?.notes || '');

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'contacted':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <PageContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </PageContainer>
    );
  }

  if (!partnerContact) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Partner contact not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.href = '/admin/partner-contacts'}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{partnerContact.hotelName}</h1>
              <p className="text-muted-foreground">Partner Contact Request</p>
            </div>
          </div>
        <Badge 
          variant="outline" 
          className={`${getStatusColor(partnerContact.status || 'pending')} px-3 py-1`}
        >
          {getStatusIcon(partnerContact.status || 'pending')}
          <span className="ml-2">{partnerContact.status || 'pending'}</span>
          </Badge>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Hotel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Hotel Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Hotel Name</Label>
                    <p className="font-medium text-lg">{partnerContact.hotelName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Number of Rooms</Label>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-lg">{partnerContact.numberOfRooms}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">{partnerContact.address}</p>
                      <p className="text-muted-foreground">{partnerContact.city}</p>
                    </div>
                  </div>
                </div>

                {partnerContact.hotelDescription && (
                  <div>
                    <Label className="text-muted-foreground">Hotel Description</Label>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                      <p className="text-sm">{partnerContact.hotelDescription}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium text-lg">{partnerContact.ownerFullName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${partnerContact.ownerEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {partnerContact.ownerEmail}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${partnerContact.ownerPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {partnerContact.ownerPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Notes */}
           
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label className="text-muted-foreground text-xs">Request ID</Label>
                  <p className="font-mono text-sm">{partnerContact.id}</p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {partnerContact.createdAt || partnerContact.submittedAt
                        ? new Date(partnerContact.createdAt || partnerContact.submittedAt || '').toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {partnerContact.processedAt && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground text-xs">Processed Date</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {new Date(partnerContact.processedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {partnerContact.processedBy && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground text-xs">Processed By</Label>
                      <p className="text-sm">{partnerContact.processedBy}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PartnerContactDetailsScreen;
