import { Mic } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AuthPageHeader({ isLogin }) {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-foreground rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight">
              VoiceAuth
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              Secure Voice ID
            </span>
          </div>
        </div>
      </div>
      <CardTitle className="font-serif text-2xl">
        {isLogin ? "Welcome Back" : "Create Account"}
      </CardTitle>
      <CardDescription>
        {isLogin ? "Sign in to your account" : "Get started with VoiceAuth"}
      </CardDescription>
    </CardHeader>
  );
}
