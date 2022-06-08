import React from 'react';
import { BsLightningCharge, BsTrophy, BsJournalBookmark } from 'react-icons/bs';
import { Divider } from '@mui/material';
import style from './HabitHeader.module.scss';

const HabitHeader = ({ streak, loading }) => {

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.logo}>
          <img src="/images/logo.svg" alt="logo" />
          <h2>Celominder</h2>
        </div>
        {
          !loading && (
            <div className={style.streak}>
              <BsLightningCharge />
              <p>{streak} day Streak</p>
            </div>
          )
        } 
      </div>
      <div className={style.completed}>
        <BsTrophy />
        All habits completed
      </div>
      <Divider sx={{ m: 1 }} />
    </div>
  )
}

export default HabitHeader