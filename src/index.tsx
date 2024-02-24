/* @refresh reload */
import "./globals.css";
import { render } from "solid-js/web";
import { App } from "@/components/App";
import { Toaster } from "./components/ui/toast";

const root = document.getElementById("root");

render(
  () => (
    <>
      <App />
      <Toaster />
    </>
  ),
  root!,
);
