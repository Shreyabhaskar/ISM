"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthIllustration } from "@/components/illustrations/auth-illustration";
import axios from "axios";
import { apiBaseUrl } from "@/lib/baseUrl";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useUser();
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    axios
      .post(`${apiBaseUrl}/signin`, {
        email,
        password,
      })
      .then((res) => {
        setUser(res.data.user);
        Cookies.set("token", res.data.token);
        router.push("/dashboard/subjects");
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setError(err.response.data.error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center p-4">
        <div className="hidden md:flex flex-col items-center justify-center space-y-4">
          <AuthIllustration />
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600">
            Access your personalized syllabus analysis and study materials
          </p>
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
