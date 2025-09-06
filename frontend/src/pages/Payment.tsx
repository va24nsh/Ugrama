import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "razorpay">("razorpay");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const coursePrice = localStorage.getItem("course_price") || "199";
  const courseName = "Full-Stack Web Development Mastery";

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      // Simulate RazorPay integration
      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to your new course! Redirecting to course module...",
      });
      
      setTimeout(() => {
        navigate("/course-module");
      }, 2000);
    } else {
      // Card payment validation
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Payment Successful! 🎉",
        description: "Welcome to your new course! Redirecting to course module...",
      });
      
      setTimeout(() => {
        navigate("/course-module");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-foreground mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure checkout powered by Ugram</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Summary */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-ugram-green" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-ugram-purple p-4 rounded-lg border-2 border-foreground">
                <h3 className="font-bold text-lg mb-2">{courseName}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  by Sarah Chen • 12 weeks • 48 lessons
                </p>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Course Price:</span>
                  <span className="text-ugram-green">${coursePrice}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${coursePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span>$0</span>
                </div>
                <div className="border-t-2 border-foreground pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-ugram-green">${coursePrice}</span>
                </div>
              </div>

              <div className="bg-ugram-yellow p-3 rounded-lg border-2 border-foreground">
                <p className="text-sm font-semibold">✅ What's Included:</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Lifetime access to course materials</li>
                  <li>• Certificate of completion</li>
                  <li>• 1-on-1 mentorship sessions</li>
                  <li>• Access to exclusive community</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-ugram-blue" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-primary bg-primary/10 shadow-brutal"
                      : "border-muted hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">RazorPay</p>
                      <p className="text-sm text-muted-foreground">UPI, Cards, Wallets & more</p>
                    </div>
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      PAY
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 shadow-brutal"
                      : "border-muted hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </button>
              </div>

              {/* Card Details Form (shown when card is selected) */}
              {paymentMethod === "card" && (
                <div className="space-y-4 border-t-2 border-foreground pt-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value }))}
                      className="border-2 border-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="border-2 border-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="border-2 border-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                        className="border-2 border-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <Button
                variant="brutal"
                size="lg"
                className="w-full bg-ugram-green text-white text-lg"
                onClick={handlePayment}
              >
                {paymentMethod === "razorpay" ? "Pay with RazorPay" : "Pay Now"} • ${coursePrice}
              </Button>

              {/* Security Notice */}
              <div className="bg-muted p-3 rounded-lg border-2 border-foreground text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Your payment information is encrypted and secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/recommendations")}
            className="border-2 border-foreground"
          >
            ← Back to Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;