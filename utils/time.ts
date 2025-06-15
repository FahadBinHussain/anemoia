// utils/time.ts

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.round((now - timestamp) / 1000);

  if (seconds < 5) {
    return 'just now';
  }

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  let counter;
  for (const intervalName in intervals) {
    counter = Math.floor(seconds / intervals[intervalName]);
    if (counter > 0) {
      if (counter === 1) {
        return `${counter} ${intervalName} ago`;
      } else {
        return `${counter} ${intervalName}s ago`;
      }
    }
  }
  // Fallback for very recent or future timestamps (though future shouldn't happen for createdAt)
  return seconds > 0 ? `${seconds} seconds ago` : 'just now';
}
