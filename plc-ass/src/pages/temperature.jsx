import React from 'react';
import TemperatureChart from '../components/TemperatureChart';
import {DashboardLayout} from '../components/Layout';
import { useEffect, useState } from 'react'
import axios from 'axios';
import PageTitle from '../components/pagetitle';


const TemperaturePage = () => {

  const result = {};
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [labels, setLabels] = useState([])
  const [datasets, setDatasets] = useState([])
  const host = 'localhost:8080'
  
  
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      setError(false)
      setLoading(true)
      try {
        const result = await axios.get('http://'+ host +'/temperature', {
          signal: controller.signal
        })
        console.log(result.data);
        setLabels(result.data.labels);
        setDatasets(result.data.datasets);
        // console.log(context);
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

  }, [])

  return (
    <DashboardLayout>
      <PageTitle title="Temperature Monitoring" />
      
      <div>
        <TemperatureChart labels={labels} datasets={datasets} />
      </div>

      {/* <div>
        <ChartComponent />
      </div> */}


    </DashboardLayout>
  )
}

export default TemperaturePage;