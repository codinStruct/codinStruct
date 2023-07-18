import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Shows an error and stops execution.
 *
 * @param what - Error to show.
 */
function error(what: string): never {
  console.error(`md2html setup error: ${what}`);
  process.exit(1);
}

const venvPath = path.join(__dirname, "md2html/.venv");

if (fs.lstatSync(venvPath, { throwIfNoEntry: false })?.isDirectory()) {
  console.info("md2html is already set up.");
  process.exit();
}

let spawnCommand: string | undefined;
let cleanCommand: string | undefined;
switch (process.platform) {
  case "linux":
    spawnCommand =
      "cd md2html && python3 -m venv .venv && . .venv/bin/activate && pip3 install -r requirements.txt";
    cleanCommand = "rm -rf md2html/.venv";
    break;

  case "win32":
    spawnCommand =
      "cd md2html && python3 -m venv .venv && .\\.venv\\Scripts\\activate && pip3 install -r requirements.txt";
    cleanCommand = "rmdir md2html\\.venv";
    break;
}
if (spawnCommand == null || cleanCommand == null) error("Unsupported platform");

let spawned = spawnSync(spawnCommand, { shell: true });
if (spawned.status != 0) {
  spawnSync(cleanCommand);
  error(
    "Error while setting up md2html. You may need to manually delete its virtual environment"
  );
}