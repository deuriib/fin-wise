import { Button } from "@/components/ui/button";
import { FinWiseLogo } from "@/components/icons/logo";
import { ArrowRight, BarChart, BrainCircuit, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm shrink-0">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <FinWiseLogo className="h-8 w-auto" />
          <span className="sr-only">FinWise</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link
              href="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Take Control of Your Finances with <span className="text-primary">FinWise</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    An intuitive, secure, and powerful app for tracking expenses, managing budgets, and gaining actionable insights into your financial health.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup" prefetch={false}>
                      Sign Up for Free
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="finance dashboard illustration"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From smart budgeting to AI-powered insights, FinWise gives you the tools to achieve your financial goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-0 bg-transparent flex flex-col">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                  <div className="bg-accent rounded-full p-3">
                    <Wallet className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Smart Budgeting</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Create custom budgets that are easy to track. Get alerts before you overspend and stay on top of your financial goals.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow border-0 bg-transparent flex flex-col">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                   <div className="bg-accent rounded-full p-3">
                    <BarChart className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Expense Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Effortlessly log every transaction. Categorize your spending to see where your money is going and identify savings opportunities.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow border-0 bg-transparent flex flex-col">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                   <div className="bg-accent rounded-full p-3">
                    <BrainCircuit className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Receive personalized recommendations and a Financial Wellness Score to gamify your financial journey and make better decisions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 FinWise. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
