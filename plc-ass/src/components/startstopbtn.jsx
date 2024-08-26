export default function StartStopBtn({ onStart, onStop }) {
    return (
      <div className="flex justify-center mt-12 mb-12">
        <button className="bg-teal-500 text-white text-4xl px-20 rounded-lg mr-8" onClick={onStart}>START</button>
        <button className="bg-teal-500 text-white text-4xl px-20 rounded-lg" onClick={onStop}>STOP</button>
      </div>
    );
  };