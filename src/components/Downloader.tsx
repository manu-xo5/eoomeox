import { For, createEffect, createSignal } from "solid-js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { FiInfo, FiLoader, FiMusic, FiVideo } from "solid-icons/fi";
import { invariantAppError } from "@/lib/invariant";
import { toast } from "./ui/toast";
import { Dialog as DialogPrimitive } from "@kobalte/core";
import { listeners } from "process";

export const Downloader = (props: DialogPrimitive.DialogRootProps) => {
  const [open] = createSignal(false);
  const [downloadStatus, setDownloadStatus] = createSignal("idle");
  const [url, setUrl] = createSignal(
    "https://www.youtube.com/watch?v=MAEzNKigRVQ",
  );
  const [formats, setFormats] = createSignal(
    JSON.parse(localStorage.getItem("formats") || "[]"),
  );
  const [status, setStatus] = createSignal<"idle" | "loading">("idle");

  createEffect(() => {
    if (open() === false) {
      // ... animate
    }
  });

  return (
    <Dialog {...props}>
      <DialogContent showCloseButton={false}>
        <div class="flex flex-col items-start fixed w-[70vw] max-w-[800px] h-[400px] bg-primary-foreground border border-accent shadow shadow-accent top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md p-3">
          <Input
            placeholder="paste url://"
            value={url()}
            onInput={(ev) => setUrl(ev.currentTarget.value)}
          />
          <div class="flex w-full gap-2 items-center mt-2">
            <Button
              onClick={async () => {
                setStatus("loading");
                const res = await (window as any).getFormats(url());
                setStatus("idle");
                const json = JSON.parse(res.join(""));
                console.log(json.formats[4]);
                const formats = json.formats
                  .map((format: any) => ({
                    format_id: format.format_id,
                    resolution: format.resolution,
                    audio_ext: format.audio_ext,
                    video_ext: format.video_ext,
                    format: format.format,
                    ext: format.ext,
                  }))
                  .filter(
                    (format: any) =>
                      format.video_ext !== "none" ||
                      format.audio_ext !== "none",
                  );

                invariantAppError(
                  Array.isArray(formats),
                  "Failed to load formats",
                );
                invariantAppError(formats.length > 0, "No formats found");

                localStorage.setItem("formats", JSON.stringify(formats));
                setFormats(formats);
              }}
            >
              {status() === "loading" ? (
                <FiLoader class="animate-spin" />
              ) : (
                "Fetch"
              )}
            </Button>

            <DialogPrimitive.CloseButton>
              <Button>Close</Button>
            </DialogPrimitive.CloseButton>

            <p class="ml-auto text-xs text-muted-foreground px-1.5">
              Powered by yt-dlp
            </p>
          </div>

          <p class="text-xs flex items-center gap-1 text-muted-foreground pl-1.5 pt-6">
            <FiInfo />
            Click to download file
          </p>

          <div class="overflow-y-auto w-full space-y-2 mt-2 [::-webkit-scrollbar-thumb]:bg-primary-foreground pr-1">
            <For
              each={
                formats() as Array<{
                  format_id: string;
                  resolution: string;
                  audio_ext: string;
                  video_ext: string;
                  format: string;
                  ext: string;
                }>
              }
            >
              {(format) => (
                <Button
                  class="w-full text-left justify-start flex items-center gap-2 bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm"
                  onClick={async () => {
                    try {
                      const ext =
                        format.video_ext !== "none"
                          ? format.video_ext
                          : format.audio_ext;
                      toast({ title: "Downloading - " + ext });
                      const listener = (await (window as any).download(
                        url(),
                        ext,
                        format.format_id,
                      )) as { onData(data: any): void };
                      console.log(listener);
                      toast({ title: "Downloaded" });
                    } catch (e) {
                      console.error(e);
                      const message =
                        e instanceof Error ? e.message : undefined;

                      toast({
                        title: "Failed Downloading",
                        description: message,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {format.video_ext !== "none" ? <FiVideo /> : <FiMusic />}

                  <span class="capitalize w-[8ch]">
                    {format.video_ext !== "none"
                      ? format.video_ext
                      : format.audio_ext}
                  </span>

                  <span class="text-muted-foreground text-xs">
                    Bitrate: {format.format.split("-")[0]}
                  </span>
                  <span class="text-muted-foreground text-xs capitalize">
                    Playback: {format.format.match(/\((.*)\)/)?.[1]}
                  </span>
                  {/* Bitrate: {format.format.replace(/\(.*\)/, "(X)")} */}
                  {/* {format} {ext} {resolution} */}
                </Button>
              )}
            </For>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
