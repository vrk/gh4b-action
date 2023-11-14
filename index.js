const https = require('https');
const core = require('@actions/core');
const fs = require('fs');
const fetch = require('node-fetch');

async function run() {
  console.log("try again??");
  try {
    const url = await getDogUrl();
    await downloadAndSaveFile(url, "dog.png");
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getDogUrl() {
  const results = await fetch("https://dog.ceo/api/breeds/image/random");

  if (!results.ok) {
    throw new Error(`Fetch failed with status: ${results.status} ${results.statusText}`);
  }

  const data = await results.json();

  return data.message;
}

async function downloadAndSaveFile(url, filename) {
  const dataStream = await getDataStream(url);

  const fileStream = fs.createWriteStream(filename);
  dataStream.pipe(fileStream);

  return new Promise((resolve, reject) => {
    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Download finished');
      resolve();
    });

    fileStream.on('error', (error) => {
      reject(new Error(`File write error: ${error.message}`));
    });
  });
}

function getDataStream(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Download failed with status code ${res.statusCode} ${res.statusMessage}`));
      }

      resolve(res);
    });
  });
}

run();

module.exports = {
  getDataStream,
  getDogUrl,
};
