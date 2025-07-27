// app/reset-password/reset-password-form.tsx

"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasTokens, setHasTokens] = useState(false);
  const [isCheckingTokens, setIsCheckingTokens] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for tokens in URL on component mount
  useEffect(() => {
    const checkTokens = async () => {
      console.log("Checking URL parameters...");

      // Method 1: Check URL parameters
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Session set error:", error);
            setError("Failed to authenticate reset link. Please try again.");
            setHasTokens(false);
          } else {
            console.log("Session set successfully:", data);
            setHasTokens(true);
          }
        } catch (err) {
          console.error("Exception setting session:", err);
          setError("Failed to process reset link.");
          setHasTokens(false);
        }
      } else {
        // Method 2: Check URL hash
        console.log("No tokens in query params, checking hash...");
        const hash = window.location.hash;
        console.log("Current hash:", hash);

        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const hashAccessToken = hashParams.get("access_token");
          const hashRefreshToken = hashParams.get("refresh_token");

          console.log(
            "Hash access token:",
            hashAccessToken ? "Present" : "Not found"
          );
          console.log(
            "Hash refresh token:",
            hashRefreshToken ? "Present" : "Not found"
          );

          if (hashAccessToken && hashRefreshToken) {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: hashAccessToken,
                refresh_token: hashRefreshToken,
              });

              if (error) {
                console.error("Hash session set error:", error);
                setError(
                  "Failed to authenticate reset link. Please try again."
                );
                setHasTokens(false);
              } else {
                console.log("Hash session set successfully:", data);
                setHasTokens(true);
              }
            } catch (err) {
              console.error("Exception setting hash session:", err);
              setError("Failed to process reset link.");
              setHasTokens(false);
            }
          } else {
            // Method 3: Check if user is already authenticated
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (session) {
              console.log("Existing session found");
              setHasTokens(true);
            } else {
              console.log("No session found");
              setError(
                "Invalid or expired password reset link. Please request a new one."
              );
              setHasTokens(false);
            }
          }
        } else {
          // Check for existing session as fallback
          console.log("No hash found, checking existing session...");
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            console.log("Existing session found");
            setHasTokens(true);
          } else {
            console.log("No session found");
            setError(
              "Invalid or expired password reset link. Please request a new one."
            );
            setHasTokens(false);
          }
        }
      }

      setIsCheckingTokens(false);
    };

    checkTokens();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError(updateError.message);
      } else {
        setSuccess(
          "Your password has been reset successfully! Redirecting to login..."
        );

        // Clear form
        setPassword("");
        setConfirmPassword("");

        // Redirect after success
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Exception updating password:", err);
      setError("Failed to update password. Please try again.");
    }

    setLoading(false);
  };

  // Show loading while checking tokens
  if (isCheckingTokens) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Verifying Reset Link</CardTitle>
            <CardDescription>
              Please wait while we verify your password reset link...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if no valid tokens
  if (!hasTokens) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              {error || "The password reset link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link from the login page.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
