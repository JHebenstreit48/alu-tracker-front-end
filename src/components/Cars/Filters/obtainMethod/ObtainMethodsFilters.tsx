import { useMemo } from 'react';
import type {
  ObtainMethodFilterKey,
  ObtainMethodFiltersProps,
} from '@/types/Cars/Filters/ObtainMethodFiltersProps';
import { cupLabel, getObtainMethodOptions } from '@/utils/Cars/Filters/obtainMethodOptions';
import { formatStatus } from '@/utils/CarDetails/obtainableVia';

type SelectOption = { value: string; label: string };

type SelectConfig = {
  key: ObtainMethodFilterKey;
  label: string;
  allLabel: string;
  allLast?: boolean;
  options: SelectOption[];
};

const toOptions = (list: string[]): SelectOption[] =>
  list.map((value) => ({ value, label: value }));

const ObtainMethodFilters = ({ cars, values, onChange, onReset }: ObtainMethodFiltersProps) => {
  const options = useMemo(() => getObtainMethodOptions(cars, values), [cars, values]);

  const selects: SelectConfig[] = [
    { key: 'area', label: 'Area', allLabel: 'All Areas', options: toOptions(options.areas) },
    { key: 'section', label: 'Section', allLabel: 'All Sections', options: toOptions(options.sections) },
    {
      key: 'cup',
      label: 'Cups',
      allLabel: 'All Cups',
      options: options.cups.map((cup) => ({ value: cup, label: cupLabel(cup) })),
    },
    {
      key: 'pack',
      label: 'Class Packs',
      allLabel: 'All Packs',
      options: options.packs.map((pack) => ({ value: pack, label: `${pack} pack` })),
    },
    {
      key: 'status',
      label: 'Status',
      allLabel: 'All (past and current)',
      allLast: true,
      options: options.statuses.map((status) => ({ value: status, label: formatStatus(status) })),
    },
  ];

  return (
    <section className="obtainMethodFilters">
      <h2 className="obtainMethodHeading">Obtain Method</h2>
      <p className="obtainMethodHint">
        Showing current sources. Change Status to include past ones.
      </p>

      <div className="obtainMethodBody">
        {selects.map(({ key, label, allLabel, allLast, options: list }) => {
          const allOption = <option value="">{allLabel}</option>;
          return (
            <label key={key} className="obtainMethodField">
              <span className="obtainMethodLabel">{label}:</span>
              <select
                className="obtainMethodSelect"
                value={values[key]}
                onChange={(event) => onChange(key, event.target.value)}
              >
                {!allLast && allOption}
                {list.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {allLast && allOption}
              </select>
            </label>
          );
        })}

        <button type="button" className="obtainMethodReset" onClick={onReset}>
          Clear Obtain Filters
        </button>
      </div>
    </section>
  );
};

export default ObtainMethodFilters;