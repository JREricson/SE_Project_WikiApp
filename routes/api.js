const express = require("express"),
  fetch = require("node-fetch"),
  fileType = require("file-type"),
  sharp = require("sharp");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("../views/pages/api");
});

router.get("/picture", async (req, res) => {
  let acceptedQueries = getAcceptedQueries();
  let rejectedQueries = [];
  let query = req.query;

  checkForErrorsInQuery(query, acceptedQueries, rejectedQueries);
  if (Object.entries(query).length === 0) {
    res.send({
      noQueryError: "no query was entered",
    });
  } else if (rejectedQueries.length > 0) {
    res.send({
      RejectedQueryError: {
        rejected: rejectedQueries,
      },
    });
  } else if (!query["url"]) {
    res.send({
      noUrlError: "no url provided",
    });
  } else {
    let { imageBuffer, getImageErrors } = await getImageBufferFomUrl(query.url);
    await transformImageAndSendRequest(getImageErrors, res, query, imageBuffer);
  }
});

const getImageBufferFomUrl = async (url) => {
  let getImageErrors = {};
  let imageBuffer;

  try {
    imageBuffer = await getImageBuffer(url, imageBuffer, getImageErrors);
  } catch {
    getImageErrors["urlError"] = `cannot process url`;
  }
  return { imageBuffer, getImageErrors };
};

const makeTransformedImage = async (query, res, imageBuffer) => {
  let transformedImage;
  let processedImageErrors = {};
  let resizeObj = {};
  resizeObj = processFitQuery(query, resizeObj, processedImageErrors);
  resizeObj = processWidQuery(query, processedImageErrors, resizeObj);
  resizeObj = processHtQuery(query, processedImageErrors, resizeObj);

  if (Object.keys(processedImageErrors).length === 0) {
    try {
      transformedImage = await transformImage(
        transformedImage,
        imageBuffer,
        resizeObj
      );
    } catch {
      processedImageErrors["unknownError"] =
        " unknown error during image transformation";
    }
  }
  return { transformedImage, processedImageErrors };
};

module.exports = router;

const transformImage = async (transformedImage, imageBuffer, resizeObj) => {
  transformedImage = await getTransformedImage(
    imageBuffer,
    resizeObj,
    transformedImage
  );
  return transformedImage;
};

const processHtQuery = (query, processedImageErrors, resizeObj) => {
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
  return resizeObj;
};

const processWidQuery = (query, processedImageErrors, resizeObj) => {
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
  return resizeObj;
};

const processFitQuery = (query, resizeObj, processedImageErrors) => {
  let acceptedFitKeys = { stretch: 1, crop: 1 };
  let translateKeys = { crop: "cover", stretch: "fill" };
  if (query.fit) {
    acceptedFitKeys[query.fit] &&
      (resizeObj = { ...resizeObj, ...{ fit: translateKeys[query.fit] } });
    if (!acceptedFitKeys[query.fit]) {
      processedImageErrors[
        "keyError"
      ] = `keyError: fit cannot have value of  \'${query.fit}\'`;
    }
  }
  return resizeObj;
};

const getImageBuffer = async (url, imageBuffer, getImageErrors) => {
  let urlRes;
  let acceptedMimeTypes = {
    "image/jpeg": 1,
    "image/png": 1,
    "image/tiff": 1,
    "image/gif": 1,
  };
  urlRes = await fetch(url);
  if (urlRes && urlRes.buffer) {
    imageBuffer = await urlRes.buffer();
    let fileTypeobj = await fileType.fromBuffer(imageBuffer);

    let mimeType = fileTypeobj.mime.toLocaleLowerCase();
    if (!acceptedMimeTypes[mimeType]) {
      getImageErrors["mimeTypeError"] = `${mimeType} is not a valid mimetype`;
    }
  } else {
    getImageErrors["imgBufferError"] = `no img buffer`;
  }
  return imageBuffer;
};

const getTransformedImage = async (
  imageBuffer,
  resizeObj,
  transformedImage
) => {
  await sharp(imageBuffer)
    .resize(resizeObj)
    .toBuffer()
    .then((data) => {
      transformedImage = data;
    })
    .catch((err) => {
      console.log(err);
    });
  return transformedImage;
};
const transformImageAndSendRequest = async (
  getImageErrors,
  res,
  query,
  imageBuffer
) => {
  if (Object.keys(getImageErrors).length > 0) {
    res.send(getImageErrors);
  } else {
    let { transformedImage, processedImageErrors } = await makeTransformedImage(
      query,
      res,
      imageBuffer
    );

    if (Object.keys(processedImageErrors).length > 0) {
      res.send(processedImageErrors);
    } else {
      res.end(transformedImage, "binary");
    }
  }
};

const checkForErrorsInQuery = (query, acceptedQueries, rejectedQueries) => {
  for (const [key] of Object.entries(query)) {
    if (!acceptedQueries[key]) {
      rejectedQueries.push(key);
    }
    console.log(key);
  }
};

const getAcceptedQueries = () => {
  return {
    percent: 1,
    url: 1,
    centeredSquare: 1,
    ht: 1,
    wid: 1,
    fit: 1,
  };
};
