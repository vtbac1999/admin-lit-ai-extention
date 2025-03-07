import { rootPaths } from './paths';

export interface SubMenuItem {
  subheader: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: number | string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 1,
    subheader: 'Dashboard',
    path: rootPaths.root,
    icon: 'ic:round-home',
    active: true,
  },
  {
    id: 2,
    subheader: 'Prompt',
    path: 'prompt',
    icon: 'ic:round-bar-chart',
  },
  {
    id: 3,
    subheader: 'Members',
    path: 'member',
    icon: 'ic:baseline-person',
  },
  {
    id: 4,
    subheader: 'Users',
    path: 'user',
    icon: 'ic:baseline-person',
  },
  {
    id: 5,
    subheader: 'Pricing Plan',
    path: 'pricing-plan',
    icon: 'ic:baseline-price-check',
  },
  {
    id: 6,
    subheader: 'Subscription',
    path: 'subscription',
    icon: 'ic:baseline-attach-money',
  },
];

export default sitemap;
