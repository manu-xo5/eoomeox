import { ComponentProps, createSignal } from "solid-js";
import { PlayIcon } from "@/components/icons/play-icon";
import { Button } from "@/components/ui/button";
import { PauseIcon } from "@/components/icons/pause-icon";
import { Slider, SliderFill, SliderThumb, SliderTrack } from "./slider";
import { VolumeFullIcon } from "../icons/volume-full-icon";

export const AudioPlayer = (props: ComponentProps<"audio">) => {
  let ref: HTMLAudioElement;
  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [status, setStatus] = createSignal<"paused" | "playing">("paused");

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

      <div class="flex gap-6 items-center">
        <span>{formatDuration(Math.floor(time()))}</span>
        {/* <Slider */}
        {/*   value={time()} */}
        {/*   max={duration()} */}
        {/*   onChange={(ev) => (ref.currentTime = +ev.currentTarget.value)} */}
        {/* /> */}
        <Slider
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

        <div>
          <span class="group">
            <Button size="icon" variant="ghost" class="rounded-full">
              <VolumeFullIcon />
            </Button>

            <span></span>
          </span>
        </div>
      </div>

      <audio
        hidden
        onPlay={() => setStatus("playing")}
        onPause={() => setStatus("paused")}
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
      ></audio>
    </div>
  );
};
