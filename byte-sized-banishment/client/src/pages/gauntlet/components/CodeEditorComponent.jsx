import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FaPython, FaJava, FaBolt, FaCode } from "react-icons/fa";
import { SiCplusplus, SiJavascript } from "react-icons/si";

const CodeEditorComponent = ({
  onCodeChange,
  value,
  language,
  question,
  error,
}) => {
  const [userSelectedLanguage, setUserSelectedLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [showError, setShowError] = useState(false);

  // --- Error Toast Visibility Handler ---
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 2000); // auto hide after 2s
      return () => clearTimeout(timer);
    }
  }, [error]);

  /** -------------------
   * Multi-Language Subjects
   ----------------------*/
  const isMultiLanguageSubject = (subject) => {
    if (!subject) return false;
    const subjectLower = subject.toLowerCase();
    return ["data structures", "algorithms", "dsa"].includes(subjectLower);
  };

  const getAvailableLanguages = () => [
    {
      id: "javascript",
      name: "JavaScript",
      icon: <SiJavascript className="text-yellow-400" />,
    },
    {
      id: "python",
      name: "Python",
      icon: <FaPython className="text-blue-400" />,
    },
    { id: "java", name: "Java", icon: <FaJava className="text-red-400" /> },
    { id: "cpp", name: "C++", icon: <SiCplusplus className="text-blue-600" /> },
  ];

  useEffect(() => {
    if (isMultiLanguageSubject(language)) {
      setAvailableLanguages(getAvailableLanguages());
      if (!userSelectedLanguage) setUserSelectedLanguage("javascript");
    } else {
      setAvailableLanguages([]);
      setUserSelectedLanguage(null);
    }
  }, [language, userSelectedLanguage]);

  const getLanguage = (subject) => {
    if (!subject) return "javascript";
    const subjectLower = subject.toLowerCase();
    if (isMultiLanguageSubject(subject) && userSelectedLanguage) {
      return userSelectedLanguage;
    }
    switch (subjectLower) {
      case "python":
        return "python";
      case "javascript":
      case "js":
        return "javascript";
      case "java":
        return "java";
      case "c++":
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  /** -------------------
   * Judge0-Compatible Boilerplates
   * (STDIN -> STDOUT)
   ----------------------*/
  const boilerplateTemplates = {
    javascript: `// ⚡ Example boilerplate (JavaScript)
// Judge0 reads input from STDIN and checks your printed output
// Use readline() pattern or fs.readFileSync(0,"utf-8")

const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim().split("\\n");

// Example: Add two numbers
const [a, b] = input[0].split(" ").map(Number);
console.log(a + b);`,

    python: `# ⚡ Example boilerplate (Python)
# Judge0 reads input from standard input and expects prints to stdout

# Example: Add two numbers
a, b = map(int, input().split())
print(a + b)`,

    java: `// ⚡ Example boilerplate (Java)
// Judge0 requires the class name as 'Main'
// Input -> Scanner(System.in), Output -> System.out.println

import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,

    cpp: `// ⚡ Example boilerplate (C++)
// Judge0 expects reading via cin and printing via cout

#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int a, b;
    cin >> a >> b;
    cout << (a + b) << "\\n";
    return 0;
}`,
  };

  const selectedLanguage = getLanguage(language);
  const editorValue = value || boilerplateTemplates[selectedLanguage];

  const handleReset = () => {
    onCodeChange(boilerplateTemplates[selectedLanguage]);
  };

  const handleLanguageChange = (newLanguage) => {
    setUserSelectedLanguage(newLanguage);
    onCodeChange(boilerplateTemplates[newLanguage]);
  };

  return (
    <div className="relative rounded-xl bg-black/80 border border-gray-700 shadow-lg overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-black/70">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <FaCode className="text-orange-400" />
          Language:{" "}
          <span className="font-semibold text-red-400">
            {selectedLanguage.toUpperCase()}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
        >
          Reset ⟳
        </button>
      </div>

      {/* Language Selector */}
      {availableLanguages.length > 0 && (
        <div className="flex gap-2 p-2 border-b border-gray-700 bg-black/60">
          {availableLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition 
                ${
                  selectedLanguage === lang.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {lang.icon} {lang.name}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      <Editor
        height="50vh"
        language={selectedLanguage}
        value={editorValue}
        onChange={onCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          automaticLayout: true,
          formatOnType: true,
        }}
      />

      {/* Input / Output Check Section */}
      {question?.testCases?.length > 0 && (
        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <h3 className="text-sm font-bold text-orange-400 mb-2">
            🧪 Sample Test Cases
          </h3>
          {question.testCases.map((tc, idx) => (
            <div key={idx} className="mb-3">
              <div className="text-xs text-gray-400">Input:</div>
              <pre className="bg-gray-800 text-green-300 rounded px-3 py-1 whitespace-pre-wrap">
                {tc.input}
              </pre>
              <div className="text-xs text-gray-400 mt-1">Expected Output:</div>
              <pre className="bg-gray-800 text-orange-300 rounded px-3 py-1 whitespace-pre-wrap">
                {tc.output}
              </pre>
            </div>
          ))}
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-md text-sm animate-fadeOut">
          ⚠ {error}
        </div>
      )}

      <style>
        {`
        @keyframes fadeOut {
          0% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fadeOut {
          animation: fadeOut 2s forwards;
        }
        `}
      </style>
    </div>
  );
};

export default CodeEditorComponent;
