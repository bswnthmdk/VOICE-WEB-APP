import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ onSubmit, onForgotPassword }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter username" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Button>
    </form>
  );
}
