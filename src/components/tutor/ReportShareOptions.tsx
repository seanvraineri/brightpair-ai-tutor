import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  Eye,
  Link,
  Loader2,
  Mail,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IS_DEVELOPMENT } from "@/config/env";
import { toast } from "@/hooks/use-toast";
import { logger } from '@/services/logger';

// Interface for the parent object
interface Parent {
  id: string;
  full_name: string;
  email: string;
  relationship: string;
}

// Interface for the report sharing settings
interface ReportShareSetting {
  id: string;
  parent_id: string;
  is_shared: boolean;
  shared_at: string | null;
  viewed_at: string | null;
  auto_expire_at: string | null;
}

// Props for the component
interface ReportShareOptionsProps {
  reportId: string;
  studentId: string;
  studentName: string;
  reportDate: string;
  reportType: string;
  onShareComplete?: () => void;
}

const ReportShareOptions: React.FC<ReportShareOptionsProps> = ({
  reportId,
  studentId,
  studentName,
  reportDate,
  reportType,
  onShareComplete,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parents, setParents] = useState<Parent[]>([]);
  const [shareSettings, setShareSettings] = useState<ReportShareSetting[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // State for sharing options
  const [accessExpiration, setAccessExpiration] = useState<string>("30");
  const [notifyParents, setNotifyParents] = useState<boolean>(true);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [allowDownload, setAllowDownload] = useState<boolean>(true);

  // Report URL to share
  const reportShareBaseUrl = IS_DEVELOPMENT
    ? "http://localhost:8093/reports/view"
    : "https://brightpair.edu/reports/view";

  const reportShareUrl = `${reportShareBaseUrl}/${reportId}`;

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        /*
        // This code is commented out until we properly define the Supabase schema types
        // In production, this would fetch from Supabase
        if (!IS_DEVELOPMENT) {
          // Get parents for this student
          const { data: parentsData, error: parentsError } = await supabase
            .from('parent_student_relationships')
            .select(`
              parent_id,
              parent_profiles:parent_id(
                id,
                full_name,
                email
              )
            `)
            .eq('student_id', studentId);

          if (parentsError) throw parentsError;

          // Get existing share settings for this report
          const { data: shareData, error: shareError } = await supabase
            .from('report_sharing_settings')
            .select('*')
            .eq('report_id', reportId);

          if (shareError) throw shareError;

          // Format the data
          const formattedParents = parentsData.map((item) => ({
            id: item.parent_profiles.id,
            full_name: item.parent_profiles.full_name,
            email: item.parent_profiles.email,
            relationship: 'Parent' // This would come from the relationship field in a real app
          }));

          setParents(formattedParents);
          setShareSettings(shareData);
        }
        */
      } catch (error) {
      logger.debug('Caught error:', error);
        
      
    } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId, studentId]);

  // Handle toggle of parent sharing
  const toggleParentSharing = (parentId: string, isShared: boolean) => {
    setShareSettings((prev) => {
      // Check if setting already exists
      const existingSettingIndex = prev.findIndex((setting) =>
        setting.parent_id === parentId
      );

      if (existingSettingIndex >= 0) {
        // Update existing setting
        const updatedSettings = [...prev];
        updatedSettings[existingSettingIndex] = {
          ...updatedSettings[existingSettingIndex],
          is_shared: isShared,
          shared_at: isShared ? new Date().toISOString() : null,
        };
        return updatedSettings;
      } else {
        // Create new setting
        return [
          ...prev,
          {
            id: `temp-id-${Date.now()}`, // This would be replaced by the server
            parent_id: parentId,
            is_shared: isShared,
            shared_at: isShared ? new Date().toISOString() : null,
            viewed_at: null,
            auto_expire_at: getExpiryDate(accessExpiration),
          },
        ];
      }
    });
  };

  // Calculate expiry date based on days
  const getExpiryDate = (days: string): string => {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(days));
    return date.toISOString();
  };

  // Update all expiry dates
  useEffect(() => {
    if (accessExpiration) {
      setShareSettings((prev) =>
        prev.map((setting) => ({
          ...setting,
          auto_expire_at: getExpiryDate(accessExpiration),
        }))
      );
    }
  }, [accessExpiration]);

  // Handle save of share settings
  const saveShareSettings = async () => {
    try {
      setSaving(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      

      /*
      // This code is commented out until we properly define the Supabase schema types
      // In production, this would save to Supabase
      if (!IS_DEVELOPMENT) {
        // First, create or update share settings
        const { error: shareError } = await supabase
          .from('report_sharing_settings')
          .upsert(
            shareSettings.map(setting => ({
              id: setting.id.startsWith('temp-id') ? undefined : setting.id,
              report_id: reportId,
              parent_id: setting.parent_id,
              is_shared: setting.is_shared,
              shared_at: setting.shared_at,
              auto_expire_at: setting.auto_expire_at,
              shared_url: reportShareUrl
            })),
            { onConflict: 'parent_id,report_id' }
          );

        if (shareError) throw shareError;
      }
      */

      // Call the completion callback
      if (onShareComplete) {
        onShareComplete();
      }

      toast({
        title: "Settings Saved",
        description: "Report sharing settings saved successfully.",
        variant: "default",
      });
    } catch (error) {
      

      toast({
        title: "Error Saving Settings",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(reportShareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get parent details by ID
  const getParentDetails = (parentId: string): Parent | undefined => {
    return parents.find((p) => p.id === parentId);
  };

  // Get view status
  const getViewStatus = (setting: ReportShareSetting): React.ReactNode => {
    if (!setting.is_shared) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Not Shared
        </Badge>
      );
    }

    if (setting.viewed_at) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Viewed on {formatDate(setting.viewed_at)}
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-amber-100 text-amber-800 border-amber-200"
      >
        Not viewed yet
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Report Sharing Options</CardTitle>
        <CardDescription>
          Manage how the report "{reportType}" for {studentName} from{" "}
          {formatDate(reportDate)} is shared with parents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading
          ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brightpair" />
            </div>
          )
          : (
            <>
              {/* Parent Access Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Parent Access</h3>
                  <span className="text-sm text-gray-500">
                    {shareSettings.filter((s) => s.is_shared).length} of{" "}
                    {parents.length} parents have access
                  </span>
                </div>

                <div className="border rounded-md divide-y">
                  {parents.map((parent) => {
                    const setting = shareSettings.find((s) =>
                      s.parent_id === parent.id
                    );
                    const isShared = setting?.is_shared || false;

                    return (
                      <div
                        key={parent.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Switch
                            checked={isShared}
                            onCheckedChange={(checked) =>
                              toggleParentSharing(parent.id, checked)}
                          />
                          <div>
                            <p className="font-medium">{parent.full_name}</p>
                            <p className="text-sm text-gray-500">
                              {parent.relationship} • {parent.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {setting && getViewStatus(setting)}

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyLinkToClipboard()}
                                >
                                  <Copy className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy shareable link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    );
                  })}

                  {parents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No parents associated with this student</p>
                      <Button variant="outline" className="mt-4">
                        Add Parent
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Shareable Link */}
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex space-x-2">
                  <Input
                    value={reportShareUrl}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={copyLinkToClipboard}
                  >
                    {linkCopied
                      ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      )
                      : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This link can be shared with anyone who needs access to this
                  report.
                </p>
              </div>

              {/* Access Expiration */}
              <div className="space-y-2">
                <Label>Access Expiration</Label>
                <RadioGroup
                  value={accessExpiration}
                  onValueChange={setAccessExpiration}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="expire-30" />
                    <Label htmlFor="expire-30" className="font-normal">
                      30 days (Recommended)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="expire-90" />
                    <Label htmlFor="expire-90" className="font-normal">
                      90 days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="365" id="expire-365" />
                    <Label htmlFor="expire-365" className="font-normal">
                      1 year
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="expire-never" />
                    <Label htmlFor="expire-never" className="font-normal">
                      Never expires
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-gray-500">
                  After this period, parents will no longer be able to access
                  the report.
                </p>
              </div>

              {/* Download Options */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-download"
                  checked={allowDownload}
                  onCheckedChange={(checked) =>
                    setAllowDownload(checked as boolean)}
                />
                <Label htmlFor="allow-download" className="font-normal">
                  Allow parents to download the report
                </Label>
              </div>

              {/* Notification Options */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Notification Options</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify-parents"
                    checked={notifyParents}
                    onCheckedChange={(checked) =>
                      setNotifyParents(checked as boolean)}
                  />
                  <Label htmlFor="notify-parents" className="font-normal">
                    Notify parents by email when the report is shared
                  </Label>
                </div>

                {notifyParents && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="custom-message">
                      Add a custom message (optional)
                    </Label>
                    <Textarea
                      id="custom-message"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to include in the email notification..."
                      className="h-20"
                    />
                  </div>
                )}
              </div>
            </>
          )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Eye className="h-3 w-3 mr-1" />
          <span>All report views are tracked</span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            Cancel
          </Button>
          <Button
            onClick={saveShareSettings}
            disabled={saving || loading}
            className="bg-brightpair hover:bg-brightpair-600"
          >
            {saving
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              )
              : (
                "Save & Share"
              )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportShareOptions;
