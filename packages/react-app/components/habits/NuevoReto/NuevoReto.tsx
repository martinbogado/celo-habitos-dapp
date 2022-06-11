import * as React from "react";
import { useState } from "react";
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";

import {useMutation, gql} from "@apollo/client";

import style from './NuevoReto.module.scss';

import HabitsList from "../HabitsList/HabitsList";

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
    const [habits, setHabits] = useState([])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // create function to run mutation
    const [add_challenge, response] = useMutation(ADD_CHALLENGE);

    console.log(habits)

    function handleChecked(e){
        if (e.target.checked) {
            setHabits([...habits, {
                user: address,
                habit: e.target.value,
                img: e.target.id
            }])          
        } else if (!e.target.checked) {
            setHabits(
                habits.filter(el => el.habit !== e.target.value)
            ) 
        }
    };

    const crearRetoEnBD = async (id) => {
      if(id){
        await add_challenge({
            variables: {
                challenge: [{address: address}], 
                addhabits: habits
            }
        });
  
        handleClose();
        refetch();
      } 
    }

    async function crearNuevoReto(e){
        e.preventDefault();

        crearRetoEnBD(crearReto());
    } 

    // check if mutation failed
    if(response.error){
        <h1>Error al crear un nuevo reto</h1>
    }

    return(
        <div>
            <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={handleOpen}>
              Comenzar nuevo reto
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
            >
                <div className={style.list}>
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={handleClose} className={style.close}>
                        X
                    </Button>
                    <HabitsList handleChecked={handleChecked} />
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={(e) => crearNuevoReto(e)}>
                        Empezar nuevo reto
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default NuevoReto