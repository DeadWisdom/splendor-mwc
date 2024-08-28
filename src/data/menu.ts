
export type M3MenuSize = 'empty' | 'short' | 'medium' | 'long';
export type M3MenuItemPriority = 'low' | 'high';

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

export function getMenuSize(items?: M3MenuItemConfig[]): M3MenuSize {
  if (!items || items.length === 0) {
    return 'empty';
  }
  if (items.length <= 4) {
    return 'short';
  }
  if (items.length <= 7) {
    return 'medium';
  }
  return 'long';
}