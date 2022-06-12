import React from 'react';
import { BsLightningCharge, BsTrophy, BsJournalBookmark } from 'react-icons/bs';
import { VscNewFile } from 'react-icons/vsc';
import { MdOutlineWhatshot } from 'react-icons/md';
import { FiUserX } from 'react-icons/fi';
import { Divider } from '@mui/material';
import style from './HabitHeader.module.scss';
import { truncateAddress } from '@/utils';

const HabitHeader = ({ streak, loading, address, allCompleted, habitsLeft, retoCreado }) => {

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.logo}>
          <img src="/images/logo.svg" alt="logo" />
          <h2>Celominder</h2>
        </div>
        {
          (!loading && retoCreado) && (
            <div className={style.streak} style={ streak !== 0 ? {color: 'rgb(233, 193, 14)'} : {}}>
              <BsLightningCharge />
              <p>{streak} day Streak</p>
            </div>
          )
        } 
      </div>
      <div className={style.completed}>
        {
          address ?

          retoCreado ?

          allCompleted ?
          <>
            <BsTrophy />
            Todos los habitos completados
          </>
          :
          <>
            <BsJournalBookmark />
            Te faltan {habitsLeft} habitos para completar el dia
          </>

          :

          <>
            <VscNewFile />
            Primero debes crear un reto 
          </>

          :
          <>
           <FiUserX />
           No hay ningún usuario conectado
          </>
        }
        
      </div>
      <Divider sx={{ m: 1 }} />
      <div className={style.address}>
      {address && <span >Estas logeado con la address <strong>{truncateAddress(address)}</strong></span>}
      </div>
    </div>
  )
}

export default HabitHeader