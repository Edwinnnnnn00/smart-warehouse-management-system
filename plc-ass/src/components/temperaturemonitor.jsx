export default function TemperatureMonitor({ temperature }) {
    return (
      <div className="flex flex-col mt-12">
        <div className="border-4 rounded-full p-16 mb-8 ml-10 mr-10 border-gray-700">
          <div className="text-4xl font-bold">{temperature}°C</div>
        </div>
        <div className="text-3xl font-bold">Temperature</div>
      </div>
    );
  };