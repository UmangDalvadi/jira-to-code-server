import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID;
const CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET;

export const jiraAuthMiddleware = async (req, res, next) => {
  const accessToken = req.cookies?.jira_access_token;
  const refreshToken = req.cookies?.jira_refresh_token;

  console.log("accessToken:::::::::::", accessToken)

  // If access token is present, allow request to proceed
  if (accessToken) {
    req.accessToken = accessToken
    return next();
  }

  // If access token is missing but refresh token exists, try refreshing the token
  if (refreshToken) {
    try {
      const response = await axios.post('https://auth.atlassian.com/oauth/token', {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Store the new access and refresh tokens in cookies
      res.cookie('jira_access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expires_in * 1000,
      });

      res.cookie('jira_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return next(); // Now we have a valid token
    } catch (err) {
      console.error('Failed to refresh token:', err.response?.data || err.message);
      // Clear invalid refresh token
      res.clearCookie('jira_refresh_token');
      return res.redirect(`${process.env.API_DOMAIN}/api/auth/jira`); // Re-initiate OAuth
    }
  }

  console.log("redirect to auth:::::::::::::::::::")

  // If no tokens, initiate the OAuth flow
  return res.redirect(`${process.env.API_DOMAIN}/api/auth/jira`);
};
