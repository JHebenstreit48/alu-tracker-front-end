export const OV_STATUSES = ['original', 'upcoming', 'current', 'recent', 'inactive', 'obsolete'] as const;

export type OvStatus = (typeof OV_STATUSES)[number];

export type OvEntryDraft = {
  id: number;
  status: OvStatus;
  methods: string[];
};

export const STATUS_LABELS: Record<OvStatus, string> = {
  original: 'Original',
  upcoming: 'Upcoming',
  current: 'Current',
  recent: 'Recent',
  inactive: 'Inactive',
  obsolete: 'Obsolete',
};