import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mic, Shield, Zap, ChevronRight, Moon, Sun } from "lucide-react";
import Link from "@/components/ui/link";
import { useTheme } from "@/components/theme-provider";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm transition-all duration-300 ${
          isScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
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

          <nav
            className={`hidden md:flex items-center gap-8 transition-all duration-300 ${
              isScrolled
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          >
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Key Features
            </button>
            <button
              onClick={() => scrollToSection("unique")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Why VoiceAuth
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button
                size={isScrolled ? "sm" : "default"}
                className="transition-all duration-300"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 pt-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Voice Authentication
            <span className="block text-muted-foreground">Reimagined</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Secure, seamless, and sophisticated voice-based authentication
            system that transforms how users access your applications.
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced voice recognition technology meets modern security
            standards
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">
                Voice Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Advanced AI-powered voice recognition with 99.9% accuracy rate
                and real-time processing capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">
                Bank-Grade Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Military-grade encryption and biometric voice patterns ensure
                your authentication is completely secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">
                Lightning Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-base leading-relaxed">
                Authenticate in under 2 seconds with our optimized voice
                processing algorithms and edge computing.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Unique Section */}
      <section id="unique" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-8">
              Why VoiceAuth is Unique
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold">
                  Dual-Role Architecture
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Separate admin and user authentication flows with unique lock
                  and panel ID systems for enterprise-grade access control.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold">
                  Voice Biometrics
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike traditional passwords, voice patterns are unique to
                  each individual and impossible to replicate or steal.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold">
                  Real-time Management
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live dashboard for admins to manage locks, users, and monitor
                  authentication activity in real-time.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold">
                  Zero-Knowledge Architecture
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Voice patterns are processed locally and never stored on
                  servers, ensuring complete privacy and security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold">
                How secure is voice authentication compared to passwords?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Voice authentication is significantly more secure than
                passwords. Voice patterns are unique biometric identifiers that
                cannot be guessed, stolen, or replicated. Our system uses
                advanced AI to analyze over 100 vocal characteristics, making it
                virtually impossible to spoof.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold">
                What happens if I have a cold or my voice changes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our AI system is trained to recognize your voice even with
                temporary changes like colds, allergies, or fatigue. The system
                analyzes fundamental vocal characteristics that remain
                consistent regardless of minor voice variations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold">
                Can someone record my voice and use it to authenticate?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. Our system includes liveness detection that can distinguish
                between live speech and recordings. Additionally, we use dynamic
                challenge phrases that change with each authentication attempt,
                making replay attacks impossible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold">
                How do Admin and User roles differ?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Admins have unique Lock IDs and can manage multiple locks, view
                connected users, and access administrative features. Users have
                Panel IDs and connect to admin-managed systems. This dual
                architecture provides enterprise-level access control and
                management capabilities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold">
                Is my voice data stored on your servers?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. We use a zero-knowledge architecture where voice patterns
                are processed locally on your device and converted to encrypted
                mathematical representations. No actual voice recordings are
                ever stored or transmitted to our servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
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
            <p className="text-muted-foreground mt-4 md:mt-0">
              © 2024 VoiceAuth. Secure voice authentication for the modern
              world.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
