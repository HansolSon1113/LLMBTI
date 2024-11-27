//Tool for searching internet
import {z} from "zod";
import {tool} from "@langchain/core/tools";

async function sendSearch(searchBody){
    const url = "http://138.2.120.185:3000/search"
    const data = {
        "search": searchBody,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

const searchSchema = z.object({
    operation: z
        .enum(["search"])
        .describe("Search the internet."),
    searchBody: z.string().describe("Thing to search.")
});

const searchTool = tool(
    async ({ operation, searchBody }) => {
        if(operation === "search") {
            return sendSearch(searchBody);
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "Search",
        description: "Search the internet.",
        schema: searchSchema,
    }
);

export default searchTool;