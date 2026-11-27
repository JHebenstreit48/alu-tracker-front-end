const EVENT_NAME = 'car-tracking-changed';

export type CarTrackingSource = 'basicInfo' | 'blueprints';

type Detail = { carKey: string; source: CarTrackingSource };

// Tell other tables on the car page that this car's saved progress changed
export function notifyCarTrackingChanged(carKey: string, source: CarTrackingSource): void {
  window.dispatchEvent(new CustomEvent<Detail>(EVENT_NAME, { detail: { carKey, source } }));
}

// Runs onChange when another table changes this car; ignores the listener's own announcements
export function onCarTrackingChanged(
  carKey: string,
  source: CarTrackingSource,
  onChange: () => void
): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<Detail>).detail;
    if (detail?.carKey === carKey && detail.source !== source) onChange();
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}