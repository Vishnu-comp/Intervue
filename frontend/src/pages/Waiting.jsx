import React from "react";
import InterviewIcon from "../components/InterviewIcon";
import loader from "../../src/assets/icon/loader.svg";

const Waiting = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <InterviewIcon />

      {/* spinning loader */}
      <img
        src={loader}
        alt="loading"
        className="w-6 h-6 mt-4 animate-spin"
      />

      <p className="font-sora font-semibold mt-4">
        Wait for the teacher to ask questions..
      </p>
    </div>
  );
};

export default Waiting;
