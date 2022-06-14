import React, { useState } from 'react'
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";
import style from './Finalizar.module.scss';

import { RiEmotionSadLine } from 'react-icons/ri';
import { BiUserCircle, BiFileFind } from 'react-icons/bi';
import { TbConfetti } from 'react-icons/tb';
import { FiClock } from 'react-icons/fi';

import { useMutation, gql } from '@apollo/client';
import { truncateAddress } from '@/utils';

const DELETE_CHALLENGE = gql`
    mutation DeleteChallenge($user: String!) {
        delete_habits(where: {user: {_eq: $user}}){
        affected_rows
        },
        delete_challenges(where: {address: {_eq: $user}}){
        affected_rows
        }
    }`

const Finalizar = ({ finalizarReto, id, premio, nft, exito, refetch, address }) => {
    const [open, setOpen] = useState(false);
    const [openNFT, setOpenNFT] = useState(false);
    const [idReto, setIdReto] = useState(null);

    const [delete_challenge, response ] = useMutation(DELETE_CHALLENGE)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenNFT = () => setOpenNFT(true);
    const handleCloseNFT = () => setOpenNFT(false);

    const handleClick = async () => {
        const status = await finalizarReto(id);

        status == true && handleOpen();
    }

    const retoExitoso = async (id) => {
        handleClose();
        
        const status = await premio(id);
        const resultado = await nft(id);

        if(status == true && resultado.status == true){
            handleOpenNFT();
            setIdReto(resultado.events['NFTMinteado']?.returnValues.idReto);
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
            
            <Modal
                open={openNFT}
                onClose={handleCloseNFT}
            >
                <div className={style.nft}>
                    <img src="/images/trofeo.png" alt="NFT" />

                    <div>
                        <h3>NFT Otorgado</h3>
                        
                        <span>
                            <BiUserCircle /> Usuario Ganador: <strong>{truncateAddress(address)}</strong>
                        </span>
                        <span>
                            <FiClock /> Duracion del Reto: <strong>3 Minutos</strong>
                        </span>
                        <span>
                            <BiFileFind /> ID del Reto: <strong>{idReto}</strong>
                        </span>
                    </div>
                    
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={() => tryAgain()}>
                        Volver al Inicio
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default Finalizar