import { z } from "zod";
import { tool } from "@langchain/core/tools";

let userData = {
    "Age" : 20,
    "Job" : "Student(CS)",
    "Country" : "Korea",
    "Interest" : "AI",
};

function GetUserData(){
    return userData
}

const userDataSchema = z.object({
    operation: z
        .enum(["get"])
        .describe("The operation tool do."),
});

const userInfoTool = tool(
    async ({ operation }) => {
        if (operation === "get") {
            GetUserData();
        } else {
            throw new Error("Invalid operation.");
        }
    },
    {
        name: "User_Info",
        description:
            "Give basic information about user.",
        schema: userDataSchema,
    }
);

export { userInfoTool };