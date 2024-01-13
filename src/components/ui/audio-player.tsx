import { ComponentProps, createSignal, onMount } from "solid-js";
export const AudioPlayer = (props: ComponentProps<"audio">) => {
  let ref: HTMLAudioElement;
  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);

  return (
    <div>
      <audio
        onLoadedData={(ev) => {
          setDuration(ev.currentTarget.duration);
        }}
        onTimeUpdate={(ev) => {
          setTime(ev.currentTarget.currentTime);
        }}
        ref={ref!}
        {...props}
        controls
      ></audio>

      <input type="range" value={time()} max={duration()} />

      <button onClick={() => (ref.paused ? ref.play() : ref.pause())}>
        play
      </button>
    </div>
  );
};
