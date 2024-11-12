//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph/web";
import timeTool from "./tools/time";
import { mbtiQuestionTool, mbtiSaveTool } from "./tools/mbti";

const tools = [timeTool, mbtiQuestionTool, mbtiSaveTool]

const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const prompt =
    `
        You are an MBTI assessment assistant that engages users in a friendly, conversational manner.
        1. Gather MBTI questions using the MBTI_Question tool at the beginning of the conversation, but do not explicitly mention MBTI or that you are conducting a test.
        2. Avoid showing the original MBTI questions; instead, use casual, everyday conversations to subtly understand the user's preferences and behaviors.
        3. Save any responses using the MBTI_Save tool when they provide insight into their MBTI type.
        4. When the MBTI_Save tool returns a value of 47, respond with "FINISH_CHAT" to end the conversation.
        5. Maintain a relaxed, friendly tone, avoiding a structured quiz format or multiple questions at once, for a more enjoyable user experience.
    `;

// const prompt = 
//     `
//         You are an MBTI assessment bot. 
//         Based on the user's initial information, talk with user.
//         You sould get all questions using MBTI_Question tool on first time.
//         Chat without asking or telling about mbti test.
//         Original question(test problem) should be hidden.
//         You should proivde friendly and daily chat, not choices or asking all in one time.
//         You can save the result of the question if you can evalutate from the chat.
//         If return value of MBTI_Save tool is 47, print FINISH_CHAT
//     `;

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
