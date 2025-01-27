//Handling OpenAI API
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, MemorySaver } from "@langchain/langgraph/web"
import timeTool from "./tools/time";
import userInfoTool from "./tools/userdata"
import searchTool from "./tools/search"

//모델 설정
const model = new ChatOpenAI({
  model: "gpt-4o", //json_schema result_format 지원 모델 필요
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,   //Value should be in /.env
});

//메모리(thread_id로 구분 가능)
const checkpointer = new MemorySaver();

//AI로부터 반환받을 형식
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

const toolSchema = {
  "name": "chat_structure",
  "schema": {
    "type": "object",
    "properties": {
      "tools": {
        "type": "array",
        "description": 'List of tools to call. Cannot be empty, use "" if nothing to call.',
        "items": {
          "type": "string",
          "enum": [
            "",
            "timeTool",
            "userInfoTool",
            "searchTool"
          ]
        }
      },
      "search": {
        "type": "array",
        "description": 'List of keywords to search.',
        "items": {
          "type": "string"
        }
      },
      "userData": {
        "type": "array",
        "description": 'List of user data keys to fetch.',
        "items": {
          "type": "string",
          "enum": [
            "Age",
            "Job",
            "Country",
            "Interest"
          ]
        }
      }
    },
    "required": [
      "tools",
      "search",
      "userData"
    ],
    "additionalProperties": false
  },
  "strict": true
}

const toolPrompt =
  `
        당신은 사용자의 친구입니다.
        가능한 친근하게 답하고 너무 긴 답변은 피하십시오.
        사용자가 존칭을 먼저 사용한게 아니라면 존대는 피하십시오.
        당신에 대해 말해야할 경우 사용자의 정보를 활용해 적합한 캐릭터와 상황을 만들어 답하십시오.
        직접 답할 수 없는 경우, 도구를 호출하여 정보를 반환하세요.
        도구 여러개를 호출하거나 여러 검색, 유저 정보 가져오기를 한번에 할 수 있습니다.
        단 tools에는 중복이 없어야 합니다.
    `;

const chatPrompt =
  `
        당신은 사용자의 친구입니다. 
        도구의 응답이 존재한다면 활용하여 답변하세요.
        도구의 응답:
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
        감지된 특성을 -2(매우 낮음), -1(다소 낮음), 0, 1(다소 높음), 2(매우 높음)중 정수형으로 평가합니다.
        감지되지 않은 특성도 빠짐없이 있어야하며 이때는 0으로 처리합니다.
    `

const mbti = async (state, config) => {
  const lastUserMessage = state.messages[state.messages.length - 1];
  const mbtiDB = config["configurable"]["db"];

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
};

//도구 실행
function toolExecution(toolCalls, userData, search) {
  const promises = toolCalls.flatMap((tool) => {
    switch (tool) {
      case "timeTool":
        return [timeTool()];
        
      case "userInfoTool":
        //userData 배열의 모든 항목에 대해 userInfoTool 실행
        return userData
          .filter((key) => key && key.trim() !== "")
          .map((key) => userInfoTool(key));
        
      case "searchTool":
        //search 배열의 모든 항목에 대해 searchTool 실행
        return search
          .filter((query) => query && query.trim() !== "")
          .map((query) => searchTool(query));
        
      default:
        return [];
    }
  });

  return Promise.all(promises);
}

const chat = async (state) => {
  //호출할 도구 반환
  const toolResponse = await model.invoke([
    { role: "system", content: toolPrompt },
    ...state.messages,],
    {
      response_format: {
        type: "json_schema",
        json_schema: toolSchema
      }
    });
  const output = JSON.parse(toolResponse.content);
  const toolCalls = output.tools;
  const search = output.search;
  const userData = output.userData;

  //도구 실행후 결과 반환
  const toolResult = await toolExecution(toolCalls, userData, search);

  //도구의 결과를 반영해 결과 생성
  const chatResponse = await model.invoke([
    { role: "system", content: chatPrompt + toolResult, },
    ...state.messages,
  ]);

  return { messages: [chatResponse] };
};

//Langgraph graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("mbti", mbti)
  .addNode("chat", chat)
  .addEdge("__start__", "mbti")
  .addEdge("mbti", "chat")
  .addEdge("chat", "__end__")

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
