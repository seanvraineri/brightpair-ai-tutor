import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  CreditCard, 
  Download, 
  FileText, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Package, 
  Clock, 
  PlusCircle, 
  Trash2,
  ReceiptText
} from "lucide-react";

// Mock payment methods
const mockPaymentMethods = [
  {
    id: "pm1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: "pm2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 4,
    expYear: 2024,
    isDefault: false
  }
];

// Mock invoices
const mockInvoices = [
  {
    id: "inv1",
    number: "INV-2023-001",
    date: "2023-06-01",
    amount: 150,
    status: "paid",
    description: "Tutoring sessions - May 2023"
  },
  {
    id: "inv2",
    number: "INV-2023-002",
    date: "2023-05-01",
    amount: 150,
    status: "paid",
    description: "Tutoring sessions - April 2023"
  },
  {
    id: "inv3",
    number: "INV-2023-003",
    date: "2023-04-01",
    amount: 120,
    status: "paid",
    description: "Tutoring sessions - March 2023"
  },
  {
    id: "inv4",
    number: "INV-2023-004",
    date: "2023-07-01",
    amount: 150,
    status: "upcoming",
    description: "Tutoring sessions - June 2023"
  }
];

// Mock subscription package
const mockSubscription = {
  id: "sub1",
  name: "Standard Tutoring Package",
  price: 150,
  interval: "month",
  nextBillingDate: "2023-07-01",
  features: [
    "4 one-hour tutoring sessions per month",
    "Unlimited AI tutor access",
    "Progress reports",
    "24/7 parent support",
    "Homework assistance"
  ],
  status: "active"
};

