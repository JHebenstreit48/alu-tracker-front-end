import { useMemo, useState } from 'react';

import type { Brand } from '@/types/Brands';
import { groupBrandsByCountryAndLetter } from '@/utils/brands/brandsByCountryAndLetter';
import { filterBrands } from '@/utils/brands/filterBrands';
import { getAvailableCountries, getAvailableLetters } from '@/utils/brands/getAvailableFilters';

import BrandFilterBar from './BrandFilterBar';
import BrandGroupedList from './BrandGroupedList';

import '@/scss/brands/main/index.scss';

interface BrandQuickListProps {
  manufacturers: Brand[];
}

export default function BrandQuickList({ manufacturers }: BrandQuickListProps) {
  const [country, setCountry] = useState('All countries');
  const [search, setSearch] = useState('');

  const availableCountries = useMemo(() => getAvailableCountries(manufacturers), [manufacturers]);
  const availableLetters = useMemo(() => getAvailableLetters(manufacturers), [manufacturers]);

  const filtered = useMemo(
    () => filterBrands(manufacturers, { country, search }),
    [manufacturers, country, search]
  );

  const grouped = useMemo(() => groupBrandsByCountryAndLetter(filtered), [filtered]);

  const handleLetterJump = (targetLetter: string) => {
    if (!targetLetter) return;
    const el = document.querySelector(`[data-letter="${targetLetter}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!manufacturers || manufacturers.length === 0) {
    return <div className="error-message">No manufacturers found.</div>;
  }

  return (
    <div className="brand-quick-list">
      <BrandFilterBar
        country={country}
        search={search}
        availableCountries={availableCountries}
        availableLetters={availableLetters}
        onCountryChange={setCountry}
        onSearchChange={setSearch}
        onLetterJump={handleLetterJump}
      />
      <BrandGroupedList grouped={grouped} />
    </div>
  );
}