const ColdStartOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b12]/95 p-8 text-center text-white shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
          <div>
            <h2 className="text-xl font-semibold">Starting up server</h2>
            <p className="mt-2 text-sm text-[#cbd5e1]">
              Please wait a moment while the backend wakes up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdStartOverlay;
