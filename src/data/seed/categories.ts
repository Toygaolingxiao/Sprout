import type { CategoryId } from '@/types';

export const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'procedure', label: '手続き', icon: 'FileText', color: '#6366f1' },
  { id: 'shopping', label: '買い物', icon: 'ShoppingCart', color: '#f59e0b' },
  { id: 'health', label: '健康', icon: 'Heart', color: '#ef4444' },
  { id: 'money', label: 'お金', icon: 'Wallet', color: '#10b981' },
  { id: 'other', label: 'その他', icon: 'MoreHorizontal', color: '#6b7280' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  (typeof CATEGORIES)[number]
>;
