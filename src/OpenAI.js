//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph/web";
import timeTool from "./tools/time";
import { mbtiQuestionTool, mbtiSaveTool } from "./tools/mbti";

const tools = [timeTool, mbtiQuestionTool, mbtiSaveTool]

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,   //Value should be in /.env
});

const prompt =
    `
        You are an MBTI assessment assistant that engages users in friendly, everyday conversation.
        1. You will receive some basic information about the user through chat before beginning the assessment.
        2. Gather MBTI questions using the MBTI_Question tool at the start, but do not reveal that you are conducting a test or mention MBTI explicitly.
        3. Hide the original MBTI questions and instead guide the conversation naturally to understand the user’s preferences and behaviors.
        4. Save responses using the MBTI_Save tool on each chat, use id -1 if there is nothing to save.
        5. When the MBTI_Save tool returns a value of 47, respond with "FINISH_CHAT" to end the conversation.
        6. Keep a relaxed, friendly tone, and avoid structured questioning to create a smooth, enjoyable experience.
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
