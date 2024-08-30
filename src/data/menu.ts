
export type M3MenuSize = 'empty' | 'small' | 'medium' | 'large' | 'huge';
export type M3MenuItemPriority = 'low' | 'normal' | 'high';

export interface M3BadgeConfig {
  value: string;
  variant?: string;
}

export interface M3MenuItemConfig {
  label: string;
  badge?: string | M3BadgeConfig;
  icon?: string;
  hotkey?: string;
  href?: string;
  active?: boolean;
  variant?: 'default' | 'group' | 'fab';
  children?: M3MenuItemConfig[];
  priority?: M3MenuItemPriority;
}

export interface Prioritized {
  priority: M3MenuItemPriority;
}

const menuSizes: Record<M3MenuSize, number> = {
  empty: 0,
  small: 5,
  medium: 7,
  large: 21,
  huge: Infinity
};

export function getMenuSize(items?: M3MenuItemConfig[]): M3MenuSize {
  if (!items) {
    return 'empty';
  }
  for (let size in menuSizes) {
    if (items.length <= menuSizes[size as M3MenuSize]) {
      return size as M3MenuSize;
    }
  }
  return 'large';
}

export interface M3MenuOrganizationOptions {
  max?: M3MenuSize | number | string;
  min?: M3MenuSize | number | string;
  promoteLow?: boolean;
}

/**
 * Flattens and organizes a menu into a prioritized list
 */
export function organizeMenuItems(items: M3MenuItemConfig[], options: M3MenuOrganizationOptions): (M3MenuItemConfig & Prioritized)[] {
  let max = typeof options.max === 'string' ? menuSizes[options.max as M3MenuSize] || parseInt(options.max) : options.max || Infinity;
  let count = 0;

  // Filter out fabs
  items = items.filter(item => item.variant !== 'fab');

  // Allow high priority items up to max, lower the rest
  let results: (M3MenuItemConfig & Prioritized)[] = items.map(item => {
    if (count >= max) {
      return { ...item, priority: 'low' }
    }
    if (item.priority === 'high') {
      count++;
    }
    return { ...item, priority: item.priority as M3MenuItemPriority || 'normal' };
  });

  // Allow further normal priority items up to max, lower the rest
  results = results.map(item => {
    if (count >= max && item.priority === 'normal') {
      return { ...item, priority: 'low' }
    }
    if (item.priority === 'normal') {
      count++;
    }
    return item;
  });

  if (!options.promoteLow) return results;

  // Prompose low priority items up to max
  results = results.map(item => {
    if (count >= max && item.priority === 'low') {
      return { ...item, priority: 'low' }
    }
    count++;
    return { ...item, priority: 'normal' };
  });

  return results;
}