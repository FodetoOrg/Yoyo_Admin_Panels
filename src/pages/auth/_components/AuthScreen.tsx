import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  auth,
  setupRecaptcha,
  PhoneAuthProvider,
  signInWithCredential,
} from "@/lib/utils/firebase";
import { signInWithPhoneNumber, signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { apiService, setCookie, type ApiResponse } from "@/lib/utils/api";
import { CONSTANTS, ROUTES } from "@/lib/utils/constants";

const AuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");

  const isValidPhoneNumber = (number: string) => {
    return number.length === 10 && /^\d+$/.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
    setError("");
  };

  const handleSendOtp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+91${phoneNumber}`; // Adding India country code
      const recaptchaVerifier = setupRecaptcha(formattedPhone);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);

      // Get the ID token
      const idToken = await result.user.getIdToken();

      console.log('idToken ', idToken)
      // setCookie


      // Send token to backend
      // const response = await apiService.login(idToken)
      const response: ApiResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }> = await apiService.post(ROUTES.LOGIN_ROUTE, {
        idToken: idToken,
      });

      if (!response.success) {
        setError(response.error || "Failed to login");
        return;
      }
      setCookie(CONSTANTS.ACCESS_TOKEN_KEY, response.data.accessToken);
      setCookie(CONSTANTS.REFRESH_TOKEN_KEY, response.data.refreshToken);
      setCookie(CONSTANTS.USER, JSON.stringify(response.data.user))
      
      window.location.href = "/";
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Phone Authentication</CardTitle>
          <CardDescription>
            {showOtpInput
              ? "Enter the OTP sent to your phone"
              : "Enter your 10-digit phone number"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {!showOtpInput ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {/* <span className="text-sm font-medium">+91</span> */}
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      className={error ? "border-red-500" : ""}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <Button
                  className="w-full "
                  onClick={handleSendOtp}
                  disabled={
                    loading ||
                    phoneNumber.length !== 10 ||
                    !isValidPhoneNumber(phoneNumber)
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}
          </div>
          <div id="recaptcha-container" className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;
