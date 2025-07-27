// src/components/login-form.tsx

"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react"; // For managing component state
import { supabase } from "@/lib/supabase"; // Supabase client
import { useRouter } from "next/navigation"; // userRouter for navigation

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [userName, setUserName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and signup
  const [loading, setLoading] = useState(false); // State for loading state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          router.replace("/task-bar");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking user session: ", error);
        setError("Failed to verify session. Please try again.");
        setLoading(false);
      }
    };

    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          //User just signed in
          router.replace("/task-bar");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password");
      }
    } else {
      //Redirect to dashboard on successful login
      router.push("/task-bar");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userName,
          full_name: userName,
          avatar_url:
            "https://www.flaticon.com/free-icon/gorilla_9308979?term=avatar&page=1&position=86&origin=tag&related_id=9308979",
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setIsSignUp(false);
      setShowSuccessMessage(true);
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSuccessMessage(false);

    const resetPasswordUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setShowSuccessMessage(true);
      setError(null);
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <a
            href="#"
            className="flex items-center gap-2 justify-center font-medium text-2xl mb-5"
          >
            <div className="">
              <img src="/icons/icon.png" alt="" className="h-12 w-12" />
            </div>
            TaskM
          </a>
          {showSuccessMessage && (
            <div className="bg-green-50 dark:bg-green-700 border border-green-200 dark:border-green-800 rounded-md p-3 mb-2">
              <p className="text-black-800 dark:text-sm font-medium">
                Account request processed
              </p>
              <p className="text-black-700 text-xs mt-1">
                • If this is a new email, check your inbox for confirmation
                <br />• If you already have an account, please log in below
              </p>
            </div>
          )}
          <CardTitle>
            {showForgotPassword
              ? "Forgot Password"
              : isSignUp
              ? "Create an Account"
              : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {showForgotPassword
              ? "Enter your email to receive a password reset link"
              : isSignUp
              ? "Enter you email and password to create an account"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              showForgotPassword
                ? handleForgotPassword
                : isSignUp
                ? handleSignUp
                : handleLogin
            }
          >
            <div className="flex flex-col gap-6">
              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    type="name"
                    placeholder="John Doe"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" hidden={showForgotPassword}>
                    Password
                  </Label>
                  {!isSignUp && !showForgotPassword && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError(null);
                        setShowSuccessMessage(false);
                      }}
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required={!showForgotPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hidden={showForgotPassword}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
              {/* Display error */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Loading..."
                    : showForgotPassword
                    ? "Send Reset Link"
                    : isSignUp
                    ? "Sign Up"
                    : "Login"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full hidden"
                  disabled={loading}
                >
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {showForgotPassword ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setShowSuccessMessage(false);
                    setEmail("");
                    setPassword("");
                  }}
                  className="underline underline-offset-4"
                >
                  Back to Login
                </button>
              ) : isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                      setShowSuccessMessage(false);
                    }}
                    className="underline underline-offset-4"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError(null);
                      setShowSuccessMessage(false);
                    }}
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
