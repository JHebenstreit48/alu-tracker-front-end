import type { CarLabListItem } from '@/types/CarLab/carLab';
import type { Slot } from '@/types/CarLab/compare';

interface Props {
  slot: Slot;
  item: CarLabListItem;
}

export default function CarHeader({ slot, item }: Props) {
  return (
    <div className="carLabCarTop">
      <div className="carLabCarImage">
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" />
        ) : (
          <span className="carLabCarMonogram">{item.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div className="carLabCarId">
        <span className={`carLabCarSlot ${slot === 'a' ? 'slotA' : 'slotB'}`}>
          {slot.toUpperCase()}
        </span>
        <h3 className="carLabCarName">{item.name}</h3>
        <div className="carLabCarBadges">
          <span className="carLabBadge isClass">Class {item.carClass}</span>
          <span className="carLabBadge">{item.maxStars}★ max</span>
          <span className="carLabBadge">{item.rarity}</span>
        </div>
      </div>
    </div>
  );
}