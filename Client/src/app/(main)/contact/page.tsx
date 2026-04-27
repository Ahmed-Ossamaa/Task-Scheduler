import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/features/contact/components/contact-form';
import { systemSettingsApi } from '@/features/system-settings/api/system-settings.api';

export const metadata = {
  title: 'Contact Us | Schedio',
  description: 'Get in touch with our team for support or inquiries.',
};


export default async function ContactPage() {
  let settings = null;
  try {
    settings = await systemSettingsApi.getSettings();
  } catch (error) {
    console.error(error,'Failed to load settings for contact page');
  }    
//fallbacks
  const email = settings?.contactEmail || 'support@Schedio.com';
  const phone = settings?.contactPhone || '+20 155 458 0561';
  const city = settings?.contactCityAddress || 'Alexandria, Egypt';
  const street = settings?.contactStreetAddress || '23 Fawzy Moaz St., Smouha';
  return (
    <div className="min-h-screen bg-background pt-10 pb-25 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Get in touch
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question about features, pricing, or anything
            else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Our team is here to help.
                  </p>
                  <a
                    href="mailto:support@taskflow.com"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Office</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Come say hello at our headquarters.
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {street}
                    <br />
                    {city}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Sun-Thu from 9am to 5pm.
                  </p>
                  <a
                    href="tel:+971501234567"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side: Msg Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-xl shadow-black/5 dark:shadow-black/40 bg-card/60 backdrop-blur-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Send us a direct message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
