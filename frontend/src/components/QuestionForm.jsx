import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("https://intervue-io-assignment.onrender.com");

const QuestionForm = ({ onSubmitted }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);

  const addOption = () =>
    setOptions((prev) => [...prev, { value: "", isCorrect: null }]);

  const removeOption = (index) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  const handleOptionChange = (index, value) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, value } : o))
    );

  const setOptionCorrect = (index, isCorrect) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, isCorrect } : o))
    );

  const handleQuestionSubmit = (e) => {
    e.preventDefault();

    const clean = options.filter((o) => o.value.trim() !== "");
    const questionData = {
      text: question,
      options: clean.map((o) => o.value),
      correct: clean
        .map((o, i) => (o.isCorrect ? i : -1))
        .filter((i) => i !== -1),
    };

    socket.emit("submitQuestion", questionData);

    // ***** tell parent we just submitted *****
    onSubmitted?.(questionData);

    setQuestion("");
    setOptions([]);
  };

  return (
    <form onSubmit={handleQuestionSubmit} className="mb-4">
      <div className="mb-4">
      <textarea
  placeholder="Enter your question"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  className="border p-4 mb-2 bg-gray-100 text-black w-[865px] h-[174px] resize-none placeholder:text-left placeholder:align-top"
/>

        {/* Header */}
        <div className="flex justify-between mb-2">
          <span className="font-semibold font-sora text-[#373737]">Edit Options</span>
          <span className="font-semibold font-sora text-[#373737]">Is it Correct?</span>
        </div>

        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 mb-3"
          >
          {/* number + input */}
            <div className="flex items-center gap-3 flex-1">
              <span className="w-6 h-6 rounded-full bg-[#7765DA] text-white text-xs flex items-center justify-center">
                {index + 1}
              </span>

              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 p-3 bg-[#F2F2F2] rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7765DA] focus:border-transparent mr-44 font-sora"
              />
            </div>

            {/* Yes / No */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect === true}
                  onChange={() => setOptionCorrect(index, true)}
                  className="accent-[#7765DA] w-5 h-5"
                />
                <span className="font-sora font-semibold">Yes</span>
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect === false}
                  onChange={() => setOptionCorrect(index, false)}
                  className="accent-[#7765DA]  w-5 h-5"
                />
                <span className="font-sora font-semibold">No</span>
              </label>

              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addOption}
          className="border border-[#7451B6] text-[#7451B6] p-2 rounded-lg font-sora w-[169px] h-[49px]"
        >
          + Add More option
        </button>
      </div>

      <button
  className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] hover:bg-[#6655CA] text-white font-medium shadow-lg"
>
  Ask Question
</button>

    </form>
  );
};

export default QuestionForm;
