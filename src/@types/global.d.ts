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
  }
}
