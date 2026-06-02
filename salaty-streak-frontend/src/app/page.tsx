import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, BookOpen, TrendingUp, Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Salaty Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="h-12">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Build your prayer
              <span className="text-primary"> consistency</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Track your daily prayers, maintain streaks, earn points, and build a lasting habit of prayer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base px-8 w-full sm:w-auto">
                  Start Tracking
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 text-base px-8 w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Stay on track</h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Prayers</h3>
                <p className="text-muted-foreground text-sm">
                  Log each of your 5 daily prayers with status: on time, late, or missed.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/15 text-accent-foreground mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Earn Points</h3>
                <p className="text-muted-foreground text-sm">
                  Get rewarded for consistency. Earn bonus points for mosque prayers and Fajr on time.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/15 text-accent-foreground mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Build Streaks</h3>
                <p className="text-muted-foreground text-sm">
                  Complete all 5 prayers daily to maintain your streak and track your best record.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Salaty Streak. Made with ❤️ for the Muslim Ummah.
        </div>
      </footer>
    </div>
  );
}