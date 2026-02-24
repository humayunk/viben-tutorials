/**
 * Extract YouTube video ID from various URL formats.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;

  // Standard watch URL: youtube.com/watch?v=ID
  const watchMatch = url.match(
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
  );
  if (watchMatch) return watchMatch[1];

  // Short URL: youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Embed URL: youtube.com/embed/ID
  const embedMatch = url.match(
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  );
  if (embedMatch) return embedMatch[1];

  return null;
}

/**
 * Build a YouTube embed URL from a video ID.
 */
export function embedUrl(videoId: string, startTime?: string): string {
  let url = `https://www.youtube.com/embed/${videoId}`;
  if (startTime) {
    const seconds = timeToSeconds(startTime);
    if (seconds > 0) url += `?start=${seconds}`;
  }
  return url;
}

/**
 * Build a YouTube thumbnail URL from a video ID.
 */
export function thumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Convert "M:SS" or "H:MM:SS" to seconds.
 */
function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
