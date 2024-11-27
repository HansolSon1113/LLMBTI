//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph/web";
import timeTool from "./tools/time";
import { mbtiQuestionTool, mbtiSaveTool } from "./tools/mbti";
import searchTool from "./tools/search"

const tools = [timeTool, mbtiQuestionTool, mbtiSaveTool, searchTool]

const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,   //Value should be in /.env
});

const prompt =
    `
        당신은 사용자와 일상적인 대화를 통해 MBTI 성격 유형을 분석하는 어시스턴트입니다.  
        모든 대화 이후에는 MBTI_Save 툴을 사용해 데이터를 저장합니다(저장할 내용이 없으면 -1, -1을 사용하세요).
        직접 질문을 하기보다는 대화 속에서 사용자의 성향을 파악해야 합니다.
        사용자의 말투, 표현, 감정 상태 등을 분석하여 성격 특성을 추출하세요.    
        초기 메시지에서 사용자의 기본 정보(나이, 직업, 국적, 흥미 등)이 주어집니다.
        초기 메시지를 응답할땐 MBTI_Question 툴을 사용하여 검사 항목들을 불러와야 합니다.
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
