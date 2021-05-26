const express = require("express"),
  fetch = require("node-fetch"),
  fileType = require("file-type"),
  sharp = require("sharp");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("../views/pages/api");
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

    if (Object.keys(getImageErrors).length > 0) {
      //|| imageBuffer == null

      console.log("prob with image buff");
      res.send(getImageErrors);
    } else {
      console.log(typeof imageBuffer);
      let { transformedImage, processedImageErrors } =
        await makeTransformedImage(query, res, imageBuffer);

      if (Object.keys(processedImageErrors).length > 0) {
        res.send(processedImageErrors);
      } else {
        console.log(typeof transformedImage);
        res.end(transformedImage, "binary");
      }
    }
  }
});

const getImageBufferFomUrl = async (url) => {
  let getImageErrors = {};
  let urlRes;
  let imageBuffer;
  let acceptedMimeTypes = {
    "image/jpeg": 1,
    "image/png": 1,
    "image/tiff": 1,
    "image/gif": 1,
  };
  try {
    urlRes = await fetch(url);

    //TODO need to check file type --  needs to be JPEG, PNG, WebP, TIFF, GIF,

    if (urlRes && urlRes.buffer) {
      imageBuffer = await urlRes.buffer();
      let fileTypeobj = await fileType.fromBuffer(imageBuffer);

      let mimeType = fileTypeobj.mime.toLocaleLowerCase();
      console.log("mimetype is ", mimeType);
      if (!acceptedMimeTypes[mimeType]) {
        getImageErrors["mimeTypeError"] = `${mimeType} is not a valid mimetype`;
      }
    } else {
      getImageErrors["imgBufferError"] = `no img buffer`;
    }
  } catch {
    getImageErrors["urlError"] = `cannot process url`;
  }
  return { imageBuffer, getImageErrors };
};

const makeTransformedImage = async (query, res, imageBuffer) => {
  let transformedImage;
  let processedImageErrors = {};
  let resizeObj = {};
  let acceptedFitKeys = { stretch: 1, crop: 1 };
  let translateKeys = { crop: "cover", stretch: "fill" };

  if (query.fit) {
    acceptedFitKeys[query.fit] &&
      (resizeObj = { ...resizeObj, ...{ fit: translateKeys[query.fit] } });
    if (!acceptedFitKeys[query.fit]) {
      processedImageErrors[
        "keyError"
      ] = `keyError: fit cannnot have value of  \'${query.fit}\'`;
    }
  }

  if (query.wid) {
    let wid = parseInt(query.wid);
    if (!wid) {
      processedImageErrors[
        "keyError"
      ] = `wid cannot have value of \'${query.wid}\'`;
    } else {
      resizeObj = { ...resizeObj, ...{ width: parseInt(query.wid) } };
    }
  }

  if (query.ht) {
    let ht = parseInt(query.ht);
    //would want to fit to regex to check ranges, but implemented now as is beyond school project needs

    if (!ht) {
      processedImageErrors[
        "keyError"
      ] = `ht cannot have value of \'${query.ht}\'`;
    } else {
      resizeObj = { ...resizeObj, ...{ height: parseInt(query.ht) } };
    }
  }

  if (Object.keys(processedImageErrors).length === 0) {
    try {
      await sharp(imageBuffer)
        .resize(resizeObj)

        .toBuffer()
        .then((data) => {
          transformedImage = data;
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {
      processedImageErrors["unknownError"] =
        " unknown error during image transformation";
    }
  }
  return { transformedImage, processedImageErrors };
};

module.exports = router;
