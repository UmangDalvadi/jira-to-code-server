import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function extractDocsFromGemini(ticket, jiraUrl) {
    const title = ticket.fields.summary;
    const description = ticket.fields.description?.content?.map(block => block.content?.map(c => c.text).join(" ")).join(" ") || 'No description provided.';
    const ticketKey = ticket.key;
    const projectName = ticket.fields.project?.name || "Unknown Project";
    const labels = ticket.fields.labels || [];
    const priority = ticket.fields.priority?.name || "Not specified";
    const status = ticket.fields.status?.name || "Backlog";

    const prompt = `
            You are a senior software architect and technical product writer.

            Your job is to read a Jira ticket describing a software feature or task, and generate a **production-ready technical specification document** (not code).

            This document will later be used by another LLM or development team to implement the full application feature from scratch. Your output must **not include any code** — only structured technical guidance.

            ---

            ## 🧾 Expected Output Format

            Generate a document structured like this:

            ---

            ### 📌 1. Feature Overview
            - Clear explanation of the feature or task
            - Why it’s important
            - Who the users are
            - Key business or user goals

            ---

            ### 🧱 2. Recommended Tech Stack
            List suitable technologies for:
            - Frontend (e.g., React with Vite + Tailwind)
            - Backend (e.g., Node.js + Express)
            - Database (if needed)
            - External APIs or integrations
            - Dev tools, libraries, and testing tools

            Explain briefly *why* each is suitable.

            ---

            ### 📁 3. Project Structure
            Describe an ideal high-level folder and file structure:
            - Frontend folder structure (pages, components, routes, services)
            - Backend folder structure (routes, controllers, models, config)

            Use words, not code. Explain the purpose of each folder.

            ---

            ### 🏗️ 4. Feature Flow Breakdown
            Break the feature into step-by-step functional parts:
            - What backend endpoints are required and what they do (names only, not code)
            - What pages/screens are needed in the frontend
            - What components each screen will have
            - How data will flow between frontend and backend
            - API requests the frontend will make

            ---

            ### 🔌 5. API + Integration Requirements
            List:
            - External APIs that need to be used (e.g., weather APIs)
            - What endpoints to call
            - What data inputs are required and what output is expected
            - Any API limits, rate limits, or keys needed

            ---

            ### 🔒 6. Authentication & Authorization (If applicable)
            - Whether login/signup is needed
            - Which parts of the app are protected
            - How auth will be handled (e.g., JWT, OAuth)

            ---

            ### 📦 7. Environment Variables & Configuration
            Describe:
            - What .env variables will be needed
            - Where they will be used (API keys, ports, DB URLs, etc.)
            - How to manage them securely in local and production environments

            ---

            ### 🧪 9. Testing Strategy
            Mention:
            - What parts of the system should be tested
            - What tools to use (e.g., Jest, React Testing Library, Supertest)
            - Whether manual or automated testing is recommended

            ---

             ### 10. Git & Collaboration Automation
            Generate the following Git operations:
            - Branch name: \`feature/${ticketKey}-${title.toLowerCase().replace(/\\s+/g, '-')}\`
            - Commit message and PR:
            - **Title**: \`[${ticketKey}] ${title}\`
            - **Description**:
                - Summary of changes
                - List of files created/modified
                - Link to original Jira ticket: ${jiraUrl}

            ---

            ### 11. Jira Ticket Enhancements
            Generate a comment for the Jira ticket containing:
            - **QA Test Steps** (e.g., "1. Go to /compare; 2. Select multiple cities; 3. Verify correct weather data")
            - **Peer Review Checklist** (e.g., "✅ Code follows lint rules", "✅ Handles edge cases", "✅ Test coverage ≥80%")
            - Ticket transition recommendation (e.g., ${status} → Code Review)

            ---

            ### 🧾 Jira Ticket Metadata:
            - **Title**: ${title}
            - **Description**: ${description}
            - **Ticket Key**: ${ticketKey}
            - **Project**: ${projectName}
            - **Labels**: ${labels.join(', ') || '[]'}
            - **Priority**: ${priority}
            - **Status**: ${status}

            ---

            ### 🌟 12. Optional Enhancements
            Suggest extra improvements like:
            - Search/filter
            - Caching
            - Error boundaries
            - Responsive design
            - CI/CD setup
            - Accessibility considerations

         `;

    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}
