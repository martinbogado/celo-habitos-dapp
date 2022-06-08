import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import {useQuery, gql} from "@apollo/client"

import style from './NuevoReto.module.scss';


const HABITS_LIST = gql`
    query HabitsList {
        list {
        habit
        img
        }
    }
`

const NuevoReto = () => {

  const {data, loading, refetch, error} = useQuery(HABITS_LIST);

  console.log('Habits List', data);  

  if(loading){
      return(
          <div>
              La lista esta cargando..
          </div>
      )
  }

  if(error){
      return(
          <div>
              Ups.. Ocurrio un error
          </div>
      )
  }

  if(data){
      return(
          <div>
              {
                  data.list.map( h => {
                      return(
                          <div className={style.card}>
                              <img src={`/images/habits/${h.img}.png`} alt={h.habit}/>
                              <h3>{h.habit}</h3>
                          </div>
                      )
                  })
              }
          </div>
      )
  }
}

export default NuevoReto