// Other available packages
const availablePackages = [
  {
    id: "pkg1",
    name: "Basic Tutoring",
    price: 99,
    interval: "month",
    features: [
      "2 one-hour tutoring sessions per month",
      "Limited AI tutor access",
      "Basic progress tracking",
      "Email support"
    ]
  },
  {
    id: "pkg2",
    name: "Standard Tutoring",
    price: 150,
    interval: "month",
    features: [
      "4 one-hour tutoring sessions per month",
      "Unlimited AI tutor access",
      "Progress reports",
      "24/7 parent support",
      "Homework assistance"
    ],
    popular: true
  },
  {
    id: "pkg3",
    name: "Premium Tutoring",
    price: 249,
    interval: "month",
    features: [
      "8 one-hour tutoring sessions per month",
      "Unlimited AI tutor access",
      "Advanced analytics and insights",
      "Priority support",
      "Personalized curriculum",
      "SAT/ACT prep materials"
    ]
  }
];

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
    isDefault: false
  });
  
  const handleAddCard = () => {
    // Validation would happen in production
    toast({
      title: "Card added",
      description: "Your payment method has been added successfully."
    });
    
    // Reset form and close dialog
    setNewCard({
      number: "",
      name: "",
      expiry: "",
      cvc: "",
      isDefault: false
    });
    setIsAddCardDialogOpen(false);
  };
  
  const handleRemoveCard = (id: string) => {
    toast({
      title: "Card removed",
      description: "Your payment method has been removed."
    });
  };
  
  const handleMakeDefaultCard = (id: string) => {
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated."
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getCardIcon = (brand: string) => {
    if (brand === 'visa') return '💳 Visa';
    if (brand === 'mastercard') return '💳 Mastercard';
    if (brand === 'amex') return '💳 American Express';
    return '💳 Card';
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
              {mockPaymentMethods.map(method => (
                <div 
                  key={method.id} 
                  className={`p-4 rounded-md border flex justify-between items-center ${method.isDefault ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{getCardIcon(method.brand)}</div>
                    <div>
                      <p className="font-medium">{method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}</p>
                      <p className="text-sm text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline" className="ml-2">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => handleMakeDefaultCard(method.id)}>
                        Set Default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveCard(method.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4" onClick={() => setIsAddCardDialogOpen(true)}>
                <PlusCircle size={16} className="mr-2" />
                Add Payment Method
              </Button>
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
              <div className="space-y-4">
                {mockInvoices.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No invoices found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {mockInvoices.map(invoice => (
                      <div 
                        key={invoice.id} 
                        className="p-4 rounded-md border border-gray-200 flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ReceiptText size={16} className="text-gray-500" />
                            <h4 className="font-medium">{invoice.number}</h4>
                          </div>
                          <p className="text-sm text-gray-500">{invoice.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>{formatDate(invoice.date)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 justify-between">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-lg">{formatCurrency(invoice.amount)}</span>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status === 'paid' ? 'Paid' : invoice.status === 'upcoming' ? 'Upcoming' : 'Overdue'}
                            </Badge>
                          </div>
                          
                          {invoice.status === 'paid' && (
                            <Button variant="outline" size="sm" className="mt-2">
                              <Download size={14} className="mr-1" />
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  <div className="bg-primary/5 p-5 rounded-md border border-primary/20">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{mockSubscription.name}</h3>
                        <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={16} className="text-gray-500" />
                            <span>{formatCurrency(mockSubscription.price)}/{mockSubscription.interval}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-gray-500" />
                            <span>Next billing: {formatDate(mockSubscription.nextBillingDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsPackageDialogOpen(true)}>
                          Change Package
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">What's included:</h4>
                      <ul className="space-y-2">
                        {mockSubscription.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Billing Summary</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly fee</span>
                        <span>{formatCurrency(mockSubscription.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next billing date</span>
                        <span>{formatDate(mockSubscription.nextBillingDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment method</span>
                        <span>Visa •••• 4242</span>
                      </div>
                      
                      <div className="pt-3 border-t mt-3">
                        <div className="flex justify-between font-medium">
                          <span>Next charge</span>
                          <span>{formatCurrency(mockSubscription.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Have questions about your billing or package options?
                  </p>
                  
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Billing FAQ</h4>
                    <ul className="space-y-2">
                      <li className="text-sm">
                        <a href="#" className="text-primary hover:underline">How does billing work?</a>
                      </li>
                      <li className="text-sm">
                        <a href="#" className="text-primary hover:underline">Can I change my payment method?</a>
                      </li>
                      <li className="text-sm">
                        <a href="#" className="text-primary hover:underline">How do I upgrade my package?</a>
                      </li>
                      <li className="text-sm">
                        <a href="#" className="text-primary hover:underline">Cancellation policy</a>
                      </li>
                    </ul>
                  </div>
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
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input 
                id="card-name" 
                value={newCard.name}
                onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                placeholder="Name as it appears on card"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input 
                id="card-number" 
                value={newCard.number}
                onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input 
                  id="card-expiry" 
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                  placeholder="MM/YY"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input 
                  id="card-cvc" 
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                  placeholder="123"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="make-default" 
                checked={newCard.isDefault}
                onCheckedChange={(checked) => 
                  setNewCard({...newCard, isDefault: checked as boolean})
                }
              />
              <label
                htmlFor="make-default"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make this my default payment method
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardDialogOpen(false)}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePackages.map(pkg => (
                <Card 
                  key={pkg.id} 
                  className={`border ${pkg.popular ? 'border-primary' : ''} ${pkg.id === mockSubscription.id ? 'bg-primary/5' : ''}`}
                >
                  <CardHeader className="pb-2">
                    {pkg.popular && (
                      <Badge className="mb-2 bg-primary text-white">Popular</Badge>
                    )}
                    <CardTitle className="text-base">{pkg.name}</CardTitle>
                    <CardDescription>
                      <span className="text-xl font-bold">${pkg.price}</span>
                      <span className="text-xs">/{pkg.interval}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="text-xs space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-green-600 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      variant={pkg.id === mockSubscription.id ? "outline" : "default"}
                    >
                      {pkg.id === mockSubscription.id ? "Current Plan" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingManagement; 