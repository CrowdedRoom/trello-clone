import {NextResponse} from "next/server";
import openai from "@/openai";
export async function POST(request: Request) {
  // todos in the body of the POST request
  const {todos} = await request.json();
  console.log(todos);

  // communicate with OpenAI GPT
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "You are a AI assistant who provides a helpful summary of a given set of tasks. When responding, limit response to 300 characters",
      },
      {
        role: "user",
        content: `Hi there, I am DJ, provide a summary of the following tasks. Count how many tasks there are in each category and provide any tips or suggestions on how to best tackle the tasks. Here is the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const {data} = response;

  return NextResponse.json(data.choices[0].message);
}
