import React, { useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaQuestion,
  FaListOl,
  FaCheck,
  FaCode,
  FaHashtag,
  FaLayerGroup,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const initialState = {
  subject: "",
  prompt: "",
  type: "mcq",
  difficulty: "easy",
  options: ["", "", "", ""],
  correctAnswer: "",
  testCases: [{ input: "", output: "" }],
  subTopic: "",
};

const QuestionUploadPage = () => {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const handleTestCaseChange = (idx, field, value) => {
    const newTestCases = [...form.testCases];
    newTestCases[idx][field] = value;
    setForm((prev) => ({ ...prev, testCases: newTestCases }));
  };

  const addTestCase = () => {
    setForm((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "" }],
    }));
  };

  const removeTestCase = (idx) => {
    setForm((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Adjust the endpoint as needed
      await axios.post("/api/admin/upload-question", form);
      setMessage("Question uploaded successfully!");
      setForm(initialState);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error uploading question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-0">
      <div className="bg-gradient-to-br from-black/80 via-green-900/60 to-black/80 border-2 border-green-500/40 rounded-2xl shadow-2xl shadow-green-900/30 p-8 backdrop-blur-md">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-6 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-bold shadow border border-gray-600 transition-all"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 mb-8 tracking-wider text-center drop-shadow-lg">
          <FaBook className="inline-block mr-2 mb-1 text-green-400" /> Upload
          New Question
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
              <FaLayerGroup /> Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 placeholder-gray-500 transition-all outline-none shadow-inner"
              placeholder="e.g. Data Structures"
              required
            />
          </div>
          <div className="relative">
            <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
              <FaQuestion /> Prompt
            </label>
            <textarea
              name="prompt"
              value={form.prompt}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 placeholder-gray-500 transition-all outline-none shadow-inner min-h-[90px]"
              placeholder="Enter the question prompt here..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
                <FaListOl /> Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 transition-all outline-none shadow-inner"
              >
                <option value="mcq">MCQ</option>
                <option value="code">Code</option>
                <option value="integer">Integer</option>
                <option value="description">Description</option>
              </select>
            </div>
            <div>
              <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
                <FaCheck /> Difficulty
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 transition-all outline-none shadow-inner"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          {form.type === "mcq" && (
            <div>
              {/* ...existing code... */}
              <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
                <FaListOl /> Options
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-black/40 border border-green-800 rounded-lg p-2"
                  >
                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 p-2 rounded bg-transparent text-green-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder={`Option ${idx + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={form.correctAnswer === String(idx)}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          correctAnswer: String(idx),
                        }))
                      }
                      className="accent-green-500"
                    />
                    <span className="text-xs text-green-300">Correct</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(form.type === "code" || form.type === "integer") && (
            <div>
              <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
                <FaHashtag /> Correct Answer
              </label>
              <input
                name="correctAnswer"
                value={form.correctAnswer}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 placeholder-gray-500 transition-all outline-none shadow-inner"
                placeholder="Enter the correct answer"
                required
              />
            </div>
          )}
          {form.type === "code" && (
            <div>
              <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
                <FaCode /> Test Cases
              </label>
              <div className="space-y-2">
                {form.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center bg-black/40 border border-green-800 rounded-lg p-2"
                  >
                    <input
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) =>
                        handleTestCaseChange(idx, "input", e.target.value)
                      }
                      className="flex-1 p-2 rounded bg-transparent text-green-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    />
                    <FaArrowRight className="text-green-400" />
                    <input
                      placeholder="Output"
                      value={tc.output}
                      onChange={(e) =>
                        handleTestCaseChange(idx, "output", e.target.value)
                      }
                      className="flex-1 p-2 rounded bg-transparent text-green-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="text-red-400 hover:text-red-600 text-lg ml-2"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTestCase}
                  className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded shadow transition-all mt-2"
                >
                  <FaPlus /> Add Test Case
                </button>
              </div>
            </div>
          )}
          <div className="relative">
            <label className="mb-1 font-bold text-green-300 flex items-center gap-2">
              <FaLayerGroup /> Sub Topic
            </label>
            <input
              name="subTopic"
              value={form.subTopic}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/60 border-2 border-green-700 focus:border-yellow-400 focus:ring-2 focus:ring-green-400 text-green-200 placeholder-gray-500 transition-all outline-none shadow-inner"
              placeholder="e.g. Recursion, Arrays, SQL Joins"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 via-yellow-400 to-green-500 text-black font-extrabold py-3 rounded-xl shadow-lg hover:from-green-700 hover:to-green-400 hover:scale-[1.02] transition-all text-lg tracking-wider border-2 border-green-700"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Question"}
          </button>
          {message && (
            <div className="mt-2 text-center text-yellow-400 font-bold animate-pulse">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuestionUploadPage;
