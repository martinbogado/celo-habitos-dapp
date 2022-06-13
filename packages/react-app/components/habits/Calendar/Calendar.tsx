import React, { useState, useEffect } from 'react';
import style from './Calendar.module.scss';

import dayjs, { Dayjs } from "dayjs";
import es from "dayjs/locale/es";

const Calendar = () => {
    const [week, setWeek] = useState([])

    useEffect(() => {
        getDays()
    },[])

    function getDays() {
        const calendarDays: Dayjs[] = [];

        dayjs.locale(es);
        const startDate = dayjs().add(5, "day");
      
        for (let i = 6; i >= 0; i--) {
          calendarDays.push(startDate.subtract(i, "day"));
        }
      
       setWeek(calendarDays);
    }

  return (
    <div className={style.container}>
     {
        week.map((el) => {
            const day = el.format("ddd"); 
            const today = new Date();
         
            return(
                <div className={style.day} key={el.date()} style={ today.getDate() === el.date() ? {backgroundColor: '#307CC8', color: 'white'} : {} }>
                    <p>{el.date()}</p>
                    <span>{day.charAt(0).toUpperCase() + day.slice(1).replace('.','')}</span>
                </div>   
            )
        })
     }
    </div>
  )
}

export default Calendar