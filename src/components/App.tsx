import { createSignal, onMount } from "solid-js";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "./icons/play-icon";

export function App() {
  const [directoryList, setDirectoryList] = createSignal<
    Record<string, { name: string; file: string }[]>
  >({});

  const [queue, setQueue] = createSignal<string[]>([]);

  const [track, setTrack] = createSignal<string>("");

  onMount(async () => {
    // @ts-ignore
    const { dirPath, files } = await window.x.openDirDialog();
    setDirectoryList((prev) => ({ ...prev, [dirPath]: files }));
  });

  return (
    <div class="grid grid-cols-2 h-screen">
      <div class="flex flex-col p-4 border-r border-border">
        <div class="flex-1">
          {Object.entries(directoryList()).map(([dir, files]) => (
            <>
              <p>
                <span class="font-bold">Album:</span> {dir}
              </p>
              {files.map(({ name, file }) => (
                <Button
                  class="capitalize justify-start group gap-2"
                  variant="ghost"
                  onClick={() => setTrack("data:audio/mpeg;base64," + file)}
                >
                  {name
                    .split(".")
                    .reverse()
                    .slice(1)
                    .join(" ")
                    .replace(/-/g, " ")
                    .toLowerCase()}

                  <span class="group-hover:opacity-100 transition-opacity opacity-0">
                    <PlayIcon />
                  </span>
                </Button>
              ))}
            </>
          ))}
        </div>

        <div class="flex-1 font-bold transition-all">
          <p>Queue</p>
        </div>

        <Button
          class="mt-auto"
          onClick={async () => {
            const data = await window.dialog.openDirDialog();
            if (data == null) return;
            const { dirPath, files } = data;
            return setDirectoryList({ [dirPath]: files });
          }}
        >
          Browse
        </Button>
      </div>

      <div class="mt-auto p-4">
        <AudioPlayer src={track()} />
      </div>
    </div>
  );
}
