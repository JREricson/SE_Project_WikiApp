const express = require("express"),
  fetch = require("node-fetch"),
  fileType = require("file-type");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("instructions will be here");
});

router.get("/picture", async (req, res) => {
  //TODO make all queries lowecase
  let acceptedQueries = { percent: 1, url: 1, centeredSquare: 1 };
  let rejectedqueries = [];
  //errors=[]

  let query = req.query;
  //console.log(query);

  //checking for errors in query
  for (const [key] of Object.entries(query)) {
    if (!acceptedQueries[key]) {
      rejectedqueries.push(key);
    }
    console.log(key);
  }
  if (Object.entries(query).length === 0) {
    res.send({
      noQueryError: "no query was entered",
    });
  } else if (rejectedqueries.length > 0) {
    res.send({
      RejectedQueryError: {
        rejected: rejectedqueries,
      },
    });
  } else if (!query["url"]) {
    res.send({
      noUrlError: "no url provided",
    });
  } else {
    //TODO add catch if not url
    console.log(query.url);
    imageBuffer = await getImageFomUrl(query.url);

    res.end(imageBuffer, "binary");

    // console.log(importScripts);
    // res.end(imageBuffer, "binary");
    //process image()

    //if errors
    //send erros back
    //else
    // sendProcessedImage(query.url, res);

    // res.send(`your query was:  ${JSON.stringify(req.query)}  `);
  }
});

const getImageFomUrl = async (url) => {
  urlRes = await fetch(url);
  //console.log(img);

  if (urlRes && urlRes.buffer) {
    return urlRes.buffer();
  } else {
    return "no img buffer";
  }

  //fetch data
  //save as binary
};

const sendProcessedImage = (query, res) => {};

// let resizedPhoto
// await sharp(photoBuffer)
//   .resize({ width: 1200, height: 900, fit: 'fill' })
//   .toBuffer()
//   .then((data) => {
//     resizedPhoto = data
//   })
//   .catch((err) => {})
module.exports = router;
