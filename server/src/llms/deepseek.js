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
                    role: "user",
                    content: `
                        You are an expert full-stack engineer.

                        Your task is to take the following software documentation (derived from a Jira ticket) and generate a complete, production-ready project based on it — from initial setup to deployment ready. The output should be written exactly like a professional developer would build a full-stack app manually in VS Code.

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
                        7. **No lorem ipsum, placeholders, or partial code** — assume real usage
                        8. Output the code in full blocks, with clear **file names** and **paths**, such as:

                        ✅ Output Example:

                            {
                                setup: {
                                    frontend: {
                                        commands: [
                                            "npm create vite@latest client -- --template react-ts",
                                            "cd client",
                                            "npx tailwindcss init -p",
                                        ]
                                    },
                                    backend: {
                                        commands: [
                                            "cd server",
                                            "npm init -y",
                                        ]
                                    }
                                },
                                structureExplanation: {
                                    frontend: {
                                        "client/src/pages": "All page-level React components with routing logic",
                                        "client/src/components": "Reusable UI components like Button, Card, etc.",
                                        "client/src/services": "API integration logic using Axios or fetch",
                                        "client/src/routes": "React Router DOM-based route configuration"
                                    },
                                    backend: {
                                        "server/routes": "Express routes for all endpoints",
                                        "server/controllers": "Business logic for route handlers",
                                        "server/services": "Functions that interact with external APIs or databases",
                                        "server/middleware": "Authentication, error handling, etc."
                                    }
                                },
                                files: {
                                    fileMap: {
                                        "client/src/pages/HomePage.tsx": "/* Full page component */",
                                        "client/src/index.css": "/* Full component */",
                                        "server/routes/weather.route.ts": "/* Express route */",
                                        "client/src/services/weatherApi.ts": "/* Axios integration */"
                                    }
                                },
                                tests: {
                                    fileMap: {
                                        "client/src/__tests__/HomePage.test.tsx": "/* Test cases */",
                                        "server/tests/weather.test.ts": "/* Express test with jest */"
                                    }
                                },
                                env: {
                                    "client/.env": "VITE_WEATHER_API_KEY=abc123",
                                    "client/.env.example": "VITE_WEATHER_API_KEY=",
                                    "server/.env": "PORT=4000\nWEATHER_API_KEY=abc123",
                                    "server/.env.example": "PORT=\nWEATHER_API_KEY="
                                },
                                git: {
                                    branchName: "feature/WEAT-1-implement-weather-comparison",
                                    commitMessage: "[WEAT-1] Implement weather comparison",
                                    prDescription: {
                                        summary: "Adds weather comparison page and backend integration with WeatherAPI.",
                                        filesChanged: [
                                            "client/src/pages/CompareWeather.tsx",
                                            "client/src/components/WeatherTable.tsx",
                                            "server/routes/weather.route.ts"
                                        ],
                                        jiraLink: "https://yourorg.atlassian.net/browse/WEAT-1"
                                    }
                                },
                                jiraComment: {
                                    qaTestSteps: [
                                        "1. Navigate to /compare",
                                        "2. Select 2 or more cities",
                                        "3. Check that weather appears correctly for each city"
                                    ],
                                    peerReviewChecklist: [
                                        "✅ Code follows lint rules",
                                        "✅ Handles loading & error states",
                                        "✅ ≥80% test coverage",
                                        "✅ Responsive design tested"
                                    ],
                                    recommendedTransition: "To Do → Code Review"
                                }
                            }

                            - Do not include any explanations or markdown headings or comments like // ==== FRONTEND ==== //,  // ==== Frontend: Pages ==== //,  // ==== BACKEND ==== //, // ==== GIT, PR, Jira, etc ==== // etc... I just need pure object. Just output these blocks only.
                            - Do not include npm run dev commands, i'll run them by myself just add all required things in package.json file.
                            - Do not include any dependencies or devDependencies with version numbers inside package.json.
                                Instead, provide all required dependencies and devDependencies as separate npm install commands for both frontend and backend setup.
                                These commands should install the latest versions (do not pin versions).                        
                                
                        ---

                        ✅ Tailwind CSS + Vite Setup Guide (2024+) Example
                        (below mentioned files you have to add those file like this, for tailwind setup no need to add postcss or tailwind.config files and all below mentioned is all aboud how setup tailwind css with vite):
                        just add vite.config.js, index.html, index.css like mentined below.

                        client/index.html:
                            <!doctype html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8" />
                                <link rel="icon" type="image/svg+xml" href="/vite.svg" />
                                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                <title>Vite + React</title>
                            </head>
                            <body>
                                <div id="root"></div>
                                <script type="module" src="/src/main.jsx"></script>
                            </body>
                            </html>

                        client/src/index.css:
                            @import "tailwindcss";

                            :root {
                            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
                            line-height: 1.5;
                            font-weight: 400;

                            color-scheme: light dark;
                            color: rgba(255, 255, 255, 0.87);
                            background-color: #242424;

                            font-synthesis: none;
                            text-rendering: optimizeLegibility;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            -webkit-text-size-adjust: 100%;
                            }

                            * {
                            box-sizing: border-box;
                            }

                            body {
                            margin: 0;
                            padding: 0;
                            min-width: 320px;
                            min-height: 100vh;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            }

                            #root {
                            min-height: 100vh;
                            }

                            .App {
                            min-height: 100vh;
                            }

                        client/vite.config.js:                           
                            import { defineConfig } from 'vite'
                            import react from '@vitejs/plugin-react'
                            import tailwindcss from '@tailwindcss/vite'

                            export default defineConfig({
                              plugins: [
                                tailwindcss(),
                                react()
                              ],
                            })
                        

                        client/package.json:
                            {
                            "name": "client",
                            "private": true,
                            "version": "0.0.0",
                            "type": "module",
                            "scripts": {
                                "dev": "vite",
                                "build": "vite build",
                                "lint": "eslint .",
                                "preview": "vite preview"
                            },
                             ...
                            }

                        ---

                        ✅ Express.js + TypeScript Backend Setup Guide Example:

                            1. Initialize Project
                            ---------------------
                            mkdir express-ts-backend && cd express-ts-backend
                            npm init -y

                            2. Install Dependencies
                            ------------------------
                            npm install express

                            3. Install Dev Dependencies
                            ----------------------------
                            npm install -D typescript ts-node-dev @types/node @types/express

                            4. Create tsconfig.json
                            ------------------------
                            Paste the following in tsconfig.json:

                            {
                            "compilerOptions": {
                                "target": "ES2020",
                                "module": "CommonJS",
                                "rootDir": "src",
                                "outDir": "dist",
                                "strict": true,
                                "esModuleInterop": true,
                                "skipLibCheck": true
                            },
                            "include": ["src"],
                            "exclude": ["node_modules"]
                            }

                            5. Add Project Structure
                            ------------------------
                            mkdir src
                            touch src/server.ts

                            6. Create src/server.ts
                            ------------------------
                            Paste the following:

                            import express, { Request, Response } from 'express';

                            const app = express();
                            const PORT = process.env.PORT || 5000;

                            app.use(express.json());

                            app.get('/', (req: Request, res: Response) => {
                            res.send('API is running 🚀');
                            });

                            app.listen(PORT, () => {
                            console.log("Server running on http://localhost:" + PORT);
                            });

                            7. Update package.json Scripts
                            ------------------------------
                            "scripts": {
                            "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
                            "build": "tsc",
                            "start": "node dist/server.js"
                            }

                            8. Run the Server
                            -----------------
                            npm run dev

                            Output:
                            Server running on http://localhost:5000

                        ---
                        ✅ Add README.md file in root and add all the setup commands of FE and BE into that README file also:
                        like,
                        README.md:
                            Backend Setup Instructions: 
                                'npm install express axios dotenv cors'
                                'npm install -D typescript ts-node-dev @types/node @types/express jest ts-jest supertest @types/supertest eslint prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser'
                            Frontend Setup Instructions:
                                'npm install axios react-router-dom @headlessui/react @heroicons/react'
                                'npm install -D tailwindcss postcss autoprefixer eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-react react-test-renderer @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest @types/jest'
                                'npm i vite @vitejs/plugin-react @tailwindcss/vite react @types/react'



                        ✅ Return ONLY the JSON inside a single \`\`\`json code block — like this:
                            \`\`\`json
                            { ...full object... }
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

    const raw = response.body.choices[0].message.content ?? "";

    try {
        // Clean triple backticks and parse JSON
        const cleaned = raw
            .trim()
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();

        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (err) {
        console.error("❌ Failed to parse LLM response as JSON:", err);
        throw new Error("Generated code format is invalid or unparsable.");
    }
}



