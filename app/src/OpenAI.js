//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph/web"
import timeTool from "./tools/time";
import { userInfoTool } from "./tools/userdata"
import searchTool from "./tools/search"

const tools = [timeTool, searchTool, userInfoTool]
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: "gpt-4o-mini", //json_schema result_format 지원 모델 필요
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,   //Value should be in /.env
}).bindTools(tools);

const checkpointer = new MemorySaver();

function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.additional_kwargs.tool_calls) {
    return "tools";
  }

  return "__end__";
}

const mbtiDataSchema = {
  "name": "mbti_data",
  "schema": {
    "type": "object",
    "properties": {
      "Sociable": {
        "type": "number",
        "description": "Score indicating sociability."
      },
      "Curious": {
        "type": "number",
        "description": "Score indicating curiosity."
      },
      "Empathetic": {
        "type": "number",
        "description": "Score indicating empathy."
      },
      "Active": {
        "type": "number",
        "description": "Score indicating activity level."
      },
      "Persistent": {
        "type": "number",
        "description": "Score indicating persistence."
      },
      "Emotional": {
        "type": "number",
        "description": "Score indicating emotional sensitivity."
      },
      "Planful": {
        "type": "number",
        "description": "Score indicating planning ability."
      },
      "Reflective": {
        "type": "number",
        "description": "Score indicating reflectiveness."
      },
      "Creative": {
        "type": "number",
        "description": "Score indicating creativity."
      }
    },
    "required": [
      "Sociable",
      "Curious",
      "Empathetic",
      "Active",
      "Persistent",
      "Emotional",
      "Planful",
      "Reflective",
      "Creative"
    ],
    "additionalProperties": false
  },
  "strict": true
}

const prompt =
  `
        당신은 사용자의 친구입니다.  
        사용자의 정보는 "User_Info" 도구를 사용해 가져올 수 있습니다.
    `;

const mbtiSystemPrompt =
  `
        당신은 전문 심리상담 시스템입니다.
        당신의 역할은 채팅에서 사용자의 성격 특성을 추출하는 것입니다.
    `

const mbtiHumanPrompt =
  `
        직전 대화는 사용자와 친구의 대화입니다. 
        당신은 사용자의 대화에서 Sociable, Curious, Empathetic, Active, Persistent, Emotional, Planful, Reflective, Creative에 해당하는 정도를 추출해야 합니다.
        각 특성을 key로 가지는 "mbtiData"라는 JSON Object로 다음과 같은 형식으로 응답하십시오:
        {
            "Sociable" : 0,
            "Curious" : 0,
            "Empathetic" : 0,
            "Active" : 0,
            "Persistent" : 0,
            "Emotional" : 0,
            "Planful" : 0,
            "Reflective" : 0,
            "Creative" : 0,
        }
        감지된 특성을 -2~2중 정수형으로 평가합니다.
        감지되지 않은 특성도 빠짐없이 있어야하며 이때는 0으로 처리합니다.
    `

//시스템 템플릿을 사용해 사용자의 채팅에 대한 답변 생성 후 두 mbti 프롬프트를 통해 결과 추출
const chat = async (state, config) => {
  const mbtiDB = config["configurable"]["db"];

  const templateResponse = await model.invoke([
    { role: "system", content: prompt },
    ...state.messages,
  ]);
  const lastUserMessage = state.messages[state.messages.length - 1];
  const mbtiResponse = await model.invoke([
    { role: "system", content: mbtiSystemPrompt },
    lastUserMessage,
    { role: "user", content: mbtiHumanPrompt }],
    {
      response_format: {
        type: "json_schema",
        json_schema: mbtiDataSchema //결과 형식 지정
      }
    }
  );
  const mbtiOutput = JSON.parse(mbtiResponse.content);

  mbtiDB.Update(mbtiOutput);
  return { messages: [templateResponse] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chat", chat)
  .addNode("tools", toolNode)
  .addEdge("__start__", "chat")
  .addEdge("tools", "chat")
  .addConditionalEdges("chat", shouldContinue)

const graph = workflow.compile({ checkpointer });

async function Invoke(message, config) {
  const result = await graph.invoke(
    {
      messages: [
        {
          role: "user",
          content: message
        }
      ],
    },
    {
      configurable: config //config = { thread_id: string, db: mbtiDatabase }
    }
  );

  console.log(result);
  return result.messages[result.messages.length - 1].content;
}

export default Invoke;
