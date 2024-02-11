const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
require("dotenv").config();

const s3Client = new S3Client({
  region: "",
  credentials: {
    accessKeyId: "",
    sessionToken: "",
  },
});

const PROJECT_ID = process.env.PROJECT_ID;

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
  p.on("close", async () => {
    console.log("Build Complete!");
    const distDirPath = path.join(__dirname, "output", "dist");

    const distDirContent = fs.readdirSync(distDirPath, { recursive: true });

    for (const filePath of distDirContent) {
      if (fs.lstatSync(filePath).isDirectory()) {
        continue;
      }

      // upload on S3
      console.log("uploading: ", filePath);
      const command = PutObjectCommand({
        // bucket name
        Bucket: "",
        Key: `__outputs/${PROJECT_ID}/${filePath}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });

      // upload objects to s3 bucket
      await s3Client.send(command);
      console.log("uploaded: ", filePath);
    }

    console.log(`Process done...`);
  });
}
