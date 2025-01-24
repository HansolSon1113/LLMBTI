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
        "description": "List of tools which cannot be empty, contain timeTool, userInfoTool, or searchTool.",
        "items": {
          "type": "string",
          "enum": [
            "none",
            "timeTool",
            "userInfoTool",
            "searchTool"
          ]
        }
      },
      "search": {
        "type": "string",
        "description": "Thing to search or key of user data('Age', 'Job', 'Country', 'Interest').",
      }
    },
    "required": [
      "tools",
      "search"
    ],
    "additionalProperties": false
  },
  "strict": true
}

const toolPrompt =
  `
        당신은 사용자의 친구입니다. 
        직접 답할 수 없는 경우, 도구를 호출하여 정보를 반환하세요.
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

const chat = async (state) => {
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

  const toolResult = []
  toolCalls.forEach((tool) => {
    switch (tool) {
      case "timeTool":
        toolResult.push(timeTool());
        break
      case "userInfoTool":
        toolResult.push(userInfoTool(search));
        break
      case "searchTool":
        toolResult.push(searchTool(search));
        break
    }
  });

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
