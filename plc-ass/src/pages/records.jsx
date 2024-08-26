import React from 'react';
import { useEffect, useState } from 'react'
import Chart from 'chart.js/auto';
import {DashboardLayout} from '../components/Layout';
import axios from 'axios';
import RecordsChart from '../components/RecordsChart';
import PageTitle from '../components/pagetitle';


const RecordsPage = () => {

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
        const result = await axios.get('http://'+ host +'/records', {
          signal: controller.signal
        })
        console.log(result);
        setLabels(result.data.labels);
        setDatasets(result.data.datasets);
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
        <PageTitle title="Records" />

        {loading && <p>Loading...</p>}
        
        <div className='flex'>
          <RecordsChart labels={labels} datasets={datasets}/>
        </div>

    </DashboardLayout>
  )
}

export default RecordsPage;