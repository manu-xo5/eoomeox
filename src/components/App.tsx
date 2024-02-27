import { createSignal, onMount } from "solid-js";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "./icons/play-icon";
import { TextArc } from "./ui/text-arc";
import { Downloader } from "./Downloader";
import { AppError } from "@/lib/error";
import { invariantAppError } from "@/lib/invariant";
import { toast } from "./ui/toast";

const formatName = (name: string) =>
  name.split(".").reverse().slice(1).join(" ").replace(/-/g, " ").toLowerCase();

export function App() {
  const [directoryList, setDirectoryList] = createSignal<
    Record<string, { name: string; file: string }[]>
  >({});
  const [modal, setModal] = createSignal("");

  const [_queue, _setQueue] = createSignal<string[]>([]);

  const [track, setTrack] = createSignal<{ name: string; src: string } | null>(
    null,
  );

  onMount(async () => {
    // @ts-ignore
    const { dirPath, files } = await window.x.openDirDialog();
    setDirectoryList((prev) => ({ ...prev, [dirPath]: files }));
  });
  return (
    <>
      <div class="h-screen flex flex-col">
        <div class="grid grid-cols-[21vw_1fr] flex-1">
          <div class="flex flex-col p-4 border-r border-border">
            <div class="flex-1">
              {Object.entries(directoryList()).map(([dir, files]) => (
                <>
                  <p class="px-2 mt-2 truncate">
                    <span class="font-bold">Album:</span> {dir}
                  </p>
                  {files.map(({ name, file }) => (
                    <Button
                      class="border mt-2 px-2 w-full text-left justify-between capitalize group gap-2"
                      variant="ghost"
                      onClick={() => {
                        setTrack({
                          name,
                          src: "data:audio/mpeg;base64," + file,
                        });
                      }}
                    >
                      <span class="block truncate flex-1">
                        {formatName(name)}
                      </span>

                      <span class="flex-none group-hover:opacity-100 transition-opacity opacity-0">
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
                try {
                  const data = await window.dialog.openDirDialog();

                  invariantAppError(data, "No data");

                  const { dirPath, files } = data;
                  setDirectoryList({ [dirPath]: files });
                } catch (e) {
                  if (e instanceof AppError) {
                    return;
                  }

                  toast({
                    title: "failed to load dir",
                  });
                }
              }}
            >
              Browse
            </Button>

            <Button
              class="mt-3"
              onClick={async () => {
                setModal("downloader");
              }}
            >
              Download
            </Button>
          </div>

          <div class="flex flex-col border">
            {track()?.name ? (
              <div class="flex-1 flex justify-center items-center">
                <TextArc
                  class="animate-spin duration-2000"
                  text={formatName(track()?.name || "")}
                  width="30%"
                  fill="white"
                />
              </div>
            ) : (
              <p class="[-webkit-text-stroke:1px_#ccc] text-6xl">Eoomeox</p>
            )}
          </div>
        </div>

        <div class="border-t rounded-t-md mt-auto p-4">
          <AudioPlayer src={track()?.src} />
        </div>
      </div>

      <Downloader open={modal() === "downloader"} onOpenChange={setModal} />
    </>
  );
}
