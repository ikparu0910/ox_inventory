export type ItemData = {
  name: string;
  label: string;
  stack: boolean;
  usable: boolean;
  close: boolean;
  count: number;
  itemType?: 'common' | 'uncommon' | 'epic' | 'rare' | 'legendary' | 'mythic';
  description?: string;
  buttons?: string[];
  ammoName?: string;
  image?: string;
};
