import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.DEEPSEEK_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function extractCodeFromLLM(jiraDocs) {

    const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token),
    );

    console.log("Inside DeepSeek LLM extraction function");

    const response = await client.path("/chat/completions").post({
        body: {
            messages: [
                {
                    role: "user", content: `
                    You are an expert full-stack engineer.

                    Your task is to take the following software documentation (derived from a Jira ticket) and generate a complete, production-ready project based on it — from initial setup to deployment. The output should be written exactly like a professional developer would build a full-stack app manually in VS Code.

                    ---

                    ### 📄 Guidelines for the Generated Output:

                    ✅ **Include the following:**

                    1. **Project setup commands** for both frontend and backend, using the appropriate tech stack as described in the documentation.
                    2. **Folder structure explanation**
                    3. **Every required file**: create it as if writing each file in VS Code, including:
                    - 'package.json', 'vite.config.ts', '.env', 'index.ts', etc.
                    - React pages, components, and routes
                    - Express routes, controllers, middleware
                    - API service files and integration logic
                    4. **Frontend logic**:
                    - Use Vite + React + TypeScript + Tailwind
                    - Create components and pages as per the documentation
                    - Include data fetching (e.g., Axios), routing (React Router), and basic loading/error handling
                    5. **Backend logic**:
                    - Setup Express server with endpoints as described
                    - Handle routes, controllers, services
                    - Integrate external APIs (like WeatherAPI, etc.)
                    6. **Environment management**: Show example '.env' files and how to use them.
                    7. **Deployment-ready config** for Vercel (frontend) and Railway or Render (backend)
                    8. **No lorem ipsum, placeholders, or partial code** — assume real usage
                    9. Output the code in full blocks, with clear **file names** and **paths**, such as:

                    \`\`\`ts title="client/src/pages/HomePage.tsx"
                    // content
                    \`\`\`

                    \`\`\`ts title="server/routes/weather.route.ts"
                    // content
                    \`\`\`

                    ---

                    ### 🧾 Input Documentation:

                    ${jiraDocs}

                    Now generate the full source code with complete structure, file by file.
                    `}
            ],
            temperature: 1,
            top_p: 1,
            model: model
        }
    });

    if (isUnexpected(response)) {
        throw response.body.error;
    }

    // console.log(response.body.choices[0].message.content);

    return response.body.choices[0].message.content;
}



