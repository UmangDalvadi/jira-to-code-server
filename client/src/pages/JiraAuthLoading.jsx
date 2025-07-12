import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  Code,
  Zap,
} from "lucide-react";

const JiraAuthLoading = () => {
  const [status, setStatus] = useState("authenticating");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Connecting to Jira...");
  const [countdown, setCountdown] = useState(5);

  const redirectToVSCode = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    const vscodeUrl = `${
      import.meta.env.VITE_CALLBACK_URI
    }?status=${status}&message=${encodeURIComponent(
      message
    )}&code=${code}&state=${state}&error=${error}&atlassian-client-id=${
      import.meta.env.VITE_ATLASSIAN_CLIENT_ID
    }&atlassian-client-secret=${
      import.meta.env.VITE_ATLASSIAN_CLIENT_SECRET
    }&atlassian-redirect-uri=${import.meta.env.VITE_ATLASSIAN_REDIRECT_URI}`;
    window.location.href = vscodeUrl;
  };

  useEffect(() => {
    const steps = [
      { delay: 800, progress: 25, message: "Verifying credentials..." },
      {
        delay: 1600,
        progress: 50,
        message: "Establishing secure connection...",
      },
      { delay: 2400, progress: 75, message: "Finalizing authentication..." },
      {
        delay: 3200,
        progress: 100,
        message: "Authentication successful!",
        status: "success",
      },
    ];

    const timers = steps.map((step) =>
      setTimeout(() => {
        setProgress(step.progress);
        setMessage(step.message);
        if (step.status) setStatus(step.status);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (status === "success") {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            redirectToVSCode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-6 h-6" />
              <span className="text-lg font-semibold">Jira Authentication</span>
            </div>
            <p className="text-blue-100 text-sm">Secure OAuth2 Connection</p>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-6">
              {status === "authenticating" && (
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                  </div>
                </div>
              )}
              {status === "success" && (
                <div className="relative">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
              {status === "error" && (
                <AlertCircle className="w-16 h-16 text-red-500" />
              )}
            </div>

            {status === "authenticating" && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {status === "authenticating" && "Authenticating..."}
                {status === "success" && "Success!"}
                {status === "error" && "Authentication Failed"}
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>

            {status === "success" && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Connected to Jira successfully!
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You can now access your Jira tickets from VS Code.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        Redirecting to VS Code in {countdown}s
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <button
                  onClick={redirectToVSCode}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Continue to VS Code</span>
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Authentication failed</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">
                    Please try again or check your Jira permissions.
                  </p>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by VS Code Extension</p>
          <p className="mt-1">Secure OAuth2 • End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default JiraAuthLoading;
