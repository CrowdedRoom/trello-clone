import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY || "YOUR_OPENAI_API_KEY",
  organization: process.env.OPENAI_ORG_ID || "YOUR_OPENAI_ORGANIZATION_ID",
});

const openai = new OpenAIApi(configuration);

export default openai;
