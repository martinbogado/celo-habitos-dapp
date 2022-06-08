import * as React from "react";
import { useState } from "react";
import { Box, Button, Divider, Grid, Typography, Link, Modal } from "@mui/material";

import {useQuery, gql} from "@apollo/client";

import style from './NuevoReto.module.scss';

import HabitsList from "../HabitsList/HabitsList";


const NuevoReto = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div className={style.container}>
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
                    <HabitsList />
                    <Button sx={{ m: 1, marginTop: 4 }} variant="contained">
                        Empezar nuevo reto
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default NuevoReto