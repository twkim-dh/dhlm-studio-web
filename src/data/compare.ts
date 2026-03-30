export interface CityComparison {
  slug: string;
  city1: { name: string; flag: string; index: number };
  city2: { name: string; flag: string; index: number };
  items: { item: string; icon: string; price1: string; price2: string; diff: string }[];
  summary: string;
}

export const comparisons: CityComparison[] = [
  {
    slug: 'new-york-vs-los-angeles',
    city1: { name: 'New York', flag: '🗽', index: 100 },
    city2: { name: 'Los Angeles', flag: '🌴', index: 86 },
    items: [
      { item: 'Latte (Café)', icon: '☕', price1: '$5.80', price2: '$5.50', diff: '-5%' },
      { item: 'Rent (1BR, Center)', icon: '🏠', price1: '$3,200', price2: '$2,400', diff: '-25%' },
      { item: 'Monthly Transit', icon: '🚇', price1: '$127', price2: '$100', diff: '-21%' },
      { item: 'Dinner (2 People)', icon: '🍽️', price1: '$110', price2: '$95', diff: '-14%' },
      { item: 'Internet', icon: '📶', price1: '$70', price2: '$65', diff: '-7%' },
      { item: 'Gym Membership', icon: '💪', price1: '$95', price2: '$55', diff: '-42%' },
      { item: 'Groceries (Weekly)', icon: '🛒', price1: '$120', price2: '$100', diff: '-17%' },
    ],
    summary: 'Los Angeles is 14% cheaper than New York overall',
  },
  {
    slug: 'london-vs-tokyo',
    city1: { name: 'London', flag: '🇬🇧', index: 92 },
    city2: { name: 'Tokyo', flag: '🇯🇵', index: 76 },
    items: [
      { item: 'Latte (Café)', icon: '☕', price1: '$5.20', price2: '$4.10', diff: '-21%' },
      { item: 'Rent (1BR, Center)', icon: '🏠', price1: '$2,800', price2: '$1,400', diff: '-50%' },
      { item: 'Monthly Transit', icon: '🚇', price1: '$180', price2: '$80', diff: '-56%' },
      { item: 'Dinner (2 People)', icon: '🍽️', price1: '$95', price2: '$50', diff: '-47%' },
      { item: 'Internet', icon: '📶', price1: '$42', price2: '$38', diff: '-10%' },
    ],
    summary: 'Tokyo is 17% cheaper than London overall',
  },
  {
    slug: 'san-francisco-vs-austin',
    city1: { name: 'San Francisco', flag: '🌉', index: 105 },
    city2: { name: 'Austin', flag: '🤠', index: 71 },
    items: [
      { item: 'Latte (Café)', icon: '☕', price1: '$6.50', price2: '$5.00', diff: '-23%' },
      { item: 'Rent (1BR, Center)', icon: '🏠', price1: '$3,500', price2: '$1,800', diff: '-49%' },
      { item: 'Monthly Transit', icon: '🚇', price1: '$98', price2: '$41', diff: '-58%' },
      { item: 'Dinner (2 People)', icon: '🍽️', price1: '$120', price2: '$75', diff: '-38%' },
      { item: 'Internet', icon: '📶', price1: '$65', price2: '$55', diff: '-15%' },
    ],
    summary: 'Austin is 32% cheaper than San Francisco overall',
  },
  {
    slug: 'singapore-vs-bangkok',
    city1: { name: 'Singapore', flag: '🇸🇬', index: 88 },
    city2: { name: 'Bangkok', flag: '🇹🇭', index: 37 },
    items: [
      { item: 'Latte (Café)', icon: '☕', price1: '$5.50', price2: '$3.20', diff: '-42%' },
      { item: 'Rent (1BR, Center)', icon: '🏠', price1: '$2,600', price2: '$650', diff: '-75%' },
      { item: 'Monthly Transit', icon: '🚇', price1: '$95', price2: '$30', diff: '-68%' },
      { item: 'Dinner (2 People)', icon: '🍽️', price1: '$80', price2: '$25', diff: '-69%' },
      { item: 'Internet', icon: '📶', price1: '$38', price2: '$18', diff: '-53%' },
    ],
    summary: 'Bangkok is 58% cheaper than Singapore overall',
  },
];

export function getComparisonBySlug(slug: string): CityComparison | undefined {
  return comparisons.find(c => c.slug === slug);
}
