import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import TextInterview from './TextInterview';
import VoiceInterview from './VoiceInterview';
import VideoInterview from './VideoInterview';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const mode = location.state?.mode || 'text';
  const passedQuestions = location.state?.questions || [];
  const timerMode = location.state?.timerMode || 'per_question';
  const totalTimeLimit = location.state?.totalTimeLimit || 1800;

  // ── Core state ──────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [questionTimeLimits, setQuestionTimeLimits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(totalTimeLimit);
  const [interviewId, setInterviewId] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // ✅ Fix: For text mode, timer should NOT start paused
  const [isTimerPaused, setIsTimerPaused] = useState(() => mode === 'text' ? false : true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [ttsError, setTtsError] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const audioRef = useRef(null);
  const globalTimerRef = useRef(null);
  const questionTimerRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentAnswerRef = useRef(currentAnswer);
  const currentIndexRef = useRef(currentIndex);
  const questionsRef = useRef(questions);

  useEffect(() => { currentAnswerRef.current = currentAnswer; }, [currentAnswer]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      clearInterval(globalTimerRef.current);
      clearInterval(questionTimerRef.current);
    };
  }, []);

  const isLastQuestion = currentIndex === questions.length - 1;

  // ── Load interview ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interview/${id}`);
        const interview = res.data;
        if (!isMountedRef.current) return;
        setInterviewId(id);
        setInterviewData(interview);
        setQuestions(interview.questions.map(q => q.questionText));
        setQuestionTimeLimits(interview.questions.map(q => q.timeLimit ?? 60));
        if (timerMode === 'per_question') {
          setTimeLeft(interview.questions[0]?.timeLimit ?? 60);
        }
        if (timerMode === 'total') {
          setGlobalTimeLeft(interview.totalTimeLimit || totalTimeLimit);
        }
      } catch (err) {
        console.error('Failed to fetch interview:', err);
        showToast('Failed to load interview. Returning to dashboard.', 'error');
        navigate('/dashboard');
      }
    };

    if (id) {
      fetchInterview();
    } else if (passedQuestions.length) {
      setQuestions(passedQuestions);
      setQuestionTimeLimits(passedQuestions.map(() => 60));
      if (timerMode === 'per_question') setTimeLeft(60);
      if (timerMode === 'total') setGlobalTimeLeft(totalTimeLimit);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stable finish / skip refs so timers don't go stale ──────────────────────
  const handleFinishInterviewRef = useRef(null);
  const handleSkipRef = useRef(null);

  // ── Global timer (total mode) ────────────────────────────────────────────────
  useEffect(() => {
    if (timerMode !== 'total') return;
    clearInterval(globalTimerRef.current);

    if (globalTimeLeft <= 0) {
      if (currentAnswerRef.current.trim()) {
        handleFinishInterviewRef.current?.();
      } else {
        handleFinishInterviewRef.current?.();
      }
      return;
    }

    globalTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setGlobalTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(globalTimerRef.current);
          handleFinishInterviewRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(globalTimerRef.current);
  }, [timerMode, globalTimeLeft]);

  // ── Per-question timer (per_question mode) ───────────────────────────────────
  useEffect(() => {
    if (timerMode !== 'per_question') return;
    if (isSpeaking || isTimerPaused) {
      clearInterval(questionTimerRef.current);
      return;
    }
    if (timeLeft <= 0) {
      if (isLastQuestion) handleFinishInterviewRef.current?.();
      else handleSkipRef.current?.();
      return;
    }

    clearInterval(questionTimerRef.current);
    questionTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(questionTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(questionTimerRef.current);
  }, [timerMode, timeLeft, isSpeaking, isTimerPaused, isLastQuestion]);

  // ── TTS ──────────────────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    if (isMountedRef.current) setIsSpeaking(false);
  }, []);

  const playTTS = useCallback((text, voice = 'af_heart', speed = 1.0) => {
    return new Promise(async (resolve, reject) => {
      stopAudio();
      if (!isMountedRef.current) return resolve();
      setIsSpeaking(true);
      setTtsError(false);

      try {
        const response = await api.post(
          '/tts',
          { text, voice, speed },
          { responseType: 'blob', timeout: 35000 }
        );

        if (response.data.type === 'application/json') {
          throw new Error('TTS returned error JSON instead of audio');
        }

        if (!isMountedRef.current) return resolve();

        const audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (isMountedRef.current) setIsSpeaking(false);
          audioRef.current = null;
          resolve();
        };

        audio.onerror = (err) => {
          console.error('Audio playback error', err);
          URL.revokeObjectURL(audioUrl);
          if (isMountedRef.current) setIsSpeaking(false);
          audioRef.current = null;
          reject(err);
        };

        audio.play().catch(reject);
      } catch (err) {
        console.warn('TTS API error, falling back to browser speech:', err.message);
        if (isMountedRef.current) setTtsError(true);

        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          const voices = window.speechSynthesis.getVoices();
          utterance.voice = voices.find(v => v.lang === 'en-US') || null;
          utterance.onend = () => {
            if (isMountedRef.current) setIsSpeaking(false);
            resolve();
          };
          utterance.onerror = (e) => {
            console.error('SpeechSynthesis error', e);
            if (isMountedRef.current) setIsSpeaking(false);
            resolve();
          };
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        } catch (fallbackErr) {
          console.error('Both TTS methods failed:', fallbackErr);
          if (isMountedRef.current) setIsSpeaking(false);
          resolve();
        }
      }
    });
  }, [stopAudio]);

  // ── Submit answer ────────────────────────────────────────────────────────────
  const submitAnswerToBackend = useCallback(async (questionIndex, answer, duration) => {
    if (!interviewId) return { score: 70, feedback: 'Could not evaluate — no interview ID.' };
    try {
      const res = await api.post(`/interview/${interviewId}/answer`, {
        questionIndex,
        userAnswer: answer,
        duration,
      });
      return res.data;
    } catch (err) {
      console.error('Failed to submit answer:', err);
      return { score: 70, feedback: 'Evaluation unavailable. Keep going!' };
    }
  }, [interviewId]);

  const handleSubmit = useCallback(async (skipFeedback = false) => {
    const answer = currentAnswerRef.current;
    if (!answer.trim()) {
      showToast('Please enter an answer before submitting.', 'warning');
      return;
    }
    if (loadingSubmit) return;

    setLoadingSubmit(true);
    clearInterval(questionTimerRef.current);
    setIsTimerPaused(true);
    stopAudio();

    const idx = currentIndexRef.current;
    const durationTaken =
      timerMode === 'total' ? 0 : (questionTimeLimits[idx] || 60) - timeLeft;

    try {
      showToast('Evaluating your answer...', 'info');
      const evaluation = await submitAnswerToBackend(idx, answer.trim(), durationTaken);

      if (!isMountedRef.current) return;

      setAnswers(prev => [
        ...prev,
        {
          question: questionsRef.current[idx],
          answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
        },
      ]);
      setCurrentAnswer('');

      const nextIdx = idx + 1;
      const hasMore = nextIdx < questionsRef.current.length;

      if (hasMore) {
        if (!skipFeedback && mode === 'voice') {
          await playTTS(evaluation.feedback);
        }
        if (!isMountedRef.current) return;
        setCurrentIndex(nextIdx);
        if (timerMode === 'per_question') {
          setTimeLeft(questionTimeLimits[nextIdx] || 60);
        }
        setIsTimerPaused(false);
      } else {
        if (!skipFeedback && mode === 'voice') {
          await playTTS(evaluation.feedback);
        }
        if (!isMountedRef.current) return;
        await api.post(`/interview/${interviewId}/complete`);
        showToast('Interview completed! Redirecting to results...', 'success');
        navigate(`/results/${interviewId}`);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      if (isMountedRef.current) showToast('Failed to submit answer. Please try again.', 'error');
    } finally {
      if (isMountedRef.current) setLoadingSubmit(false);
    }
  }, [
    loadingSubmit, timerMode, questionTimeLimits, timeLeft,
    mode, interviewId, navigate, showToast,
    submitAnswerToBackend, playTTS, stopAudio,
  ]);

  const handleSkip = useCallback(async () => {
    clearInterval(questionTimerRef.current);
    setCurrentAnswer('');
    stopAudio();
    setIsTimerPaused(true);

    const idx = currentIndexRef.current;
    const nextIdx = idx + 1;

    if (nextIdx < questionsRef.current.length) {
      setCurrentIndex(nextIdx);
      if (timerMode === 'per_question') {
        setTimeLeft(questionTimeLimits[nextIdx] || 60);
      }
    } else {
      try {
        await api.post(`/interview/${interviewId}/complete`);
        showToast('Interview completed! Redirecting to results...', 'success');
        navigate(`/results/${interviewId}`);
      } catch (err) {
        console.error('Failed to complete interview on skip:', err);
        showToast('Could not complete interview. Please try again.', 'error');
      }
    }
  }, [timerMode, questionTimeLimits, interviewId, navigate, showToast, stopAudio]);

  const handleFinishInterview = useCallback(async () => {
    if (!interviewId) return;
    clearInterval(globalTimerRef.current);
    clearInterval(questionTimerRef.current);
    stopAudio();

    try {
      const answer = currentAnswerRef.current;
      if (answer.trim()) {
        const idx = currentIndexRef.current;
        const durationTaken =
          timerMode === 'total' ? 0 : (questionTimeLimits[idx] || 60) - timeLeft;
        await submitAnswerToBackend(idx, answer.trim(), durationTaken);
      }
      await api.post(`/interview/${interviewId}/complete`);
      showToast('Interview completed! Redirecting to results...', 'success');
      navigate(`/results/${interviewId}`);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error === 'Interview already completed') {
        navigate(`/results/${interviewId}`);
      } else {
        console.error('Failed to complete interview:', err);
        showToast('Could not complete interview. Please try again.', 'error');
      }
    }
  }, [
    interviewId, timerMode, questionTimeLimits, timeLeft,
    navigate, showToast, submitAnswerToBackend, stopAudio,
  ]);

  // Keep refs up to date for timer callbacks
  useEffect(() => { handleFinishInterviewRef.current = handleFinishInterview; }, [handleFinishInterview]);
  useEffect(() => { handleSkipRef.current = handleSkip; }, [handleSkip]);

  // ── Render guard ─────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9ca3af]">Loading questions...</p>
        </div>
      </div>
    );
  }

  const sharedProps = {
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
    setIsSpeaking,
    timerMode,
    questionTimeLimits,
    interviewId,
    handleSubmit,
    handleSkip,
    handleFinishInterview,
    isLastQuestion,
    loadingSubmit,
  };

  const modeProps = mode === 'voice' ? { ...sharedProps, playTTS, stopAudio, ttsError } : sharedProps;

  let ModeComponent;
  if (mode === 'text') ModeComponent = TextInterview;
  else if (mode === 'voice') ModeComponent = VoiceInterview;
  else ModeComponent = VideoInterview;

  const categoryLabel = interviewData?.category
    ? interviewData.category.charAt(0).toUpperCase() + interviewData.category.slice(1)
    : 'Interview';

  const modeLabel = mode === 'voice' ? 'Voice Mode 🎤' : mode === 'text' ? 'Text Mode 📝' : 'Video Mode 📹';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
            MockMate — {categoryLabel} ({modeLabel})
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-[#9ca3af]">Q{currentIndex + 1}/{questions.length}</span>
            {timerMode === 'total' ? (
              <span className="text-[#9ca3af] text-sm">
                ⏱ {Math.floor(globalTimeLeft / 60)}:{String(globalTimeLeft % 60).padStart(2, '0')}
              </span>
            ) : (
              <div className="flex flex-col items-end gap-0.5">
                {isSpeaking ? (
                  <span className="text-purple-400 text-sm">🔊 Speaking...</span>
                ) : isTimerPaused ? (
                  <span className="text-[#9ca3af] text-sm">⏸️ Paused</span>
                ) : (
                  <span className={`text-sm font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-[#9ca3af]'}`}>
                    ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                )}
                <span className="text-[#9ca3af] text-xs">
                  Limit: {questionTimeLimits[currentIndex] || 60}s
                </span>
              </div>
            )}
          </div>
        </div>
        <ModeComponent {...modeProps} />
      </div>
    </div>
  );
};

export default InterviewRoom;