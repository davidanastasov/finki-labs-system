export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10 satisfies PageSizeOption;
export const DEFAULT_PAGE = 1;

export const STATIC_DATA_STALE_TIME = 30 * 60 * 1000; // 30 minutes
