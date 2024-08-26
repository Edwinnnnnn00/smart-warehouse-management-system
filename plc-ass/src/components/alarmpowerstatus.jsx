export default function AlarmPowerStatus({ alarmStatus, powerStatus }) {
    return (
      <div className="flex justify-center grid grid-rows-2 gap-4 content-evenly">
        <div className={`text-sm font-semibold bg-${alarmStatus ? 'red' : 'green'}-500 text-white px-20 py-16 text-3xl rounded`}>
          {alarmStatus ? 'ON' : 'OFF'} Alarm Status
        </div>
        <div className={`text-sm font-semibold bg-${powerStatus ? 'green' : 'red'}-500 text-white px-20 py-16 text-3xl rounded`}>
          {powerStatus ? 'ON' : 'OFF'} Power Status
        </div>
      </div>
    );
  };