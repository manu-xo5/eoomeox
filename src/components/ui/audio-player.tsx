import { ComponentProps, Show, createSignal } from "solid-js";
import { PlayIcon } from "@/components/icons/play-icon";
import { Button } from "@/components/ui/button";
import { PauseIcon } from "@/components/icons/pause-icon";
import { Slider, SliderFill, SliderThumb, SliderTrack } from "./slider";
import { Slider as KSlider } from "@kobalte/core";
import { VolumeFullIcon } from "../icons/volume-full-icon";
import { Motion, Presence } from "solid-motionone";

export const AudioPlayer = (props: ComponentProps<"audio">) => {
  let ref: HTMLAudioElement;
  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [status, setStatus] = createSignal<"paused" | "playing">("paused");
  const [volume, setVolume] = createSignal(0);
  const [opacity, setOpacity] = createSignal(0);

  const formatDuration = (seconds: number) => {
    const time = new Date(0);

    time.setUTCSeconds(seconds);

    return time
      .toLocaleTimeString("en-UK", { timeZone: "utc" })
      .split(":")
      .reduce(
        (duration, unit) => {
          if (duration[0] == "00") duration.shift();
          if (duration.length < 2) {
            duration.push(unit);
          }
          return duration;
        },
        ["00", "00"],
      )
      .join(":");
  };

  return (
    <div>
      <div class="flex justify-center mb-4">
        <Button
          size="icon"
          class="rounded-full"
          onClick={() => (ref.paused ? ref.play() : ref.pause())}
          disabled={!props.src}
        >
          {status() === "paused" ? <PlayIcon /> : <PauseIcon />}
        </Button>
      </div>

      <div class="grid grid-cols-[0.1fr,0.8fr,0.1fr] -[100vw] gap-4 items-center">
        <div />

        <div class="flex items-center text-xs">
          <span>{formatDuration(Math.floor(time()))}</span>
          <Slider
            class="px-4"
            minValue={0}
            maxValue={duration()}
            value={[time()]}
            onChange={(value) => (ref.currentTime = +value[0])}
          >
            <SliderTrack>
              <SliderFill />
              <SliderThumb />
            </SliderTrack>
          </Slider>
          <span>{formatDuration(Math.floor(duration()))}</span>
        </div>

        <Motion.span
          onPointerEnter={() => setOpacity(1)}
          onPointerLeave={() => setOpacity(0)}
          onLostPointerCapture={() => setOpacity(0)}
          class="flex group relative justify-center items-center"
        >
          <Button
            size="icon"
            variant="ghost"
            class="flex-shrink-0 rounded-full border"
          >
            <VolumeFullIcon />
          </Button>

          <Presence>
            <Show when={opacity()}>
              <Motion.span
                class="flex justify-center w-full absolute bottom-full pb-10"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                style={{
                  "transform-origin": "bottom",
                }}
              >
                <span class="relative rounded-sm block border">
                  <KSlider.Root
                    class="flex-col items-center h-40 w-2"
                    orientation="vertical"
                    minValue={0}
                    maxValue={100}
                    value={[volume() * 100]}
                    onChange={(values) => {
                      ref.volume = values[0] / 100;
                      setVolume(values[0] / 100);
                    }}
                  >
                    <KSlider.Track class="rounded-full bg-secondary h-full w-full">
                      <KSlider.Fill class="absolute bg-white w-full rounded-full" />

                      <KSlider.Thumb class="cursor-pointer active:ring active:border-transparent ring-white bg-black border-2 outline-none border-white active:bg-accent block w-4 h-4 -left-1 rounded-full">
                        <KSlider.Input />
                      </KSlider.Thumb>
                    </KSlider.Track>
                  </KSlider.Root>
                </span>
              </Motion.span>
            </Show>
          </Presence>
        </Motion.span>
      </div>

      <audio
        hidden
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus("paused")}
        onVolumeChange={(ev) => {
          setVolume(ev.currentTarget.volume);
        }}
        onLoadedData={(ev) => {
          setDuration(ev.currentTarget.duration);
          ev.currentTarget.play();
        }}
        onTimeUpdate={(ev) => {
          setTime(ev.currentTarget.currentTime);
        }}
        ref={ref!}
        {...props}
        controls
      />
    </div>
  );
};
