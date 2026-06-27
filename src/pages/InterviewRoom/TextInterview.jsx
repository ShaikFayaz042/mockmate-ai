import { useState, useEffect } from 'react';

const TextInterview = ({
  questions,
  currentIndex,
  setCurrentIndex,
  answers,
  setAnswers,
  currentAnswer,
  setCurrentAnswer,
  timeLeft,
  setTimeLeft,
  isTimerPaused,
  setIsTimerPaused,
  isSpeaking,
  timerMode,
  questionTimeLimits,
  interviewId,
  handleSubmit,
  handleSkip,
  handleFinishInterview,
  isLastQuestion,
  loadingSubmit,
}) => {
  // For text mode, we don't need TTS or speech recognition.
  // The timer starts immediately when question is active.

  useEffect(() => {
    // Reset timer when question changes (if not total mode)
    if (timerMode !== 'total') {
      const limit = questionTimeLimits[currentIndex] || 60;
      setTimeLeft(limit);
    }
    setIsTimerPaused(false);
  }, [currentIndex, timerMode, questionTimeLimits, setTimeLeft, setIsTimerPaused]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: AI Interviewer */}
      <div className="bg-[#13131a] border border-[#2d2d3d] rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI Interviewer</h3>
          <p className="text-[#9ca3af] text-sm mb-4">Question {currentIndex+1}</p>
          <div className="bg-[#1c1c27] p-4 rounded-lg w-full">
            <p className="text-white">{questions[currentIndex]}</p>
          </div>
        </div>
      </div>

      {/* Right: Answer Area */}
      <div className="bg-[#13131a] border border-[#2d2d3d] rounded-2xl flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {answers.map((ans, idx) => (
            <div key={idx}>
              <div className="bg-[#1c1c27] p-3 rounded-lg mb-2">
                <p className="text-purple-400 text-xs">Q{idx+1}: {ans.question}</p>
                <p className="text-white mt-1">👤 {ans.answer}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <p className="text-purple-400 text-xs">🤖 AI Feedback</p>
                <p className="text-[#9ca3af] text-sm">{ans.feedback || (ans.score ? `Score: ${ans.score}/100` : 'Good answer!')}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2d2d3d] p-4">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full bg-[#1c1c27] border border-[#2d2d3d] rounded-lg p-2 text-white resize-none mb-2"
            rows="2"
            placeholder="Type your answer..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loadingSubmit}
              className="bg-purple-600 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loadingSubmit ? 'Sending...' : 'Send'}
            </button>
            <button
              onClick={handleSkip}
              disabled={loadingSubmit}
              className="border border-[#2d2d3d] px-4 py-2 rounded-lg disabled:opacity-50"
            >Skip</button>
            <button
              onClick={handleFinishInterview}
              className="border border-purple-500 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/10"
            >
              Finish Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInterview;