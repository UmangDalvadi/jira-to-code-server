// src/controllers/authController.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID;
const CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET;
const REDIRECT_URI = process.env.ATLASSIAN_REDIRECT_URI; // e.g., http://localhost:3000/api/auth/jira/callback

// Step 1: Redirect user to Atlassian OAuth Consent Screen
export const redirectToAtlassian = (req, res) => {
  const scopes = [
    'read:me',
    'read:jira-work',
    'read:account',
    'offline_access',
  ];

  const scopeStr = scopes.join(' ');

  const redirectBack = req.query.redirect || '/'; // path to redirect after login
  const stateObj = { redirect: redirectBack };
  const state = encodeURIComponent(JSON.stringify(stateObj)); // encode state safely

  const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
    scopeStr
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&response_type=code&prompt=consent`;

  console.log("redirect to atllasian auth::::::::::::::::::", authUrl)
  res.redirect(authUrl);
};

// Step 2: Handle OAuth callback and exchange code for access token
export const handleAtlassianCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const response = await axios.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Set access token cookie
    res.cookie('jira_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in * 1000,
    });

    // Set refresh token cookie (valid for ~30 days)
    res.cookie('jira_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to your app's frontend/dashboard after successful login
    return res.redirect(process.env.FRONTEND_DOMAIN || 'http://localhost:5173'); // Replace with your frontend URL
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
};
