import React, { useState } from "react";
import {
  Send,
  Code,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Settings,
  FileCode,
  TestTube,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

const JiraPipelineUI = () => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState(null);

  // const steps = [
  //   { id: 'fetch', icon: MessageSquare, label: 'Fetching Jira ticket', color: 'text-blue-500' },
  //   { id: 'parse', icon: Code, label: 'Parsing requirements', color: 'text-purple-500' },
  //   { id: 'generate', icon: FileCode, label: 'Generating code', color: 'text-green-500' },
  //   { id: 'test', icon: TestTube, label: 'Creating tests', color: 'text-orange-500' },
  //   { id: 'deploy', icon: GitBranch, label: 'Creating PR', color: 'text-indigo-500' },
  // ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setResults(null);

    try {
      const response = await axios.post(
        `${import.meta.env.API_DOMAIN}/api/jira/ticket-details`,
        { jiraUrl: input },
        { withCredentials: true }
      );

      console.log("response::::", response.data);
      setResults(response.data);
    } catch (err) {
      console.log("error while api call::", err);
      setResults({
        error: err.response?.data?.message || "Failed to process Jira ticket",
      });
    }

    setIsProcessing(false);
  };

  const isValidJiraUrl = (url) => {
    return (
      url.includes("atlassian.net/browse/") ||
      url.includes("jira.") ||
      url.match(/[A-Z]+-\d+/)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Jira-to-Code Pipeline
            </h1>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Welcome Section */}
          {/* {!isProcessing && !results && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transform Jira tickets into production-ready code
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Paste a Jira ticket URL and watch as we automatically generate code, tests, and create a pull request.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200">
                    <step.icon className={`w-8 h-8 ${step.color} mb-2`} />
                    <span className="text-sm font-medium text-gray-700 text-center">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your Jira ticket URL here... (e.g., https://your-org.atlassian.net/browse/DEV-123)"
                  className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isProcessing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isProcessing}
                  className="absolute bottom-3 right-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {input && !isValidJiraUrl(input) && (
                <div className="flex items-center space-x-2 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    Please enter a valid Jira ticket URL or ticket key (e.g.,
                    DEV-123)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Processing Steps */}
          {/* {isProcessing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing your request...</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                  
                  return (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : isActive ? (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className={`${isActive ? 'text-blue-600 font-medium' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* Results */}
          {/* {results && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Pipeline completed successfully!</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Jira Ticket</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-mono text-sm text-blue-600">{results.ticket.key}</p>
                      <p className="text-sm text-gray-700">{results.ticket.title}</p>
                      <p className="text-xs text-green-600 mt-1">Status: {results.ticket.status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Generated Files</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      {results.files.map((file, index) => (
                        <p key={index} className="font-mono text-sm text-gray-700">{file}</p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Git Integration</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 mb-1">Branch: <span className="font-mono text-blue-600">{results.branch}</span></p>
                      <p className="text-sm text-gray-700">Test Coverage: <span className="font-semibold text-green-600">{results.coverage}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pull Request</h4>
                    <a 
                      href={results.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>View PR</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setInput('');
                  setResults(null);
                }}
                className="mt-6 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Process another ticket
              </button>
            </div>
          )} */}

          {isProcessing && (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-blue-700 font-medium">
                Processing Jira ticket...
              </p>
            </div>
          )}

          {results?.extracted && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-10">
              {/* Pipeline Success */}
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Pipeline completed successfully!
                </h3>
              </div>

              {/* Requirements */}
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  📝 Requirements
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      Code Tasks
                    </h5>
                    <ul className="bg-gray-50 rounded-xl p-4 list-disc list-inside text-sm text-gray-800 space-y-1">
                      {results.extracted.requirements.codeTasks.map(
                        (task, idx) => (
                          <li key={idx}>{task}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      Acceptance Criteria
                    </h5>
                    <ul className="bg-gray-50 rounded-xl p-4 list-disc list-inside text-sm text-gray-800 space-y-1">
                      {results.extracted.requirements.acceptanceCriteria.map(
                        (criteria, idx) => (
                          <li key={idx}>{criteria}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Code Files */}
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  📁 Code Files
                </h4>
                <div className="">
                  {Object.entries(results.extracted.code.fileMap).map(
                    ([filePath, content], idx) => (
                      <CodeBlock
                        key={idx}
                        filePath={filePath}
                        content={content}
                      />
                    )
                  )}
                </div>
              </section>

              {/* Test Files */}
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  🧪 Test Files
                </h4>
                <div className="grid  ">
                  {Object.entries(results.extracted.tests.fileMap).map(
                    ([filePath, content], idx) => (
                      <CodeBlock
                        key={idx}
                        filePath={filePath}
                        content={content}
                      />
                    )
                  )}
                </div>
              </section>

              {/* Git Integration */}
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  🔧 Git Integration
                </h4>
                <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm text-gray-800">
                  <p>
                    <strong>Branch:</strong>{" "}
                    <span className="font-mono text-blue-700">
                      {results.extracted.git.branchName}
                    </span>
                  </p>
                  <p>
                    <strong>Commit Message:</strong>{" "}
                    {results.extracted.git.commitMessage}
                  </p>
                  <div>
                    <strong>PR Summary:</strong>
                    <p className="mt-1">
                      {results.extracted.git.prDescription.summary}
                    </p>
                    <div className="mt-2">
                      <strong>Files Changed:</strong>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {results.extracted.git.prDescription.filesChanged.map(
                          (file, idx) => (
                            <li key={idx} className="font-mono">
                              {file}
                            </li>
                          )
                        )}
                      </ul>
                      {results.extracted.git.prDescription.jiraLink && (
                        <a
                          href={results.extracted.git.prDescription.jiraLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-2 inline-block"
                        >
                          View JIRA Ticket
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* QA & Review */}
              <section>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  📋 QA & Review
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      QA Test Steps
                    </h5>
                    <ul className="bg-gray-50 rounded-xl p-4 list-decimal list-inside text-sm text-gray-800 space-y-1">
                      {results.extracted.jiraComment.qaTestSteps.map(
                        (step, idx) => (
                          <li key={idx}>{step}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-700 mb-2">
                      Peer Review Checklist
                    </h5>
                    <ul className="bg-gray-50 rounded-xl p-4 list-disc list-inside text-sm text-gray-800 space-y-1">
                      {results.extracted.jiraComment.peerReviewChecklist.map(
                        (check, idx) => (
                          <li key={idx}>{check}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                {results.extracted.jiraComment.recommendedTransition && (
                  <div className="mt-4 text-sm">
                    <strong>Recommended Transition:</strong>{" "}
                    <span className="text-green-600">
                      {results.extracted.jiraComment.recommendedTransition}
                    </span>
                  </div>
                )}
              </section>

              {/* Reset Button */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    setInput("");
                    setResults(null);
                  }}
                  className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Process Another Ticket
                </button>
              </div>
            </div>
          )}

          {/* <pre>
            {JSON.stringify(results)}
          </pre> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          Powered by AI • Integrated with Void Editor • Built for developers
        </div>
      </footer>
    </div>
  );
};

export default JiraPipelineUI;

const CodeBlock = ({ filePath, content }) => (
  <div className="bg-gray-50 rounded-xl p-4 relative group hover:shadow transition">
    <p className="font-mono text-sm text-blue-700 mb-2">{filePath}</p>
    <pre className="text-xs bg-white border rounded p-3 overflow-auto max-h-64 scrollbar-hide">
      <code>{content}</code>
    </pre>
    <button
      onClick={() => navigator.clipboard.writeText(content)}
      className="absolute top-2 right-2 text-xs text-blue-600 hover:underline transition opacity-0 group-hover:opacity-100"
    >
      Copy
    </button>
  </div>
);
