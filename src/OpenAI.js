//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph/web";
import timeTool from "./tools/time";
import { mbtiQuestionTool, mbtiSaveTool } from "./tools/mbti";

const tools = [timeTool, mbtiQuestionTool, mbtiSaveTool]

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// const prompt =
//     `
//         You are an MBTI assessment bot. Based on the user's initial information, proceed with the MBTI personality test.
//         You need to provide user a question, not answer.
//         If last chat was a question, you can use mbtiSaveTool to save the answer of previous question, ensuring you provide the original question’s id and the chosen answer's index accurately.
//         You must use mbtiQuestionTool to retrieve the next MBTI question. Do not display the original question to the user; instead, rephrase it in your own words to keep the original hidden. 
//         Present a daily chat that can make a result.
//         Continue until all MBTI questions are answered. Once complete, analyze their responses and provide the user’s MBTI type.
//     `;
const prompt = 
    `
        You are an MBTI assessment bot. 
        Based on the user's initial information, ask user a question to proceed MBTI test.
        Start without asking.
        Original question(test problem) should be hidden.
    `;

const checkpointer = new MemorySaver();

const agent = createReactAgent({
    llm: model,
    tools,
    messageModifier: prompt,
    checkpointerSaver: checkpointer,
});

const langGraphConfig = {
    configurable: {
        thread_id: "llmbti",
    },
};

async function Invoke(message) {
    //Run
    const result = await agent.invoke(
        {
            messages: [{ role: "user", content: message }],
        },
        langGraphConfig
    );

    console.log(result);
    return result.messages[result.messages.length - 1].content;
    
    //Debug
    // const langGraphStream = await agent.stream(
    //     { messages: [{ role: "user", content: message }] },
    //     { streamMode: "updates" },
    //     langGraphConfig
    // );

    // for await (const step of langGraphStream) {
    //     console.log(step);
    // }
}

export default Invoke;
