import { LayoutDashboard, Zap, Clock } from 'lucide-react';


export const MARQUEE_ITEMS = [
  'Project Spaces', 'Real-time Sync', 'Smart Deadlines', 
  'Team Roles', 'Zero Bloat', 'Instant Updates', 
  'Daily Focus', 'Deadline Alerts', 'Clear Ownership',
];

export const STATS = [
  { num: '12k+', label: 'Teams worldwide' },
  { num: '3×', label: 'Faster delivery' },
  { num: '99%', label: 'Uptime guaranteed' },
];

export const FEATURES = [
  {
    num: '01',
    title: 'Clear Project Spaces',
    desc: 'A dedicated space for every goal. Your team always knows what to focus on — no digging through threads or DMs.',
    icon:  <LayoutDashboard className="w-5 h-5 text-primary" />,
  },
  {
    num: '02',
    title: 'Instant Updates',
    desc: 'When a task is done, the whole team sees it. No refreshing. No chasing status in Slack.',
    icon: <Zap className="w-5 h-5 text-primary" />,
  },
  {
    num: '03',
    title: 'Smart Deadlines',
    desc: "Surfaces what's urgent before it's urgent. The right priority, at the right time, every time.",
    icon: <Clock className="w-5 h-5 text-primary" />,
  },
];

export const TASKS = [
  { cat: 'Design', name: 'Redesign the onboarding flow', due: 'Due Today', status: 'active' },
  { cat: 'Engineering', name: 'API rate limiting implementation', due: 'Mar 21', status: 'normal' },
  { cat: 'Copy', name: 'Update pricing page messaging', due: 'Overdue', status: 'late' },
];

export const DONE_TASKS = [
  { cat: 'Product', name: 'Q1 roadmap sign-off', due: 'Done ✓' },
  { cat: 'Engineering', name: 'Deploy v2.3 to production', due: 'Done ✓' },
];
