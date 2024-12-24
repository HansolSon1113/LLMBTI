//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph/web"
import { MemorySaver } from "@langchain/langgraph/web";
import timeTool from "./tools/time";
import { mbtiQuestionTool, mbtiSaveTool } from "./tools/mbti";
import searchTool from "./tools/search"

const tools = [timeTool, mbtiSaveTool, searchTool]
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,   //Value should be in /.env
}).bindTools(tools);

const prompt =
    `
        당신은 사용자와 일상적인 대화를 통해 MBTI 성격 유형을 분석하는 어시스턴트입니다.  
        사용자의 질문에 답변하려면 반드시 "MBTI_Save" 도구를 호출해야 합니다.
        직접 질문을 하기보다는 대화 속에서 사용자의 성향을 파악해야 합니다.
        사용자의 말투, 표현, 감정 상태 등을 분석하여 성격 특성을 추출하세요.    
        초기 메시지에서 사용자의 기본 정보(나이, 직업, 국적, 흥미 등)이 주어집니다.
    `;

const checkpointer = new MemorySaver();

function shouldContinue({ messages }) {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.additional_kwargs.tool_calls) {
        return "tools";
    }

    return "__end__";
}

async function callModel(state) {
    const response = await model.invoke(state.messages);

    return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);

const graph = workflow.compile();

// const agent = createReactAgent({
//     llm: model,
//     tools,
//     messageModifier: prompt,
//     checkpointerSaver: checkpointer,
// });

// const langGraphConfig = {
//     configurable: {
//         thread_id: "llmbti",
//     },
// };

let prevState = {messages: [new HumanMessage("Age: 20, Country: Korea")]};

async function Invoke(message) {
    const result = await graph.invoke(
        {
            messages: [...prevState.messages, new HumanMessage(message)],
        },
    );

    console.log(result);
    prevState = result;
    console.log(prevState);
    return result.messages[result.messages.length - 1].content;
}

export default Invoke;
