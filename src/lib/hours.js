import hours from '../data/hours.json';

// Clés de hours.json → jours schema.org (aussi utilisés par le script « aujourd'hui »).
const SCHEMA_DAYS = {
  lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday', jeudi: 'Thursday',
  vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday',
};

export const days = Object.entries(hours).map(([label, slots]) => ({ label, slots, schemaDay: SCHEMA_DAYS[label] }));

export const openEveryDay = days.every((d) => d.slots.length > 0);

export const fmtTime = (t) => t.replace(':', 'h');

const fmtSlots = (slots) => (slots.length ? slots.map(([o, c]) => `${fmtTime(o)} – ${fmtTime(c)}`).join(' et ') : 'Fermé');
const fmtList = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} et ${xs.at(-1)}` : xs[0]);

// Regroupe les jours aux horaires identiques : « Lundi, mardi, mercredi et dimanche » → « 17h30 – 21h30 ».
export function groupedDays() {
  const groups = {};
  for (const d of days) {
    const g = (groups[JSON.stringify(d.slots)] ??= { labels: [], schemaDays: [], hours: fmtSlots(d.slots) });
    g.labels.push(d.label);
    g.schemaDays.push(d.schemaDay);
  }
  return Object.values(groups).map((g) => ({ ...g, days: fmtList(g.labels).replace(/^./, (c) => c.toUpperCase()) }));
}

// Regroupe les jours ayant le même créneau : une entrée openingHoursSpecification par créneau.
export function openingHoursSpecification() {
  const bySlot = {};
  for (const d of days) for (const [opens, closes] of d.slots) (bySlot[`${opens}-${closes}`] ??= { opens, closes, dayOfWeek: [] }).dayOfWeek.push(d.schemaDay);
  return Object.values(bySlot).map((s) => ({ '@type': 'OpeningHoursSpecification', ...s }));
}
