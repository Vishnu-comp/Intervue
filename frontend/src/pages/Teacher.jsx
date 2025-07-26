// Teacher.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import QuestionForm from "../components/QuestionForm";
import Chat from "../components/Chat";
import PollHistory from "../components/PollHistory";
import { FaUserMinus } from "react-icons/fa6";
import InterviewIcon from "../components/InterviewIcon";
import ViewPoll from '../../src/assets/icon/viewpoll.svg';

const socket = io("https://intervue-io-assignment.onrender.com");

const Teacher = () => {
  const [students, setStudents] = useState([]);
  const [pollResults, setPollResults] = useState({});
  const [pollHistory, setPollHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ask");

  // NEW
  const [showForm, setShowForm] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    socket.on("pollResults", (results) => {
      setPollResults(results);
      // store question + results in history if you want structured history
      setPollHistory((prev) =>
        currentQuestion
          ? [...prev, { question: currentQuestion.text, results }]
          : prev
      );
    });

    socket.on("students", (studentsList) => {
      setStudents([...new Set(studentsList)]);
    });

    return () => {
      socket.off("pollResults");
      socket.off("students");
    };
  }, [currentQuestion]);

  const handleKickStudent = (studentName) => {
    socket.emit("kickStudent", studentName);
  };

  const handleQuestionSubmitted = (q) => {
    setCurrentQuestion(q);
    setShowForm(false);
    setPollResults({}); // reset for the new live question
  };

  const askNewQuestion = () => {
    setShowForm(true);
    setCurrentQuestion(null);
    setPollResults({});
  };

  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex-grow flex">
        <div className="w-full">
          {activeTab === "ask" ? (
            <>
              <div className="rounded-lg shadow-sm p-32">
                {showForm && (<InterviewIcon align="left" />)}
                {showForm ? (
                  <>
                    <div className="text-start mb-8">
                      <h1 className="text-3xl text-[#373737] mb-2 font-sora">
                        Let's
                        <span className="font-sora font-semibold">
                          {" "}
                          Get Started
                        </span>
                      </h1>
                      <p className="text-[#6E6E6E] text-sm  text-start font-sora">
                        you’ll have the ability to create and manage polls, ask
                        questions, and monitor{" "}
                        <p>your students' responses in real-time.</p>
                      </p>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-[#373737] font-sora">
                        Enter your question
                      </h2>
                    </div>
                    <QuestionForm onSubmitted={handleQuestionSubmitted} />
                  </>
                ) : (
                  // LIVE QUESTION + POLL RESULTS + Ask new question button
                  <div className="max-w-3xl mx-auto w-full">
                      <span className="absolute top-0 right-0 mt-6 mx-5">
                    <img
                      src={ViewPoll}
                      alt="View Poll"
                      className="w-50 h-50 cursor-pointer"
                      onClick={() => setActiveTab("history")}
                    />
                  </span>

                    <h2 className="text-xl font-semibold text-[#373737] mb-4">
                      Question
                    </h2>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                      <div className="bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white p-4">
                        <p className="font-medium font-sora">{currentQuestion?.text}</p>
                      </div>

                      <div className="p-4 space-y-2 ">
                        {currentQuestion?.options?.map((option, index) => {
                          const votes = pollResults[option] || 0;
                          const percentage = totalVotes
                            ? ((votes / totalVotes) * 100).toFixed(0)
                            : 0;
                          return (
                            <div
                              key={index}
                              className="relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div
                                className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                              <div className="relative flex justify-between items-center p-4 z-10">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#7765DA] text-white flex items-center justify-center text-sm font-medium mr-3 font-sora">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium text-[#373737] font-sora">
                                    {option}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold font-sora text-[#373737]">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={askNewQuestion}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:bg-[#6655CA] text-white font-medium font-sora"
                      >
                        + Ask a new question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#373737] mb-6">
                Poll History
              </h2>
              {/* <PollHistory pollHistory={pollHistory} /> */}
            </div>
          )}
        </div>
      </div>

      {!showForm &&(<Chat
        user="Teacher"
        participants={students}
        onKick={handleKickStudent}
      />)}
    </div>
  );
};

export default Teacher;
