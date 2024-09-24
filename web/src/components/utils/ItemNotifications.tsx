import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import Fade from './transitions/Fade';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = React.forwardRef(
  (props: { item: ItemNotificationProps; style?: React.CSSProperties }, ref: React.ForwardedRef<HTMLDivElement>) => {
    const slotItem = props.item.item;

    const getGradientItem = () => {
      if (Items[slotItem.name] && Items[slotItem.name]?.itemType) {
        return gradientItemType[Items[slotItem.name].itemType || 'common'];
      }
    };

    const gradientItemType = {
      common: 'radial-gradient(circle, rgba(76,175,80,0.5) 50%, rgba(76,175,80,1) 100%',
      uncommon: 'radial-gradient(circle, rgba(33,150,243,0.5) 50%, rgba(33,150,243,1) 100%)',
      rare: 'radial-gradient(circle, rgba(156,39,176,0.5) 50%, rgba(156,39,176,1) 100%)',
      epic: 'radial-gradient(circle, rgba(255,152,0,0.5) 50%, rgba(255,152,0,1) 100%)',
      legendary: 'radial-gradient(circle, rgba(255,235,59,0.5) 50%, rgba(255,235,59,1) 100%)',
      mythic: 'radial-gradient(circle, rgba(244,67,54,0.5) 50%, rgba(244,67,54,1) 100%)',
    };

    return (
      <div
        className="item-notification-item-box"
        style={{
          background: getGradientItem(),
          ...props.style,
        }}
        ref={ref}
      >
        <div className="item-slot-image" style={{ backgroundImage: `url(${getItemUrl(slotItem) || 'none'}` }} />
        <div className="item-slot-wrapper">
          <div className="item-notification-action-box">
            <p>{props.item.text}</p>
          </div>
          <div className="inventory-slot-label-box">
            <div className="inventory-slot-label-text">{slotItem.metadata?.label || Items[slotItem.name]?.label}</div>
          </div>
        </div>
      </div>
    );
  }
);

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <TransitionGroup className="item-notification-container">
          {queue.values.map((notification, index) => (
            <Fade key={`item-notification-${index}`}>
              <ItemNotification item={notification.item} ref={notification.ref} />
            </Fade>
          ))}
        </TransitionGroup>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
