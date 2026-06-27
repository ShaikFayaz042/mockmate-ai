import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * VoiceInterview — production-ready voice mode component.
 *
 * Fixes vs original:
 * 1. Race condition: questionAudioPlayed reset & play guard use a single ref flag
 *    so TTS never fires twice on question change.
 * 2. recognitionRef properly stopped & cleaned up on unmount.
 * 3. No state updates on unmounted component (isMountedRef guard).
 * 4. Mic permission denied → user-facing error message (not just console.error).
 * 5. handleReplay stops active recording before playing TTS.
 * 6. interimText is shown only in the live preview — not duplicated.
 * 7. Clear answer button to reset transcript.
 * 8. ttsError prop surfaces a "using browser voice" warning.
 * 9. Speaking animation on AI avatar.
 */
const VoiceInterview = ({
  questions,
  currentIndex,
  answers,
  currentAnswer,
  setCurrentAnswer,
  isTimerPaused,
  setIsTimerPaused,
  isSpeaking,
  timerMode,
  questionTimeLimits,
  setTimeLeft,
  handleSubmit,
  handleSkip,
  handleFinishInterview,
  loadingSubmit,
  playTTS,
  stopAudio,
  ttsError,
}) => {
  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);

  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micError, setMicError] = useState('');

  // Single ref that tracks whether TTS has been triggered for current question.
  // Using a ref (not state) prevents the double-fire race condition.
  const ttsPlayedForIndex = useRef(-1);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        try { recognitionRef.current.abort(); } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // ── Speak question when currentIndex changes ─────────────────────────────────
  useEffect(() => {
    if (
      questions.length === 0 ||
      !questions[currentIndex] ||
      isSpeaking ||
      ttsPlayedForIndex.current === currentIndex // already fired for this index
    ) return;

    ttsPlayedForIndex.current = currentIndex; // mark immediately to prevent double-fire

    (async () => {
      await playTTS(questions[currentIndex]);
      if (!isMountedRef.current) return;
      // After question TTS ends, reset timer and un-pause
      if (timerMode !== 'total') {
        setTimeLeft(questionTimeLimits[currentIndex] || 60);
      }
      setIsTimerPaused(false);
    })();
  }, [currentIndex, questions]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Speech recognition setup ─────────────────────────────────────────────────
  const setupRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      if (!isMountedRef.current) return;
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interimTranscript += t;
      }
      if (finalTranscript) {
        setCurrentAnswer(prev => {
          const trimmed = prev.trim();
          return trimmed ? trimmed + ' ' + finalTranscript.trim() : finalTranscript.trim();
        });
      }
      setInterimText(interimTranscript);
    };

    recognition.onerror = (event) => {
      if (!isMountedRef.current) return;
      console.error('Recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setMicError('No speech detected. Please speak clearly and try again.');
      } else if (event.error !== 'aborted') {
        setMicError(`Speech recognition error: ${event.error}. Try again.`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (!isMountedRef.current) return;
      setIsRecording(false);
      setInterimText('');
    };

    return recognition;
  }, [setCurrentAnswer]);

  const startRecording = useCallback(() => {
    if (isSpeaking) return; // don't record while AI is speaking
    setMicError('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Your browser doesn't support speech recognition. Please use Chrome or Edge, or switch to Text Mode.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = setupRecognition();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        // DOMException: already started
        if (err.name !== 'InvalidStateError') {
          setMicError('Could not start recording. Please try again.');
          console.error('Recognition start error:', err);
        }
      }
    }
  }, [isSpeaking, setupRecognition]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);
    setInterimText('');
  }, []);

  const handleReplay = useCallback(async () => {
    // Stop recording before replaying (prevents audio feedback)
    stopRecording();
    if (questions[currentIndex]) {
      ttsPlayedForIndex.current = currentIndex; // keep it marked so auto-play doesn't re-fire
      await playTTS(questions[currentIndex]);
    }
  }, [questions, currentIndex, playTTS, stopRecording]);

  const handleClearAnswer = useCallback(() => {
    setCurrentAnswer('');
    setInterimText('');
  }, [setCurrentAnswer]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const isBlocked = isSpeaking || loadingSubmit;
  const hasAnswer = currentAnswer.trim().length > 0 || interimText.length > 0;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ── Left: AI Interviewer ──────────────────────────────────────────────── */}
      <div className="bg-[#13131a] border border-[#2d2d3d] rounded-2xl p-6 flex flex-col">
        <div className="flex flex-col items-center text-center flex-1">

          {/* Avatar with speaking animation */}
          <div className="relative mb-4">
            <div
              className={`text-6xl transition-transform duration-300 ${
                isSpeaking ? 'scale-110' : 'scale-100'
              }`}
            >
              🗣️
            </div>
            {isSpeaking && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1 items-end h-4">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-1 bg-purple-400 rounded-full animate-pulse"
                    style={{
                      height: `${8 + (i % 3) * 4}px`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-xl font-semibold mb-1">AI Interviewer</h3>

          {/* Status badge */}
          <div className="mb-4 h-5">
            {isSpeaking ? (
              <span className="text-purple-400 text-xs font-medium tracking-wide animate-pulse">
                ● Speaking...
              </span>
            ) : (
              <span className="text-[#9ca3af] text-xs">
                Question {currentIndex + 1}
              </span>
            )}
          </div>

          {/* Question card */}
          <div className="bg-[#1c1c27] p-4 rounded-xl w-full text-left">
            <p className="text-white leading-relaxed">{questions[currentIndex]}</p>
          </div>

          {/* TTS fallback warning */}
          {ttsError && (
            <div className="mt-3 w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-400">
              ⚠️ High-quality voice unavailable. Using browser voice (may sound robotic).
            </div>
          )}

          {/* Replay */}
          <button
            onClick={handleReplay}
            disabled={isSpeaking}
            className="mt-4 text-purple-400 text-sm hover:text-purple-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            🔁 Replay Question
          </button>
        </div>

        {/* Previous answers thread (left panel, scrollable) */}
        {answers.length > 0 && (
          <div className="mt-6 border-t border-[#2d2d3d] pt-4 max-h-48 overflow-y-auto space-y-3">
            <p className="text-xs text-[#9ca3af] font-medium">Previous answers</p>
            {answers.map((ans, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-purple-400 text-xs">Q{idx + 1}</p>
                <p className="text-[#9ca3af] text-xs line-clamp-2">{ans.answer}</p>
                {ans.score != null && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#2d2d3d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${ans.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-400">{ans.score}/100</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: Recording & answer area ───────────────────────────────────── */}
      <div className="bg-[#13131a] border border-[#2d2d3d] rounded-2xl flex flex-col">

        {/* Scrollable conversation history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: '280px' }}>
          {answers.length === 0 && (
            <div className="flex items-center justify-center h-full text-[#9ca3af] text-sm text-center py-8">
              Your answers will appear here after each submission.
            </div>
          )}
          {answers.map((ans, idx) => (
            <div key={idx}>
              <div className="bg-[#1c1c27] p-3 rounded-xl mb-2">
                <p className="text-purple-400 text-xs mb-1">Q{idx + 1}: {ans.question}</p>
                <p className="text-white text-sm">👤 {ans.answer}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl">
                <p className="text-purple-400 text-xs mb-1">🤖 AI Feedback</p>
                <p className="text-[#9ca3af] text-sm">
                  {ans.feedback || (ans.score ? `Score: ${ans.score}/100` : 'Good answer!')}
                </p>
                {ans.score != null && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#2d2d3d] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${ans.score}%`,
                          background:
                            ans.score >= 70
                              ? 'linear-gradient(90deg,#7c3aed,#3b82f6)'
                              : ans.score >= 40
                              ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                              : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-xs text-purple-400 shrink-0">{ans.score}/100</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-[#2d2d3d] p-4 space-y-3">

          {/* Recording controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={startRecording}
              disabled={isRecording || isBlocked}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
                ${isRecording ? 'bg-purple-600/40 cursor-not-allowed opacity-50' : ''}
                ${!isRecording && !isBlocked ? 'bg-purple-600 hover:bg-purple-700 active:scale-95' : ''}
                ${isBlocked && !isRecording ? 'opacity-40 cursor-not-allowed bg-purple-600/40' : ''}
              `}
            >
              <span className={`w-2 h-2 rounded-full bg-white ${isRecording ? 'animate-ping' : ''}`} />
              {isRecording ? 'Recording...' : '🎤 Start Recording'}
            </button>

            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="px-5 py-2.5 bg-red-600 rounded-xl text-sm font-medium hover:bg-red-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ⏹ Stop
            </button>
          </div>

          {/* Mic error */}
          {micError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400">
              ⚠️ {micError}
            </div>
          )}

          {/* Live transcription preview */}
          {(currentAnswer || interimText) && (
            <div className="bg-[#1c1c27] border border-[#2d2d3d] rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-purple-400 text-xs">Live transcription</p>
                <button
                  onClick={handleClearAnswer}
                  className="text-[#9ca3af] hover:text-red-400 text-xs transition-colors"
                >
                  ✕ Clear
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed">
                {currentAnswer}
                {interimText && (
                  <span className="text-gray-500 italic"> {interimText}</span>
                )}
              </p>
            </div>
          )}

          {/* Editable answer textarea */}
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            disabled={isBlocked}
            className="w-full bg-[#1c1c27] border border-[#2d2d3d] rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500/60 transition-colors disabled:opacity-50"
            rows="2"
            placeholder="Edit your transcribed answer here, or type directly..."
          />

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isBlocked || !hasAnswer}
              className="flex-1 bg-purple-600 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingSubmit ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                '✓ Submit Answer'
              )}
            </button>

            <button
              onClick={handleSkip}
              disabled={isBlocked}
              className="px-4 py-2.5 border border-[#2d2d3d] rounded-xl text-sm hover:border-[#3d3d4d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Skip
            </button>

            <button
              onClick={handleFinishInterview}
              disabled={loadingSubmit}
              className="px-4 py-2.5 border border-purple-500/50 text-purple-400 rounded-xl text-sm hover:bg-purple-500/10 transition-colors disabled:opacity-40"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterview;