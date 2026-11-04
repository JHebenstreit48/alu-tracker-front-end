import { useId, useMemo, useState } from 'react';
import type { CarLabListItem } from '@/types/CarLab/carLab';
import type { Slot } from '@/types/CarLab/compare';

interface Props {
  slot?: Slot;
  label?: string;
  items: CarLabListItem[];
  value: string | null;
  exclude: string | null;
  onChange: (slug: string | null) => void;
}

export default function CarPicker({ slot = 'a', label, items, value, exclude, onChange }: Props) {
  const [query, setQuery] = useState('');
  const id = useId();
  const heading = label ?? (slot === 'a' ? 'Car A' : 'Car B');

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.slug !== exclude && (item.slug === value || !q || item.name.toLowerCase().includes(q))
    );
  }, [items, query, value, exclude]);

  return (
    <div className="carLabField">
      <label className="carLabFieldLabel" htmlFor={`${id}-select`}>
        {heading}
      </label>
      <input
        className="carLabSelect"
        type="search"
        placeholder="Search cars"
        aria-label={`Search ${heading}`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select
        id={`${id}-select`}
        className="carLabSelect"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">Select a car</option>
        {options.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name} ({item.carClass})
          </option>
        ))}
      </select>
    </div>
  );
}