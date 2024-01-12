import { ComponentProps, createSignal, onMount } from "solid-js";
export const AudioPlayer = (props: ComponentProps<"audio">) => {
  let ref: HTMLAudioElement;
  const [time, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);

  onMount(() => {
    ref.addEventListener("loadeddata", (ev) => {
      setDuration(ev.target.duration);
    });

    ref.addEventListener("timeupdate", (ev) => {
      console.log(ev.target.currentTime);
      setTime(ev.target.currentTime);
    });
  });

  return (
    <>
      <audio ref={ref} {...props} controls></audio>

      <progress value={time()} max={duration()}></progress>
      <span>{time()}</span>

      <button onClick={() => (ref.paused ? ref.play() : ref.pause())}>
        play
      </button>
    </>
  );
};
