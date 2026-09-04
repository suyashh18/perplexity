import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage, } from "@langchain/core/messages";
import { Mistral } from "@mistralai/mistralai";
import {tool, createAgent} from 'langchain'
import * as z from 'zod'
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

const client = new Mistral({
  apiKey: process.env.MISTRAL_API,
});


const searchInternetTool = tool(searchInternet,{
  name:"searchInternet",
  description:"use this tool to get the latest information from the internet",
  schema:z.object({
    query:z.string().describe("the search query to look up on the internet")
  })
})

const agent = createAgent({
  model:geminiModel,
  tools:[searchInternetTool]
})
  



export async function generateResponse(messages) {
    console.log(messages)

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...(messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            })) ]
    });

    return response.messages[ response.messages.length - 1 ].text;

}

export async function generateChatTitle(message) {
  const response = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [
      {
        role: "system",
        content: `You are an AI that generates chat titles.

Rules:
- 2-4 words
- No quotes
- No punctuation
- Return only the title`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0].message.content.trim();
}