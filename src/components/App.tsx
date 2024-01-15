import { createSignal, onMount } from "solid-js";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "./icons/play-icon";
import { TextArc } from "./ui/text-arc";

export function App() {
  const [directoryList, setDirectoryList] = createSignal<
    Record<string, { name: string; file: string }[]>
  >({});

  const [_queue, _setQueue] = createSignal<string[]>([]);

  const [track, setTrack] = createSignal<{ name: string; src: string } | null>(
    null,
  );

  onMount(async () => {
    // @ts-ignore
    const { dirPath, files } = await window.x.openDirDialog();
    setDirectoryList((prev) => ({ ...prev, [dirPath]: files }));
  });

  const formatName = (name: string) =>
    name
      .split(".")
      .reverse()
      .slice(1)
      .join(" ")
      .replace(/-/g, " ")
      .toLowerCase();

  return (
    <div class="grid grid-cols-[21vw_1fr] h-screen">
      <div class="flex flex-col p-4 border-r border-border">
        <div class="flex-1">
          {Object.entries(directoryList()).map(([dir, files]) => (
            <>
              <p class="p-2 truncate">
                <span class="font-bold">Album:</span> {dir}
              </p>
              {files.map(({ name, file }) => (
                <Button
                  class="border w-full justify-between capitalize group gap-2"
                  variant="ghost"
                  onClick={() => {
                    setTrack({ name, src: "data:audio/mpeg;base64," + file });
                  }}
                >
                  {formatName(name)}

                  <span class="group-hover:opacity-100 transition-opacity opacity-0">
                    <PlayIcon />
                  </span>
                </Button>
              ))}
            </>
          ))}
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

      <div class="flex flex-col">
        <TextArc
          class="flex-1 self-center justify-self-center animate-spin duration-2000"
          text={formatName(track()?.name || "")}
          width="30%"
          fill="white"
        />
        <div class="mt-auto p-4">
          <AudioPlayer src={track()?.src} />
        </div>
      </div>
    </div>
  );
}
