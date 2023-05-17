const core = require('@actions/core');
const fs = require('fs');
const fetch = require('node-fetch');

// most @actions toolkit packages have async methods
async function run() {
  try {
    console.log("try again");
    const results = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await results.json();
    const url = data.message;
    await downloadFile(url, "dog.png");
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function downloadFile(url, filename) {
  return new Promise(resolve => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(filename);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log('Download finished')
        resolve();
      });
    })
  });
}


run();
