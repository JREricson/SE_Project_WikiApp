const express = require("express"),
  fetch = require("node-fetch"),
  fileType = require("file-type"),
  sharp = require("sharp");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("instructions will be here");
});

router.get("/picture", async (req, res) => {
  //TODO make all queries lowecase

  let acceptedQueries = {
    percent: 1,
    url: 1,
    centeredSquare: 1,
    ht: 1,
    wid: 1,
    fit: 1,
  };
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
    let { imageBuffer, getImageErrors } = await getImageBufferFomUrl(query.url);

    if (getImageErrors.length > 0) {
      //|| imageBuffer == null

      console.log("prob with image buff");
      res.send(getImageErrors);
    } else {
      console.log(typeof imageBuffer);
      let {
        transformedImage,
        processedImageErrors,
      } = await makeTransformedImage(query, res, imageBuffer);

      if (processedImageErrors.length > 0) {
        res.send(processedImageErrors);
      } else {
        console.log("made it!");
        console.log(typeof transformedImage);
        res.end(transformedImage, "binary");
      }
    }
  }
});

const getImageBufferFomUrl = async (url) => {
  let getImageErrors = [];
  let urlRes;
  let imageBuffer;
  try {
    urlRes = await fetch(url);

    if (urlRes && urlRes.buffer) {
      imageBuffer = await urlRes.buffer();
      // console.log(`file type is
      // ${fileType(urlRes.buffer)}`);
    } else {
      getImageErrors.push("no img buffer");
    }
  } catch {
    getImageErrors.push("cannot process url");
  }
  return { imageBuffer, getImageErrors };
};

const makeTransformedImage = async (query, res, imageBuffer) => {
  let transformedImage;
  let processedImageErrors = [];
  let resizeObj = {};
  let acceptedFitKeys = { stretch: 1, crop: 1 };
  let translateKeys = { crop: "cover", stretch: "fill" };

  if (query.fit) {
    acceptedFitKeys[query.fit] &&
      (resizeObj = { ...resizeObj, ...{ fit: translateKeys[query.fit] } });
    !acceptedFitKeys[query.fit] &&
      processedImageErrors.push(`fit cannnot have value of : ${query.fit}`);
  }

  if (query.wid) {
    resizeObj = { ...resizeObj, ...{ width: parseInt(query.wid) } };
  }

  if (query.ht) {
    resizeObj = { ...resizeObj, ...{ height: parseInt(query.ht) } };
  }

  if (processedImageErrors.length === 0) {
    try {
      await sharp(imageBuffer)
        .resize(resizeObj)

        .toBuffer()
        .then((data) => {
          transformedImage = data;
        })
        .catch((err) => {
          console.log("==================================================");
          console.log(err);
        });
      console.log("made it here");
    } catch {
      processedImageErrors.push("unknown error during image transformation");
    }
  }
  return { transformedImage, processedImageErrors };
};

module.exports = router;
