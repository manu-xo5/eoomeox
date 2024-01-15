import { ComponentProps } from "solid-js";

export const PauseIcon = (props : ComponentProps<"svg">) => (
  <svg
    fill="none"
    stroke-width="2"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    style="overflow: visible; color: currentcolor;"
    {...props}
  >
    <path d="M6 4H10V20H6z"></path>
    <path d="M14 4H18V20H14z"></path>
  </svg>
);
