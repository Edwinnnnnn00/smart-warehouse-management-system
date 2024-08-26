import React from 'react';
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import {DashboardLayout} from '../components/Layout';
import PageTitle from '../components/pagetitle';


const CameraPage = () => {

  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);


  const videoConstraints = {
    width: { min: 800 },
    height: { min: 500 },
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);

  return (
    <DashboardLayout>
      <PageTitle title="Camera" />

      <div className="Container">
        {img === null 
          ? (
            <>
            <div className="flex justify-center">
              <Webcam 
              audio={false}
              mirrored={true}
              width={1500} 
              height={800} 
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints} />
            </div>

            <div>
              <button className='bg-teal-400 rounded-full text-2xl p-4 mt-4 w-1/6 font-bold border-4 border-black' onClick={capture}>Capture photo</button>
            </div>
            </>
            ) 
          : (
            <div className=''>
              <div className="flex justify-center">
                <img src={img} alt="screenshot" />
              </div>

              <div>
                <button className='bg-teal-400 rounded-full text-2xl p-4 mt-4 w-1/6 font-bold border-4 border-black' onClick={() => setImg(null)}>Retake</button>
              </div>
            </div>
          )
        }
      </div>
    </DashboardLayout>
  )
}

export default CameraPage;