import { Target, Zap, Shield, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


export const metadata = {
  title: 'About Us | Task Flow',
  description: 'Learn more about our mission and the team behind Task Flow.',
};

export default function AboutPage() {
  return (
    <>
      <div className="relative min-h-screen w-full pt-10 pb-25 px-4 overflow-hidden bg-background selection:bg-primary/20">
        {/* Background */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(#800020_0.5px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Empowering teams to do their best work
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Task Flow was built with a simple mission: to eliminate the chaos
              of modern work and replace it with clarity, focus, and seamless
              collaboration.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Clarity by Design
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Software shouldn&apos;t compete for your attention. We strip
                  away the visual noise and unnecessary friction so your team
                  can maintain a flow state and focus entirely on the work that
                  matters.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Lightning Fast
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on a modern edge architecture, every interaction in Task
                  Flow is optimized for speed, ensuring your team never waits on
                  the system.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Enterprise Security
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is your most valuable asset. We employ
                  military-grade encryption and strict access controls to keep
                  your workspace completely secure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Built for Teams
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Work doesn&apos;t happen in a vacuum. We built Task Flow from
                  the ground up to support massive organizations, custom roles,
                  and cross-team visibility.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
