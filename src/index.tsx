/* @refresh reload */
import { createEffect, createSignal } from "solid-js";
import { render } from "solid-js/web";

const root = document.getElementById("root");

function App() {
  const [directoryList, setDirectoryList] = createSignal({});
  createEffect(() => {
    console.log("before", window.dialog);

    // window.dialog.showOpenDialog({
    //   properties: ["openFile", "openDirectory"],
    // });

    const text = window.fs.readFileSync(
      "/home/norm/code/eoomeox/package.json",
      {
        encoding: "utf-8",
      },
    );
    console.log("after");

    console.log(text);
  });

  return (
    <div>
      <button
        onClick={() =>
          window.dialog
            .openDirDialog()
            .then((files) => setDirectoryList({ "TODO: add Dir name": files }))
        }
      >
        Browse
      </button>

      <ul>
        {Object.entries(directoryList()).map(([dir, files]) =>
          files.map((filePath) => <li>{filePath}</li>),
        )}
      </ul>
    </div>
  );
}

render(() => <App />, root!);
