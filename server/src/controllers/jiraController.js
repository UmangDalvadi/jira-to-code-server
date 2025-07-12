import axios from 'axios';
import dotenv from 'dotenv';
import { extractRequirementsWithLLM } from '../utils/openai.js';
import { extractDocsFromGemini } from '../llms/gemini.js';
import { extractCodeFromLLM } from '../llms/deepseek.js';

dotenv.config();

function extractTicketKey(jiraUrl) {
    const regex = /\/browse\/([A-Z]+-\d+)/i;
    const match = jiraUrl.match(regex);
    return match ? match[1] : null;
}

export async function fetchJiraTicketDetails(req, res) {
    try {
        const { jiraUrl } = req.body;

        console.log("jiraUrl::::::::::", jiraUrl)

        if (!jiraUrl) {
            return res.status(400).json({ error: 'jiraUrl is required' });
        }

        const issueKey = extractTicketKey(jiraUrl);
        if (!issueKey) {
            return res.status(400).json({ error: 'Invalid Jira ticket URL' });
        }
        console.log("issueKey:::::::::", issueKey)

        const jiraDomainMatch = jiraUrl.match(/^https:\/\/([^\/]+)/);
        if (!jiraDomainMatch) {
            return res.status(400).json({ error: 'Invalid Jira URL' });
        }

        const jiraDomain = jiraDomainMatch[1];
        console.log("jiraDomain::::::::::", jiraDomain)

        const apiUrl = `https://${jiraDomain}/rest/api/3/issue/${issueKey}`;
        console.log("apiUrl::::::::::::", apiUrl)

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.ATLASSIAN_EMAIL}:${process.env.ATLASSIAN_API_TOKEN}`).toString('base64')}`,
                'Accept': 'application/json'
            }
        });

        const issueData = response.data;
        console.log("issueData::::::::::::::::::::::::", issueData)

        return issueData;
    } catch (error) {
        console.error('Error fetching Jira ticket:', error);

        if (error.response) {
            return res.status(error.response.status).json({
                error: 'Failed to fetch Jira issue',
                details: error.response.data,
            });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function ticketDetails(req, res) {
    try {
        const ticket = await fetchJiraTicketDetails(req);

        console.log("ticket:::::::::::::::::::", ticket)

        // const llmResult = await extractRequirementsWithLLM(ticket);
        const Docs = await extractDocsFromGemini(ticket);

        console.log("Docs:::::::::::::::::::", Docs)

        res.json({
            ticket,
            extracted: Docs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process ticket' });
    }
}

export async function generateCode(req, res) {
    try {
        const { jiraDocs } = req.body;

        console.log("inside::::::::::generateCode:::::::::::::::::::", jiraDocs)

        if (!jiraDocs) {
            return res.status(400).json({ error: 'Jira documentation is required' });
        }

        const code = await extractCodeFromLLM(jiraDocs);
        console.log("Generated code:", code);
        res.json({ code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate code' });
    }
}