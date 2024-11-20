//Returns current time(For test)
import {z} from "zod";
import {tool} from "@langchain/core/tools";

const timeSchema = z.object({
    operation: z
        .enum(["current"])
        .describe("Current time."),
});

const timeTool = tool(
    async ({ operation }) => {
        if(operation === "current") {
            // return `${Date.now()}`;
            const now = new Date();
            return now.toLocaleString();
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "Time",
        description: "Gives current time.",
        schema: timeSchema,
    }
);

export default timeTool;