import { Button } from "@/components/ui/button";
import { FinWiseLogo } from "@/components/icons/logo";
import { ArrowRight, BarChart, BrainCircuit, Goal, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm shrink-0 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="flex-1 flex justify-start">
          <Link href="#" className="flex items-center" prefetch={false}>
            <FinWiseLogo className="h-8 w-auto" />
            <span className="sr-only">FinWise</span>
          </Link>
        </div>
        <nav className="hidden lg:flex flex-1 justify-center gap-6">
           <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              How It Works
            </Link>
             <Link
              href="/signup"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Testimonials
            </Link>
        </nav>
        <div className="flex-1 flex justify-end gap-4">
          <Button variant="ghost" asChild>
            <Link
              href="/login"
              className="text-sm font-medium"
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
        </div>
      </header>
      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32">
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
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
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
              <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
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
              <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
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
               <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                  <div className="bg-accent rounded-full p-3">
                    <TrendingUp className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Visual Reports</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Analyze your spending trends with beautiful, easy-to-understand charts and graphs. Make informed decisions at a glance.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                   <div className="bg-accent rounded-full p-3">
                    <Goal className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Goal Setting</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Define your financial goals, from saving for a vacation to paying off debt, and track your progress every step of the way.</p>
                </CardContent>
              </Card>
              <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col bg-card">
                <CardHeader className="flex flex-col items-center text-center gap-4">
                   <div className="bg-accent rounded-full p-3">
                    <ShieldCheck className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Bank-Level Security</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <p>Your financial data is encrypted and protected with the highest security standards, so you can have peace of mind.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-medium">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Get Started in 3 Easy Steps</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start managing your finances in minutes. It's simple, fast, and secure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up for free in less than a minute. All you need is an email address.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">Add Your Transactions</h3>
                <p className="text-muted-foreground">Log your income and expenses. Connect your accounts for automatic tracking.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-16 w-16 mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold font-headline mb-2">Achieve Your Goals</h3>
                <p className="text-muted-foreground">Set budgets, get insights, and watch your financial wellness grow.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">What Our Users Say</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from real people who have transformed their financial lives with FinWise.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-8">
              <Card className="bg-card shadow-md">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"FinWise has been a game-changer for me. I finally feel in control of my money and I'm saving more than ever before!"</p>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person portrait" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Jane Doe</p>
                      <p className="text-sm text-muted-foreground">Freelance Designer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-md">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"The AI insights are incredibly helpful. It's like having a personal financial advisor in my pocket. Highly recommended!"</p>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person portrait" />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Mark Smith</p>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-md">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">"I love the budgeting feature. It’s so simple to set up and it keeps me accountable. I’ve cut my unnecessary spending by 20%."</p>
                   <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person portrait" />
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sarah Kim</p>
                      <p className="text-sm text-muted-foreground">Marketing Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Ready to Transform Your Finances?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are building a better financial future with FinWise. Sign up today—it’s free!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                 <Button size="lg" asChild>
                    <Link href="/signup" prefetch={false}>
                      Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="bg-secondary/50">
        <div className="container py-12 px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4 md:col-span-1">
              <Link href="#" className="flex items-center" prefetch={false}>
                <FinWiseLogo className="h-8 w-auto" />
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Take control of your finances with smart budgeting and insightful analysis.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Product</h4>
                <nav className="grid gap-2">
                  <Link href="#features" className="text-sm hover:underline" prefetch={false}>Features</Link>
                  <Link href="/signup" className="text-sm hover:underline" prefetch={false}>Pricing</Link>
                  <Link href="#how-it-works" className="text-sm hover:underline" prefetch={false}>How it Works</Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Company</h4>
                <nav className="grid gap-2">
                  <Link href="#" className="text-sm hover:underline" prefetch={false}>About Us</Link>
                  <Link href="#" className="text-sm hover:underline" prefetch={false}>Contact</Link>
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Legal</h4>
                <nav className="grid gap-2">
                  <Link href="/terms" className="text-sm hover:underline" prefetch={false}>
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-sm hover:underline" prefetch={false}>
                    Privacy Policy
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            &copy; 2024 FinWise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
