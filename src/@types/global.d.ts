import fs from "node:fs";

declare global {
  interface Window {
    dialog: {
      openDirDialog(): Promise<null | {
        dirPath: string;
        files: { name: string; file: string }[];
      }>;
    };

    fs: typeof fs;

    downloadListener: (callback: (data: string) => void) => void;

    download: (
      url: string,
      fileExtension: string,
      formatId: string,
    ) => Promise<void>;
  }
}
