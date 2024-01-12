import { createSignal } from "solid-js";
import { AudioPlayer } from "@/components/ui/audio-player";

export function App() {
  const [directoryList, setDirectoryList] = createSignal<
    Record<string, { name: string; file: string }[]>
  >({});

  const [track, setTrack] = createSignal<string>("");

  return (
    <div>
      <button
        onClick={async () => {
          const data = await window.dialog.openDirDialog();
          if (data == null) return;
          const { dirPath, files } = data;
          return setDirectoryList({ [dirPath]: files });
        }}
      >
        Browse
      </button>

      {Object.entries(directoryList()).map(([dir, files]) => (
        <>
          <p>Album: {dir}</p>
          <ul>
            {files.map(({ name, file }) => (
              <li>
                <button
                  onClick={() => setTrack("data:audio/mpeg;base64," + file)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </>
      ))}

      <AudioPlayer src={track()} />
    </div>
  );
}
