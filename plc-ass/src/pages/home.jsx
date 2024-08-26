import React from 'react';
import axios from 'axios'
import { useEffect, useState } from 'react'
import {DashboardLayout} from '../components/Layout';
import OneShelf from '../components/oneshelf'
import StartStopBtn from '../components/startstopbtn'
import AlarmPowerStatus from '../components/alarmpowerstatus'
import TemperatureMonitor from '../components/temperaturemonitor'
import PageTitle from '../components/pagetitle';

const HomePage = () => {

  const [Status, setStatus] = useState([]);
  const [LightStatus, setLightStatus] = useState([]);
  const [MediumStatus, setMediumStatus] = useState([]);
  const [HeavyStatus, setHeavyStatus] = useState([]);
  const [AlarmStatus, setAlarmStatus] = useState(false);
  const [PowerStatus, setPowerStatus] = useState(true);
  const [Temperature, setTemperature] = useState(0);
  const [error,setError] = useState(false)
  const [loading,setLoading] = useState(false)
  const host = 'localhost:8080'
  const ShelfName = [
    {
      name: 'Lightweight',
      status: LightStatus
    },
    {
      name: 'Medium Weight',
      status: MediumStatus
    },{
      name: 'Heavyweight',
      status: HeavyStatus
    },
  ];

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      setError(false)
      if (!Status) {
        setLoading(true)
      }
      
      try {
        const result = await axios.get('http://'+ host +'/', {
          signal: controller.signal
        })
        console.log(result.data)
        setStatus(result.data)
        parseData(result.data);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
          return
        }
        setError(true)
        console.log(error)
      }
      setLoading(false)
    })()

    return () => {
      // cleanup
      controller.abort()
    }

  }, [Status])

  const parseData = (data) => {
    let L = []
    let M = []
    let H = []
    let A = false
    let P = false
    let T = 0
    let index = 0

    for (let key in data) {
      if (key.includes('Light')) {
        index = key.match(/\d/) - 1
        L[index] = data[key]
      }
      if (key.includes('Medium')) {
        index = key.match(/\d/) - 1
        M[index] = data[key]
      }
      if (key.includes('Heavy')) {
        index = key.match(/\d/) - 1
        H[index] = data[key]
      }
      if (key.includes('alarm')) {
        A = data[key]
      }
      if (key.includes('power')) {
        P = data[key]
      }
      if (key.includes('temp')) {
        T = data[key]
      }
    }

    setLightStatus(L)
    setMediumStatus(M)
    setHeavyStatus(H)
    setAlarmStatus(A)
    // setPowerStatus(P)
    setTemperature(T)

    // console.log(LightStatus)
    // console.log(MediumStatus)
    // console.log(HeavyStatus)
    // console.log(AlarmStatus)
    // console.log(PowerStatus)
    // console.log(Temperature)

  }

  const handleStart = async () => {
    setPowerStatus(true);
    try {
      const result = await axios.post('http://localhost:8080/home/start', {});
      console.log('Response from server:', result.data);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }

  const handleStop = async () => {
    setPowerStatus(false)
    try {
      const result = await axios.post('http://localhost:8080/home/stop', {});
      console.log('Response from server:', result.data);
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
  }  

  return (
    <DashboardLayout>
      
      <PageTitle title="Home Page" />

      {loading && <p>Loading...</p>}


      <div className="flex grid grid-cols-2 h-full bg-gray-400 mt-8">
        {error 
        ?
          <p>Something went wrong</p> 
        : 
          <div className='flex grid grid-rows-3 content-evenly'>
            {
              ShelfName.map((shelf, index) => {
                return <OneShelf key={index} name={shelf.name} status={shelf.status} />
              })
            }
          </div>
        }

        <div className='flex grid grid-rows-2 bg-gray-400'>
          <div className='flex justify-center'>
            <StartStopBtn onStart={handleStart} onStop={handleStop} />
          </div>

          <div className='flex row-span-2 grid grid-cols-2'>
            <div>
              <TemperatureMonitor temperature={Temperature} />
            </div>
            
            <div>
              <AlarmPowerStatus alarmStatus={AlarmStatus} powerStatus={PowerStatus} />
            </div>
          </div>

        </div>
      </div>



      
    </DashboardLayout>
  )
}

export default HomePage;