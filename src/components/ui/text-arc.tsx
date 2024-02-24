import { type ComponentProps } from "solid-js";

export const TextArc = (props: ComponentProps<"svg"> & { text: string }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <path id="circlePath" d="M 10, 50 a 40,40 0 1,1 80,0 40,40 0 1,1 -80,0" />
    </defs>
    <text>
      <textPath href="#circlePath">{props.text}</textPath>
    </text>
  </svg>
);
