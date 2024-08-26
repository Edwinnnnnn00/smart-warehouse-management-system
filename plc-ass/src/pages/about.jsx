import React from 'react';
import MemberInfo from '../components/memberInfo';
import {DashboardLayout} from '../components/Layout';
import PageTitle from '../components/pagetitle';
import Edwin from '../images/Edwin.jpeg';
import WeiQiang from '../images/WeiQiang.jpeg';
import Gary from '../images/Gary.jpg';
import YongKing from '../images/YongKing.jpeg';

const AboutPage = () => {
  const memberData = [
    {
      name: 'Edwin Ooi Yong Qing',
      matric: 'A20EE0044',
      pic: Edwin,
    },
    {
      name: 'Fang Wei Qiang',
      matric: 'A20EE0049',
      pic: WeiQiang,
    },
    {
      name: 'Yee Hon Cheung, Gary',
      matric: 'A20EE0233',
      pic: Gary,
    },
    {
      name: 'Tan Yong King',
      matric: 'A20EE0278',
      pic: YongKing,
    }  
  ]
  return (
    <DashboardLayout>
      <div className="mb-8">
        <PageTitle title="About the Team"/>
      </div>

      <div className="flex grid grid-cols-4">
        {memberData.map((obj, index) => {
          return <MemberInfo key={index} name={obj.name} matric={obj.matric} pic={obj.pic}/>
        })}
      </div>


    </DashboardLayout>
  )
}

export default AboutPage;