import React, { useRef, useState } from 'react';
import style from './Habit.module.scss';

const Habit = ({ habit, description, img, handleChecked, checked }) => {

  return (
    <div className={style.container}>
        <img src={`/images/habits/${img}.png`} alt="" style={ checked ? {filter: 'grayscale(60%)'} : {}}/>
        <div>
            <h2 style={ checked ? { textDecoration : 'line-through', color: 'rgb(73, 73, 73)' } : {}}>{habit}</h2>
            <p style={ checked ? { textDecoration : 'line-through', color: 'rgb(73, 73, 73)' } : {}}>{description}</p>
        </div>
        <div className={style.round}> 
            <input type="checkbox" id={habit} value={habit} onChange={handleChecked}/>
            <label htmlFor={habit}></label>
        </div>
    </div>
  )
}

export default Habit