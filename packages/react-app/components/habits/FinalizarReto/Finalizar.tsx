import React, { useState } from 'react'
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";
import style from './Finalizar.module.scss';

import { RiEmotionSadLine } from 'react-icons/ri';
import { TbConfetti } from 'react-icons/tb';
import { useMutation, gql } from '@apollo/client';

const DELETE_CHALLENGE = gql`
    mutation DeleteChallenge($user: String!) {
        delete_habits(where: {user: {_eq: $user}}){
        affected_rows
        },
        delete_challenges(where: {address: {_eq: $user}}){
        affected_rows
        }
    }`

const Finalizar = ({ finalizarReto, id, premio, exito, refetch, address }) => {
    const [open, setOpen] = useState(false);

    const [delete_challenge, response ] = useMutation(DELETE_CHALLENGE)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = async () => {
        const status = await finalizarReto(id);

        status == true && handleOpen();
    }

    const retoExitoso = async (id) => {
        handleClose();
        
        const status = await premio(id);

        if(status == true){
            await delete_challenge({
              variables: {
                user: address
              }
            });

            refetch();    
            console.log(response);
          }
    }

    const tryAgain = async () => {  
        await delete_challenge({
            variables: {
            user: address
            }
        });

        handleClose();
        refetch();
        console.log(response);   
    }

    return(
        <div>
            <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={handleClick}>
              Finalizar Reto
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
            >
                <div className={style.container}>
                    {
                        exito ?
                        <>
                        <h2><TbConfetti /> Felicidades! Terminaste exitosamente tu reto</h2>
                        <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={() => retoExitoso(id)}>
                            Reclamar Premio
                        </Button>
                        </> 
                        
                        :
                        <>
                        <h2><RiEmotionSadLine /> Lo sentimos, no pudiste completar el reto</h2>
                        <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={() => tryAgain()}>
                            Volver a Intentarlo
                        </Button>
                        </>
                    }

                </div>
            </Modal>
        </div>
    )
}

export default Finalizar