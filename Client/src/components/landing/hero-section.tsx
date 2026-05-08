import Image from 'next/image';
import { AccentDot, BtnGhost, BtnPrimary } from '@/components/ui/landing-ui';

export function HeroSection({ heroImg }: { heroImg?: string }) {
  return (
    <section className="relative flex flex-col justify-center  px-6 md:px-10  overflow-hidden">
      <div className="  relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        {/* right */}
        <div className=" flex flex-col items-start animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3.5 py-1.5 rounded-sm mb-8">
            <AccentDot />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
              Project Management, Reimagined
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[clamp(48px,6vw,90px)] leading-[0.95] tracking-tighter mb-8">
            Work smarter.
            <br />
            Ship{' '}
            <span className="relative inline-block">
              <em className="not-italic text-primary">faster.</em>
              <span className="absolute -bottom-px h-0.5 md:-bottom-1 left-0 md:h-1 bg-primary rounded-full animate-underline-flow" />
            </span>
            <br />
            Together.
          </h1>

          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-muted-foreground max-w-md mb-10">
            The focused way to plan projects, track tasks, and hit deadlines.
          </p>

          <div className="flex flex-wrap gap-4">
            <BtnPrimary href="/register">Get Started Free →</BtnPrimary>
            <BtnGhost href="/login">Login</BtnGhost>
          </div>
        </div>

        {/* right */}
        <div className="relative w-full flex items-center justify-center">
          <div className="relative w-full min-h-75  sm:min-h-87.5 md:min-h-95 ">
            <Image
              src={heroImg || '/landing-hero.webp'}
              alt="hero"
              fill
              sizes="(max-width: 1024) 100vw, 50vw"
              priority
              className="object-cover object-center lg:object-right rounded-sm "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
