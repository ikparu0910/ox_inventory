import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Items } from '../../store/items';
import WeightBar from '../utils/WeightBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { Slot, SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';

const InventoryHotbar: React.FC = () => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const items = useAppSelector(selectLeftInventory).items.slice(0, 5);

  //stupid fix for timeout
  const [handle, setHandle] = useState<NodeJS.Timeout>();
  useNuiEvent('toggleHotbar', () => {
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  const getGradientItem = (item: Slot) => {
    if (item.itemType) {
      return gradientItemType[item.itemType];
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
    <SlideUp in={hotbarVisible}>
      <div className="hotbar-container">
        {items.map((item) => (
          <div
            className="hotbar-item-slot"
            style={{
              background: getGradientItem(item),
            }}
            key={`hotbar-${item.slot}`}
          >
            <div
              className="item-slot-image"
              style={{ backgroundImage: `url(${item?.name ? getItemUrl(item as SlotWithItem) : 'none'}` }}
            />
            {isSlotWithItem(item) && (
              <div className="item-slot-wrapper">
                <div className="hotbar-slot-header-wrapper">
                  <div className="inventory-slot-number">{item.slot}</div>
                  <div className="item-slot-info-wrapper">
                    <p>
                      {item.weight > 0
                        ? item.weight >= 1000
                          ? `${(item.weight / 1000).toLocaleString('en-us', {
                              minimumFractionDigits: 2,
                            })}kg `
                          : `${item.weight.toLocaleString('en-us', {
                              minimumFractionDigits: 0,
                            })}g `
                        : ''}
                    </p>
                    <p>{item.count ? item.count.toLocaleString('en-us') + `x` : ''}</p>
                  </div>
                </div>
                <div>
                  {/* {item?.durability !== undefined && <WeightBar percent={item.durability} durability />} */}
                  <div className="inventory-slot-label-box">
                    <div className="inventory-slot-label-text">
                      {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
