import { Banner } from '@/components/landing/banner';
import { Features } from '@/components/landing/features';
import { HeroSection } from '@/components/landing/hero-section';
import { Marquee } from '@/components/landing/marquee';
import { Stats } from '@/components/landing/stats';
import { TasksPreview } from '@/components/landing/tasks-preview';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export const metadata = {
  title: {
    absolute: 'Schedio — Project & Task Management for Teams',
  },
  description:
    'Plan projects,manage and track tasks, and collaborate with your team using Schedio.',
};

export default async function LandingPage() {
  const settings = await getCachedSystemSettings();
  const heroImg = settings.landingPageImage as string | undefined;
  const banner = settings.banner as string | undefined;

  return (
    <>
      {banner && (
        <div className="fixed top-13 w-full z-100">
          <Banner text={banner} />
        </div>
      )}
      <div className=" bg-background text-foreground selection:bg-primary/20">
        <HeroSection heroImg={heroImg} />
        <Marquee />
        <Stats />
        <Features />
        <TasksPreview />
      </div>
    </>
  );
}
