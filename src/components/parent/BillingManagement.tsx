import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Package,
  PlusCircle,
  ReceiptText,
  Trash2,
} from "lucide-react";

const BillingManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("payment-methods");
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);

  // New card form state
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    isDefault: false,
  });

  const handleAddCard = () => {
    // Validation would happen in production
    toast({
      title: "Card added",
      description: "Your payment method has been added successfully.",
    });

    // Reset form and close dialog
    setNewCard({
      number: "",
      name: "",
      expiry: "",
      cvc: "",
      isDefault: false,
    });
    setIsAddCardDialogOpen(false);
  };

  const handleRemoveCard = (id: string) => {
    toast({
      title: "Card removed",
      description: "Your payment method has been removed.",
    });
  };

  const handleMakeDefaultCard = (id: string) => {
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCardIcon = (brand: string) => {
    if (brand === "visa") return "💳 Visa";
    if (brand === "mastercard") return "💳 Mastercard";
    if (brand === "amex") return "💳 American Express";
    return "💳 Card";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Management</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices & History</TabsTrigger>
          <TabsTrigger value="subscription">Package & Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods for automatic billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment methods content will be populated here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoices & Payment History
              </CardTitle>
              <CardDescription>
                View and download your invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Invoices content will be populated here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Current Tutoring Package
                  </CardTitle>
                  <CardDescription>
                    Your active subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subscription content will be populated here */}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Help content will be populated here */}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Card form content will be populated here */}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCardDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCard}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Package Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Change Tutoring Package</DialogTitle>
            <DialogDescription>
              Select the package that best suits your needs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Package selection content will be populated here */}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPackageDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingManagement;
