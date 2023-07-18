import { spawnSync } from "child_process";

/**
 * Shows an error and stops execution.
 *
 * @param what - Error to show.
 */
function error(what: string): never {
  console.error(`md2html venv activation error: ${what}`);
  process.exit(1);
}

let command: string | undefined;
switch (process.platform) {
  case "linux":
    command =
      ". ./md2html/.venv/bin/activate && python3 md2html/app.py codinStruct-content/Content frontend/content";
    break;

  case "win32":
    command =
      ".\\md2html\\.venv\\Scripts\\activate && python3 md2html\\app.py codinStruct-content\\Content frontend\\content";
    break;
}
if (command == null) error("Unsupported platform");

const spawned = spawnSync(command, { shell: true });
if (spawned.error) Error(spawned.error.message);