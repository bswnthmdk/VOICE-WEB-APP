import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm({ onSubmit, onBack }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Send Reset Link
      </Button>

      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back to Login
      </Button>
    </form>
  );
}
