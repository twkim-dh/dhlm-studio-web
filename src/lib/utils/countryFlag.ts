/**
 * ISO 3166-1 alpha-2 country code → flag emoji
 * getFlag('US') → 🇺🇸
 * getFlag('KR') → 🇰🇷
 */
export function getFlag(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return '';
  return String.fromCodePoint(
    ...[...code].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}
