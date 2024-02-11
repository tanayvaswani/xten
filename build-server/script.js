const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function init() {
  console.log(`Executing script.js`);
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  // logs
  p.stdout.on("data", () => {
    console.log(data.toString());
  });

  // errors
  p.stdout.on("error", () => {
    console.log(data.toString());
  });

  // On completion
  p.on("close", () => {
    console.log("Build Complete!");
    const distDirPath = path.join(__dirname, "output", "dist");
  });
}
