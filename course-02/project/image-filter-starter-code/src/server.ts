import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req: Request, res: Response) => {
    //Pickup the image's URL from from the Requests' query parameter
    let image_url: string = req.query.image_url as string;
    //Throw a 400 error code if the image_url is not present in the request
    if (!image_url) {
      return res.status(400).send(`The image's URL is required`);
    }
    //Logging
    console.log(image_url);
    //If the image_url is not a string throw a 422
    if (typeof image_url !== "string") {
      res.status(422).json({ error: "Invalid dataset" });
      return;
    }
    //Using await to get the get the path to the image from the filter
    const filterdImagePath: string = await filterImageFromURL(image_url);
    //Log the filter
    console.log("Filtered Image Path: " + filterdImagePath);
    //If we do get a value...
    if (filterdImagePath) {
      //Return a 200 show the image on screen and proceed to the delete the file from local disk
      return res.status(200).sendFile(filterdImagePath, () => {
        deleteLocalFiles([filterdImagePath]);
      });
    }
    //Throw a 400 if the something went wrong
    return res.status(400).json("Could not filter image");
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
