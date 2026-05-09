import Image from 'next/image';
import { AccentDot, BtnGhost, BtnPrimary } from '@/components/ui/landing-ui';

export function HeroSection({ heroImg }: { heroImg?: string }) {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 md:px-10">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center py-12">
        {/* left */}
        <div className="flex flex-col items-start animate-fade-in-up">
          {/* badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-sm mb-6 sm:mb-8">
            <AccentDot />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-primary">
              Project Management, Reimagined
            </span>
          </div>

          {/* title */}
          <h1 className="text-[clamp(2.2rem,6vw,5.5rem)] leading-[1.05] sm:leading-[1.05] tracking-tight mb-6 sm:mb-8">
            Work smarter.
            <br />
            Ship{' '}
            <span className="relative inline-block align-baseline">
              <em className="not-italic text-primary">faster.</em>
              <span className="absolute left-0 bottom-0 h-[0.06em] w-0 bg-primary rounded-full animate-underline-flow" />
            </span>
            <br />
            Together.
          </h1>

          <p className="text-sm sm:text-base leading-[1.6] text-muted-foreground max-w-md mb-8 sm:mb-10">
            The focused way to plan projects, track tasks, and hit deadlines.
          </p>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <BtnPrimary aria-label="Go to Sign Up" href="/register">
              Get Started Free →
            </BtnPrimary>
            <BtnGhost aria-label="Go to Login" href="/login">
              Login
            </BtnGhost>
          </div>
        </div>

        {/* right */}
        <div className="relative w-full flex items-center justify-center">
          <div className="relative w-full min-h-75 sm:min-h-87.5 md:min-h-95 lg:min-h-100">
            <Image
              src={heroImg || '/landing-hero.webp'}
              alt="hero-image"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center lg:object-right rounded-sm "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
