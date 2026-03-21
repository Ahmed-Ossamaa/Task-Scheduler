import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-footer border-t border-border pt-8 pb-8 px-6 md:px-12">
      <div className="mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
         <div className="col-span-2 flex flex-col gap-4">
            <Link href={'/'} >
            <span className="text-md font-bold tracking-[0.15em] uppercase text-footer-foreground">
              Task
              <span className="text-footer-foreground/70 hover:text-footer-foreground ">Flow</span>
            </span>
            </Link>
            <p className="text-[15px] text-footer-foreground/70 leading-[1.8] max-w-70">
              The focused way to plan projects, track tasks, and hit deadlines. Built for teams who want to get things done without the bloat.
            </p>
          </div>



          {/* Links Column */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-footer-foreground mb-2">Company</h4>
            <Link href="/about" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">About Us</Link>
            <Link href="/blog" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Blog</Link>
            <Link href="/contact" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Contact</Link>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-footer-foreground mb-2">Legal</h4>
            <Link href="/privacy" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[13px] text-footer-foreground/70 hover:text-footer-foreground transition-colors">Terms of Service</Link>
          </div>
          
        </div>

        {/* Bottom */}
        <div className="flex justify-center pt-8 border-t border-border gap-4">
          <span className="text-[11px] font-medium text-footer-foreground/70">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}