import React, { useState } from 'react'
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";
import style from './Finalizar.module.scss'

const Finalizar = ({ finalizarReto, id, premio }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClick = async () => {
        const result = await finalizarReto(id);

        result == true && handleOpen();
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
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained">
                        Cobrar Premio
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default Finalizar