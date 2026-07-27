export function truncateText(text: string, maxLength = 50) {
  if (!text) return '';

  return text.length > maxLength
    ? text.slice(0, maxLength) + '...'
    : text;
}