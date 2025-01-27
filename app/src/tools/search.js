import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";

const retriever = new TavilySearchAPIRetriever({
  k: 2,
  apiKey: process.env.REACT_APP_TRAVILY_API_KEY
});

async function searchTool(searchBody){
    const response = await retriever.invoke(searchBody);
    const pageContents = response.map((item) => item.pageContent);

    return pageContents;
}

export default searchTool;