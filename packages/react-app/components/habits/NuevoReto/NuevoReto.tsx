import * as React from "react";
import { useState } from "react";
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";
import { AiOutlineCloseCircle } from 'react-icons/ai';

import {useMutation, gql} from "@apollo/client";

import style from './NuevoReto.module.scss';

import HabitsList from "../HabitsList/HabitsList";

import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";

const ADD_CHALLENGE = gql`
    mutation AddNewChallenge($challenge: [challenges_insert_input!]!, $addhabits: [habits_insert_input!]!) {
        insert_challenges(objects: $challenge) {
            affected_rows
        },
        insert_habits(objects: $addhabits) {
            affected_rows
        }
    }`

const NuevoReto = ({ crearReto, address, refetch }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div>
            <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={handleOpen}>
              Comenzar nuevo reto
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
            >
                <div className={style.newChallenges}>
                    <ElegirReto crearReto={crearReto} address={address} refetch={refetch} />
                </div>
            </Modal>
        </div>
    )
}

export default NuevoReto

const ElegirReto = ({ crearReto, address, refetch}) => {
    const [open, setOpen] = useState(false);
    const [habits, setHabits] = useState([]);
    const [error, setError] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setHabits([]);
    }

    // create function to run mutation
    const [add_challenge, response] = useMutation(ADD_CHALLENGE);

    const { enqueueSnackbar } = useSnackbar();

    function handleChecked(e){
        if (e.target.checked) { 
            setHabits([...habits, {
                user: address,
                habit: e.target.value,
                img: e.target.id
            }]);   
        } else if (!e.target.checked) {
            setHabits(
                habits.filter(el => el.habit !== e.target.value)
            ) 
        }
    };

    const crearRetoEnBD = async (id: String) => { 
      if(id !== undefined){
        await add_challenge({
            variables: {
                challenge: [{address: address, id: id}], 
                addhabits: habits
            }
        });
  
        handleClose();
        refetch();
      } else {
        enqueueSnackbar("Ocurrio un error al intentar crear el reto, porfavor intente de nuevo", {variant: 'error', autoHideDuration: 2500});
      }
    }

    async function crearNuevoReto(e){
        e.preventDefault();

        const id = await crearReto();
        console.log(id);

        crearRetoEnBD(id);
    } 

    function disableBtn(){
        if(habits.length >= 4){
            enqueueSnackbar("No puede elegir mas de 3 habitos por reto", {variant: 'error', autoHideDuration: 2500});
            return true
        } else if(!habits.length){
            enqueueSnackbar("Debe elegirse al menos 1 habito para empezar el reto", {variant: 'error', autoHideDuration: 2500});
            return true
        }
        return false
    }

    // check if mutation failed
    if(response.error){
        <h1>Error al crear un nuevo reto</h1>
    }

    return(
        <div>
            <ChallengeCard reto='Reto de 3 minutos' status='active'  img='calendario' handleOpen={handleOpen}/>

            <ChallengeCard reto='Reto de 14 dias' status='inactive'  img='campana' handleOpen={handleOpen}/>

            <ChallengeCard reto='Reto de 30 dias' status='inactive'  img='campana' handleOpen={handleOpen}/>

            <Modal
              open={open}
              onClose={handleClose}
            >
                <div className={style.list}>
                    <button onClick={handleClose} className={style.close} >
                        <AiOutlineCloseCircle />
                    </button>
                    <HabitsList handleChecked={handleChecked} habits={habits} snackbar={enqueueSnackbar}/>
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={(e) => crearNuevoReto(e)} disabled={disableBtn()}>
                        Empezar nuevo reto
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

const ChallengeCard = ({ reto, status, img, handleOpen }) => {

    function activeChallenge(){
        status === 'active' && handleOpen()
    }

    return(
        <div onClick={activeChallenge} className={style.newChallengeCard} style={ status === 'active' ? {cursor: 'pointer'} : { backgroundColor: '#9b9b9e', color: 'black'}}>
            <div className={style.challengeInfo}>
                <h2>{reto}</h2>
                <span>{ status === 'active' ? 'Comienza tu nuevo reto' : 'Cooming Soon'}</span>
            </div>
            <img src={`/images/newChallenge/${img}.png`} alt={status} />
            <img src="/images/newChallenge/effect.png" alt="Efecto" className={style.effect}/>
        </div>
    )
}
