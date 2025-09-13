export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10 satisfies PageSizeOption;
export const DEFAULT_PAGE = 1;

export const STATIC_DATA_STALE_TIME = 30 * 60 * 1000; // 30 minutes

export const DROPZONE_CONFIG = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 10, // 10MB
  multiple: true,
  accept: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    "application/zip": [".zip"],
    "text/plain": [".txt"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "application/java-archive": [".jar"],
    "text/x-java-source": [".java"],
  },
};
