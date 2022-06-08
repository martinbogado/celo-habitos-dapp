import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";

import {useQuery, useMutation, gql} from "@apollo/client"

import { Habitos } from "@celo-progressive-dapp-starter/hardhat/types/Habitos";

import style from './habits/HabitContract.module.scss';
import NuevoReto from "./habits/NuevoReto/NuevoReto";
import Habit from "./habits/Habit/Habit";

// GraphQL Query String
const QUERY_STRING = gql`
    query ChallengeInfo($user: String!) {
        challenges(where: {address: {_eq: $user}}) {
          streak
          address
          habits {
            habit
            img
            description
          }
        }
    }`

const ADD_CHALLENGE = gql`
    mutation AddNewChallenge($challenge: [challenges_insert_input!]!, $addhabits: [habits_insert_input!]!) {
        insert_challenges(objects: $challenge) {
            affected_rows
        },
        insert_habits(objects: $addhabits) {
            affected_rows
        }
    }`


export function HabitosContract({ contractData }) {
    
    const { kit, address, network, performActions } = useContractKit();

    console.log(address)
    // run query using the useQuery Hook
    // refetch is a function to repeat the request when needed
    const {data, loading, refetch, error} = useQuery(QUERY_STRING,{
        variables: { user: address },
      });
    console.log('The Graph query results', data);
 
    // create function to run mutation
    const [add_challenge, response] = useMutation(ADD_CHALLENGE)

    // state to hold form data
    const [form, setForm] = useState({habit: "", count: 0});

    const habit1 = {
        user: address,
        habit: 'Jugar Pelota',
        description: 'Nose'
    }

    const habit2 = {
        user: address,
        habit: 'Jugar Volley',
        description: 'Nose'
    }

    // handleChange function for form
    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    // handleSubmit function for when form is submitted
    const handleSubmit = async (e) => {
        // prevent refresh
        e.preventDefault();
        // add habit, pass in variables
        await add_challenge({
            variables: {
                challenge: [{address: address}], 
                addhabits: [habit1, habit2]
            }
        });
        // refetch query to get new data
        refetch();
    }

    // check if mutation failed
    if(response.error){
    <h1>Failed to Add Habit</h1>
    }

    // return value if the request errors
    if (error){  
        return(
            <>
             { error.message == 'unexpected null value for type "String"' ?
             <>
              <h1>Please connect your wallet</h1>
             </>
           
            :
            <div>
              <h1>There is an Error</h1>
              <div>{error.message}</div>
            </div>
            }
            </>   
        ) 
    }

    // return value if the request is pending
    if (loading) {
    return <h1>The Data is Loading</h1>
    }

    // return value if the request is completed
    if (data){
    return <div className={style.container}>
        <form onSubmit={handleSubmit}>
            <input type="text" name="habit" value={form.habit} onChange={handleChange}/>
            <input type="number" name="count" value={form.count} onChange={handleChange}/>
            <input type="submit" value="track habit"/>
        </form>
        <div>{data.challenges[0]?.streak}</div>
        {data.challenges[0] ? 
            data.challenges[0].habits?.map( h => {
                return(
                  <Habit img={h.img} habit={h.habit} description={h.description} />
                )
            })
          :
          <div>
              <button>Comenzar nuevo reto</button>
              <NuevoReto />
          </div> 
        }
        
    </div>
    }
}