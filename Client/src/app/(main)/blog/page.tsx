import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCachedSystemSettings } from '@/features/system-settings/api/get-cached-settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSystemSettings();
  return {
    title: 'Blog',
    description: `Latest news and updates from ${settings.appName}`,
  };
}
/**
 * static data for now (no API integration yet, maybe later)
 * no actual sub pages for articles (maybe later)
 */

const STATIC_POSTS = [
  {
    id: '1',
    title: 'Getting Started with Schedio',
    excerpt: 'Learn how to set up your workspace and invite your first team members in under 5 minutes.',
    category: 'Tutorial',
    readTime: '4 min read',
    date: 'April 28, 2026',
    slug: 'getting-started', 
  },
  {
    id: '2',
    title: 'The Future of Scheduling in 2026',
    excerpt: 'Explore the upcoming trends in team management and how AI is changing the way we work.',
    category: 'Industry News',
    readTime: '7 min read',
    date: 'April 24, 2026',
    slug: 'future-of-scheduling',
  },
  {
    id: '3',
    title: 'New Feature: Advanced Analytics',
    excerpt: 'We are going to launch a brand new analytics dashboard to help you track your team productivity.',
    category: 'Product Update',
    readTime: '3 min read',
    date: 'April 15, 2026',
    slug: 'advanced-analytics-update',
  },
];

export default async function BlogPage() {
  const settings = await getCachedSystemSettings();

  return (
    <main className="container mx-auto px-6 py-16  max-w-full">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          The {settings.appName || 'Schedio'} Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover the latest product updates, tutorials, and industry insights from our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATIC_POSTS.map((post) => (
          <Card key={post.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-3">
                <Badge variant="secondary" className="hover:bg-secondary">
                  {post.category}
                </Badge>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-base">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grow">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 border-t">
              <Link 
                href={`/blog/${post.slug}`} 
                className="flex items-center text-primary font-medium hover:underline w-full group"
              >
                Read Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}