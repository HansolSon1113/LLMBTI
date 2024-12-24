import { z } from "zod";
import { tool } from "@langchain/core/tools";

let mbtiData = {
    "Sociable" : 0,
    "Curious" : 0,
    "Empathetic" : 0,
    "Active" : 0,
    "Persistent" : 0,
    "Emotional" : 0,
    "Planful" : 0,
    "Reflective" : 0,
    "Creative" : 0,
};

function SaveResult(result) {
    if (result && typeof result === "object") {
        Object.keys(result).forEach((key) => {
            if (mbtiData.hasOwnProperty(key)) {
                mbtiData[key] += result[key];
            }
        });
        console.log("Updated MBTI Data:", mbtiData);
    } else {
        console.log("Invalid result or nothing to save.");
    }
}

const mbtiSaveSchema = z.object({
    operation: z
        .enum(["save"])
        .describe("What should this tool do."),
    result: z
        .record(z.string(), z.number())
        .describe("Object containing changes in all categories"),
});

const mbtiSaveTool = tool(
    async ({ operation, result }) => {
        if (operation === "save") {
            SaveResult(result);
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "MBTI_Save",
        description:
            "Store changes of categories(Sociable, Curious, Empathetic, Active, Persistent, Emotional, Planful, Reflective, Creative). Example result: {Active: 1, Plan: -1,}.",
        schema: mbtiSaveSchema,
    }
);

export { mbtiSaveTool };