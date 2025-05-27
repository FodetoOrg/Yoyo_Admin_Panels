export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export const getColumnClass = (space?: number) => {
  switch (space) {
    case 2:
      return "md:col-span-2";
    case 3:
      return "md:col-span-3";
    case 4:
      return "md:col-span-4";
    default:
      return "md:col-span-1";
  }
};

export const getGridClass = (columns: number) => {
  switch (columns) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-1 md:grid-cols-2";
    case 3:
      return "grid-cols-1 md:grid-cols-3";
    case 4:
      return "grid-cols-1 md:grid-cols-4";
    default:
      return "grid-cols-1 md:grid-cols-2";
  }
};

export const validateFiles = (
  files: File[],
  maxFiles?: number,
  maxFileSize?: number
) => {
  if (!files.length) return true;

  if (maxFiles && files.length > maxFiles) {
    throw new Error(`Maximum ${maxFiles} files allowed`);
  }

  if (maxFileSize) {
    const oversizedFiles = files.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      throw new Error(`Files must be smaller than ${maxSizeMB}MB`);
    }
  }

  return true;
};
