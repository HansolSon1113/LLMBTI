import express from "express";
import { search, SafeSearchType } from "duck-duck-scrape";

const app = express()
const port = 3000
app.use(express.json());

app.post('/search', async (req, res) => {
  const searchBody = req.body.search;
  console.log(searchBody);
  if (searchBody != undefined) {
    const searchResults = await search(searchBody, {
      safeSearch: SafeSearchType.STRICT
    }, {
      uri_modifier: (rawUrl) => {
        const url = new URL(rawUrl);
        url.searchParams.delete("ss_mkt");  // remove the parameter
        return url.toString();
      }
    });
    const firstResult = searchResults.results[0];
    const resultData = {
      "title": firstResult.title,
      "description": firstResult.description,
      "url": firstResult.url,
    };
    res.send(resultData);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
