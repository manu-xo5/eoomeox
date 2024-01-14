import { cn } from "@/lib/utils";
import { ComponentProps } from "solid-js";

export const Slider = (props: ComponentProps<"input">) => (
  <input
    type="range"
    {...props}
    class={cn(
      "appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 flex-1 outline-none  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary-foreground [&::-webkit-slider-thumb]:absolute [&::-webkit-slider-thumb]:-translate-y-1/4",
      props.class,
    )}
  />
);
