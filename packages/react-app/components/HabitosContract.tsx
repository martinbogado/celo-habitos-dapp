import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";

import {useQuery, useMutation, gql} from "@apollo/client"

import { Habitos } from "@celo-progressive-dapp-starter/hardhat/types/Habitos";

import style from './habits/HabitContract.module.scss';
import { RiEmotionSadLine } from 'react-icons/ri';
import { TbPlugConnected } from 'react-icons/tb';

import NuevoReto from "./habits/NuevoReto/NuevoReto";
import Habit from "./habits/Habit/Habit";
import HabitHeader from "./habits/Header/HabitHeader";

// GraphQL Query String
const QUERY_STRING = gql`
    query ChallengeInfo($user: String!) {
        challenges(where: {address: {_eq: $user}}) {
          address
          id
          streak
          habits {
            habit
            img
            description
          }
        }
    }`

const UPDATE_STREAK = gql`
    mutation UpdateStreak($user: String!) {
      update_challenges(where: {address: {_eq: $user}}, _inc: {streak: 1}) {
        affected_rows
      }
    }`

export function HabitosContract({ contractData }) {
    
    const { kit, address, network, performActions } = useContractKit();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [completed, setCompleted] = useState([]);
    console.log(completed);

    const {data, loading, refetch, error} = useQuery(QUERY_STRING,{
      variables: { user: address },
    });
    // console.log('The Graph query results', data);

    const [update_streak, response] = useMutation(UPDATE_STREAK);

    const contract = contractData
    ? (new kit.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as Habitos)
    : null;

    const crearReto = async () => {
        let id;

        try {
          await performActions(async (kit) => {
            const { CELO } = await kit.getTotalBalance(address);
 
            const oneGold = kit.connection.web3.utils.toWei('1', 'ether');

            const result = await contract.methods
              .crearReto('nuevoReto' as string)
              .send({ from: address, value: oneGold });

            const variant = result.status == true ? "success" : "error";
           
            const action: SnackbarAction = (key) => (
              <>  
                <Button
                  onClick={() => {
                    closeSnackbar(key);
                  }}
                >
                  X
                </Button>
              </>
            );
            enqueueSnackbar("Nuevo Reto Creado", {
              variant,
              action,
            });

            console.log(result.events['RetoCreado']?.returnValues.id);
            
            id = result.events['RetoCreado']?.returnValues.id
          });
        } catch (e) {
          enqueueSnackbar(e.message, {variant: 'error'});
          console.log(e);
        }

        return id
      };

      const actualizarStreak = async (id) => {
        try {
          await performActions(async (kit) => {
            const gasLimit = await contract.methods
              .completarRetoDiario(id)
              .estimateGas();
    
            const result = await contract.methods
              .completarRetoDiario(id)
              //@ts-ignore
              .send({ from: address, gasLimit });
    
            console.log(result);
    
            const variant = result.status == true ? "success" : "error";

            if(result.status == true){
              await update_streak({
                variables: {
                  user: address
                }
              });

              refetch();
              setCompleted([]);
              console.log(response);
            }
           
            const action: SnackbarAction = (key) => (
              <>    
                <Button
                  onClick={() => {
                    closeSnackbar(key);
                  }}
                >
                  X
                </Button>
              </>
            );
            enqueueSnackbar("Habitos del Dia Completados", {
              variant,
              action,
            });
          });
        } catch (e) {
          enqueueSnackbar(e.message, {variant: 'error'});
          console.log(e);
        }
      };

    function handleChecked(e){
        if (e.target.checked) { 
            setCompleted([...completed, {
                habit: e.target.value
            }]);   
        } else if (!e.target.checked) {
            setCompleted(
              completed.filter(el => el.habit !== e.target.value)
            ) 
        }
      };

    function habitosCompletados(){
      if(data.challenges[0].habits.length !== completed.length){
        enqueueSnackbar("Debe completar todos los habitos antes de terminar el dia", {variant: 'error', autoHideDuration: 2500});
        return true
      }
      return false
    }
    
    // return value if the request errors
    if (error){  
        return(
            <div className={style.container}>
                <HabitHeader streak={null} loading={true} address={address} retoCreado={!!data?.challenges[0]} allCompleted={null} habitsLeft={null}/>
             { error.message == 'unexpected null value for type "String"' ?
                <div className={style.connectWallet}>
                    <TbPlugConnected />
                    <p>Por favor conecta tu Wallet</p>
                </div>
           
            :
                <div>
                    <div className={style.connectWallet}>
                        <RiEmotionSadLine />
                        <p>A ocurrido un error</p>
                    </div>
                    <div>{error.message}</div>
                </div>
            }
            </div>   
        ) 
    }

    // return value if the request is pending
    if (loading) {
    return(
        <div className={style.container}>
            <HabitHeader streak={null} loading={true} address={address} retoCreado={!!data?.challenges[0]} allCompleted={null} habitsLeft={null}/>
            <div className={style.loading}>
                <p>La información esta cargando</p>
                <img src="/images/loading.gif" alt="Loading" />
            </div>   
        </div>
    )}

    // return value if the request is completed
    if (data){
    return <div className={style.container}>
        <HabitHeader streak={data.challenges[0]?.streak} loading={false} retoCreado={!!data.challenges[0]} address={address} allCompleted={data.challenges[0]?.habits.length === completed.length} habitsLeft={data.challenges[0]?.habits.length - completed.length} />
       
        {data.challenges[0] ? 
            data.challenges[0].habits?.map( h => {
                return(
                  <Habit 
                    img={h.img} 
                    habit={h.habit} 
                    description={h.description} 
                    key={h.img} handleChecked={handleChecked} 
                    checked={!!completed.filter( el => el.habit === h.habit).length}
                  />
                )
            })
          :
            <>
              <NuevoReto crearReto={crearReto} address={address} refetch={refetch}/> 
            </>
            
        }
        {data.challenges[0] && (
            <Button sx={{ m: 1, marginTop: 4 }} variant="contained" onClick={() => actualizarStreak(data.challenges[0].id)} disabled={habitosCompletados()}>
                Completar Dia
            </Button>
        )}
    </div>
    }
}