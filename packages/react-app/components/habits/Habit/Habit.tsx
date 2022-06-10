import React, { useRef } from 'react';
import style from './Habit.module.scss';

const Habit = ({ habit, description, img }) => {

  const checkbox = useRef<HTMLInputElement>(null);
  
  return (
    <div className={style.container}>
        <img src={`/images/habits/${img}.png`} alt="" />
        <div>
            <h2 style={checkbox.current && checkbox.current.checked ? { textDecoration : 'line-through' } : {}}>{habit}</h2>
            <p>{description}</p>
        </div>
        <div className={style.round}> 
            <input type="checkbox" id={habit} ref={checkbox} />
            <label htmlFor={habit}></label>
        </div>
    </div>
  )
}

export default Habit