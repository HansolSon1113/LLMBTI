import { z } from "zod";
import { tool } from "@langchain/core/tools";

let questions = [
    {
        id: 0,
        question: "WHEN YOU GO SOMEWHERE FOR THE DAY, WOULD YOU RATHER",
        options: ["PLAN WHAT YOU WILL DO AND WHEN", "JUST GO"]
    },
    {
        id: 1,
        question: "IF YOU WERE A TEACHER, WOULD YOU RATHER TEACH",
        options: ["FACT COURSES", "COURSES INVOLVING THEORY"]
    },
    {
        id: 2,
        question: "ARE YOU USUALLY",
        options: ["A 'GOOD MIXER'", "RATHER QUIET AND RESERVED"]
    },
    {
        id: 3,
        question: "DO YOU MORE OFTEN LET",
        options: ["YOUR HEART RULE YOUR HEAD", "YOUR HEAD RULE YOUR HEART"]
    },
    {
        id: 4,
        question: "IN DOING SOMETHING THAT MANY OTHER PEOPLE DO, DOES IT APPEAL TO YOU MORE TO",
        options: ["INVENT A WAY OF YOUR OWN", "DO IT IN THE ACCEPTED WAY"]
    },
    {
        id: 5,
        question: "AMONG YOUR FRIENDS ARE YOU",
        options: ["FULL OF NEWS ABOUT EVERYBODY", "ONE OF THE LAST TO HEAR WHAT IS GOING ON"]
    },
    {
        id: 6,
        question: "DOES THE IDEA OF MAKING A LIST OF WHAT YOU SHOULD GET DONE OVER A WEEKEND",
        options: ["APPEAL TO YOU", "LEAVE YOU COLD", "POSITIVELY DEPRESS YOU"]
    },
    {
        id: 7,
        question: "WHEN YOU HAVE A SPECIAL JOB TO DO, DO YOU LIKE TO",
        options: ["ORGANIZE IT CAREFULLY BEFORE YOU START", "FIND OUT WHAT IS NECESSARY AS YOU GO ALONG"]
    },
    {
        id: 8,
        question: "DO YOU TEND TO HAVE",
        options: ["BROAD FRIENDSHIPS WITH MANY DIFFERENT PEOPLE", "DEEP FRIENDSHIP WITH VERY FEW"]
    },
    {
        id: 9,
        question: "DO YOU USUALLY GET ALONG BETTER WITH",
        options: ["REALISTIC PEOPLE", "IMAGINATIVE PEOPLE"]
    },
    {
        id: 10,
        question: "WHEN YOU ARE WITH THE GROUP OF PEOPLE, WOULD YOU USUALLY RATHER",
        options: ["JOIN IN THE TALK OF THE GROUP", "START A CONVERSATION OF YOUR OWN"]
    },
    {
        id: 11,
        question: "IS IT A HIGHER COMPLIMENT TO BE CALLED",
        options: ["A PERSON OF REAL FEELING", "A CONSISTENTLY REASONABLE PERSON"]
    },
    {
        id: 12,
        question: "IN READING FOR PLEASURE, DO YOU",
        options: ["ENJOY ODD OR ORIGINAL WAYS OF SAYING THINGS", "LIKE WRITERS TO SAY EXACTLY WHAT THEY MEAN"]
    },
    {
        id: 13,
        question: "DO YOU",
        options: ["TALK EASILY TO ALMOST ANYONE FOR AS LONG AS YOU HAVE TO", "FIND A LOT TO SAY ONLY TO CERTAIN PEOPLE OR UNDER CERTAIN CONDITIONS"]
    },
    {
        id: 14,
        question: "DOES FOLLOWING A SCHEDULE",
        options: ["APPEAL TO YOU", "CRAMP YOU"]
    },
    {
        id: 15,
        question: "WHEN IT IS SETTLED WELL IN ADVANCE THAT YOU WILL DO A CERTAIN THING AT A CERTAIN TIME, DO YOU FIND IT",
        options: ["NICE TO BE ABLE TO PLAN ACCORDINGLY", "A LITTLE UNPLEASANT TO BE TIED DOWN"]
    },
    {
        id: 16,
        question: "ARE YOU MORE SUCCESSFUL",
        options: ["AT FOLLOWING A CAREFULLY WORKED OUT PLAN", "AT DEALING WITH THE UNEXPECTED AND SEEING QUICKLY WHAT SHOULD BE DONE"]
    },
    {
        id: 17,
        question: "WOULD YOU RATHER BE CONSIDERED",
        options: ["A PRACTICAL PERSON", "AN INGENIOUS PERSON"]
    },
    {
        id: 18,
        question: "IN A LARGE GROUP, DO YOU MORE OFTEN",
        options: ["INTRODUCE OTHERS", "GET INTRODUCED"]
    },
    {
        id: 19,
        question: "DO YOU USUALLY",
        options: ["VALUE SENTIMENT MORE THAN LOGIC", "VALUE LOGIC MORE THAN SENTIMENTS"]
    },
    {
        id: 20,
        question: "WOULD YOU RATHER HAVE AS A FRIEND",
        options: ["SOMEONE WHO IS ALWAYS COMING UP WITH NEW IDEAS", "SOMEONE WHO HAS BOTH FEET ON THE GROUND"]
    },
    {
        id: 21,
        question: "CAN THE NEW PEOPLE YOU MEET TELL WHAT YOU ARE INTERESTED IN",
        options: ["RIGHT AWAY", "ONLY AFTER THEY REALLY GET TO KNOW YOU"]
    },
    {
        id: 22,
        question: "IN YOUR DAILY WORK, DO YOU",
        options: ["USUALLY PLAN YOUR WORK SO YOU WON’T NEED TO WORK UNDER PRESSURE", "RATHER ENJOY AN EMERGENCY THAT MAKES YOU WORK AGAINST TIME", "HATE TO WORK UNDER PRESSURE"]
    },
    {
        id: 23,
        question: "DO YOU USUALLY",
        options: ["SHOW YOUR FEELINGS FREELY", "KEEP YOUR FEELINGS TO YOURSELF"]
    },
    {
        id: 24,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["SCHEDULED", "UNPLANNED"]
    },
    {
        id: 25,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["FACTS", "IDEAS"]
    },
    {
        id: 26,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["QUIET", "HEARTY"]
    },
    {
        id: 27,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["CONVINCING", "TOUCHING"]
    },
    {
        id: 28,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["IMAGINATIVE", "MATTER-OF-FACT"]
    },
    {
        id: 29,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["BENEFITS", "BLESSINGS"]
    },
    {
        id: 30,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["PEACEMAKER", "JUDGE"]
    },
    {
        id: 31,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["SYSTEMATIC", "SPONTANEOUS"]
    },
    {
        id: 32,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["STATEMENT", "CONCEPT"]
    },
    {
        id: 33,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["RESERVED", "TALKATIVE"]
    },
    {
        id: 34,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["ANALYZE", "SYMPATHIZE"]
    },
    {
        id: 35,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["CREATE", "MAKE"]
    },
    {
        id: 36,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["DETERMINED", "DEVOTED"]
    },
    {
        id: 37,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["GENTLE", "FIRM"]
    },
    {
        id: 38,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["SYSTEMATIC", "CASUAL"]
    },
    {
        id: 39,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["CERTAINTY", "THEORY"]
    },
    {
        id: 40,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["CALM", "LIVELY"]
    },
    {
        id: 41,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["JUSTICE", "MERCY"]
    },
    {
        id: 42,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["FASCINATING", "SENSIBLE"]
    },
    {
        id: 43,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["FIRM-MINDED", "WARMHEARTED"]
    },
    {
        id: 44,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["FEELING", "THINKING"]
    },
    {
        id: 45,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["LITERAL", "FIGURATIVE"]
    },
    {
        id: 46,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["FORESIGHT", "COMPASSION"]
    },
    {
        id: 47,
        question: "WHICH WORD APPEALS TO YOU MORE?",
        options: ["HARD", "SOFT"]
    }
];

function GetQuestion() {
    return questions;
}

const mbtiQuestionSchema = z.object({
    operation: z
        .enum(["item"])
        .describe("Gives all MBTI test questions."),
});

const mbtiQuestionTool = tool(
    async ({ operation }) => {
        if (operation === "item") {
            return `${GetQuestion()}`;
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "MBTI_Question",
        description: "Gives all MBTI test questions.",
        schema: mbtiQuestionSchema,
    }
);

function SaveResult(question, result) {
    if (question !== -1) {
        console.log(`${question}: ${result}`);
    }
    else {
        console.log("Nothing to save.");
    }
}

const mbtiSaveSchema = z.object({
    operation: z
        .enum(["save"])
        .describe("Saves result of one MBTI question."),
    questionNumber: z.number().describe("The id of the question to save."),
    resultNumber: z.number().describe("The index of result."),
});

var i = 0;

const mbtiSaveTool = tool(
    async ({ operation, questionNumber, resultNumber }) => {
        if (operation === "save") {
            SaveResult(questionNumber, resultNumber);
            return `${++i}`;
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "MBTI_Save",
        description: "Saves result of one MBTI question.",
        schema: mbtiSaveSchema,
    }
);

export { mbtiQuestionTool, mbtiSaveTool };