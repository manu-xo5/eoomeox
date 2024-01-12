/* @refresh reload */
import "./globals.css"
import { render } from "solid-js/web";
import { App } from "@/components/App";

const root = document.getElementById("root");

render(() => <App />, root!);
