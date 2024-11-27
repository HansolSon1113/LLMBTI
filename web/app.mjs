import express from "express";
import { search, SafeSearchType } from "duck-duck-scrape";

const app = express()
const port = 3000
app.use(express.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);

app.post('/search', async (req, res) => {
  console.log(req);
  const searchBody = req.body.search;
  if (searchBody != undefined) {
    const searchResults = await search(searchBody, {
      safeSearch: SafeSearchType.STRICT
    }, {
      uri_modifier: (rawUrl) => {
        const url = new URL(rawUrl);
        url.searchParams.delete("ss_mkt");  // remove the parameter to avoid anomalies
        return url.toString();
      }
    });
    const firstResult = searchResults.results[0];
    // const resultData = {
    //   "title": firstResult.title,
    //   "description": firstResult.description,
    //   "url": firstResult.url,
    // };
    console.log(firstResult);
    res.send(firstResult);
  }
})

app.listen(port, () => {
  console.log(`Server is listening on ${port}`)
})
