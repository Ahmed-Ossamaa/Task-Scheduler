import { SystemSettingsValues } from '@/lib/schema/system-settings-schema';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube,FaTiktok  } from 'react-icons/fa';

interface FooterProps {
  appName: string;
  settings: SystemSettingsValues;
}
export function Footer({ appName, settings }: FooterProps) {
  return (
    <footer className="bg-footer border-t border-border pt-8 pb-8 px-6! md:px-12">
      <div className="mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
         <div className="col-span-2 flex flex-col gap-4">
            <Link href={'/'} className=' max-w-min' >
              <span className="text-md font-bold tracking-[0.15em] uppercase text-footer-foreground hover:opacity-80">
                {appName}
              </span>
            </Link>
            <p className="text-[15px] text-footer-foreground/70 leading-[1.8] max-w-70">
              The focused way to plan projects, track tasks, and hit deadlines. Built for teams who want to get things done without the bloat.
            </p>
            {settings?.contactEmail && (
              <p className="text-sm font-medium text-footer-foreground/90">
               <a href={`mailto:${settings.contactEmail}`} className="hover:underline">{settings.contactEmail}</a>
              </p>
            )}
          </div>



          {/* Links Column 1 */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-footer-foreground mb-2">Company</h4>
            <Link href="/about" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">About Us</Link>
            <Link href="/blog" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Blog</Link>
            <Link href="/contact" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Contact</Link>
          </div>

          {/* Links Column 2*/}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-footer-foreground mb-2">Legal</h4>
            <Link href="/privacy" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Terms of Service</Link>
          </div>
          
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-center pt-4 border-t border-border gap-4">
          {/* Social */}
          <div className="flex items-center gap-5">
            {settings?.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            )}
            {settings?.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaTwitter className="h-5 w-5" />
                <span className="sr-only">X (Twitter)</span>
              </a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            )}
            {settings?.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaYoutube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            )}
            {settings?.ticktokUrl && (
              <a href={settings.ticktokUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaTiktok className="h-5 w-5" />
                <span className="sr-only">TickTok</span>
              </a>
            )}
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                <FaLinkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
          </div>
          <span className="text-[11px] font-medium text-footer-foreground/70">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}