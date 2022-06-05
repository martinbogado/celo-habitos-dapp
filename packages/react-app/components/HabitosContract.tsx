import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";

import {useQuery, useMutation, gql} from "@apollo/client"

import { Habitos } from "@celo-progressive-dapp-starter/hardhat/types/Habitos";

export function HabitosContract({ contractData }) {
    
    // GraphQL Query String
    const QUERY_STRING = gql`{
        habits {
        id
        habit
        count
        }
    }`

    const MUTATION_STRING = gql`mutation add_habit ($objects: [habits_insert_input!]!){
        insert_habits(objects: $objects){
          affected_rows
        }
      }`

    // run query using the useQuery Hook
    // refetch is a function to repeat the request when needed
    const {data, loading, refetch, error} = useQuery(QUERY_STRING);
    console.log('The Graph query results', data);
 
    // create function to run mutation
    const [add_habit, response] = useMutation(MUTATION_STRING)

    // state to hold form data
    const [form, setForm] = useState({habit: "", count: 0})

    // handleChange function for form
    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    // handleSubmit function for when form is submitted
    const handleSubmit = async (e) => {
        // prevent refresh
        e.preventDefault();
        // add habit, pass in variables
        await add_habit({variables: {objects: [form]}});
        // refetch query to get new data
        refetch();
    }

    // check if mutation failed
    if(response.error){
    <h1>Failed to Add Habit</h1>
    }

    // return value if the request errors
    if (error){
    return <h1>There is an Error</h1>
    }

    // return value if the request is pending
    if (loading) {
    return <h1>The Data is Loading</h1>
    }

    // return value if the request is completed
    if (data){
    return <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="habit" value={form.habit} onChange={handleChange}/>
            <input type="number" name="count" value={form.count} onChange={handleChange}/>
            <input type="submit" value="track habit"/>
        </form>
        {data.habits.map(h => <h1 key={h.id}>{h.habit} {h.count}</h1>)}
    </div>
    }
}