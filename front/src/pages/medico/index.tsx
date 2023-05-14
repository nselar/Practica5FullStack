import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Slot } from '../types';

const GET_SLOTS = gql`
    query GetSlots ($year: Int!, $month: Int!) {
        availableSlots(year: $year, month: $month) {
            day,
            month,
            year,
            hour,
            available,
            dni
        }
    }
`;

const CREATE_SLOT = gql`
    mutation CreateSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!) {
        addSlot(day: $day, month: $month, year: $year, hour: $hour) {
            day,
            month,
            year,
            hour,
            available
        }
    }
`;

const REMOVE_SLOT = gql`
    mutation RemoveSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!) {
        removeSlot(day: $day, month: $month, year: $year, hour: $hour) {
            day,
            month,
            year,
            hour,
            available
        }

    }
`;

//El renderizado de la página se realiza en el cliente porque permite que la página se actualice sin tener que recargarla. Por lo que se ahorran
//recursos y se mejora la experiencia de usuario al realizarse mucho más rápido.

export default function Medico() {
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(0);
    const { loading, error, data } = useQuery(GET_SLOTS, {
        variables: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
        }
    });
    const [createSlot, { data: dataCreate }] = useMutation(CREATE_SLOT);
    const [removeSlot, { data: dataRemove }] = useMutation(REMOVE_SLOT);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <title>Medico</title>
            <StyledTitle>Crear cita</StyledTitle>
            <StyledForm>
                <input type="date" value={date.toISOString().split("T")[0]} onChange={(e) => setDate(new Date(e.target.value))} />
                <input type="time" value={hour.toString().padStart(2, "0") + ":00"} onChange={(e) => {
                        const hour = parseInt(e.target.value.split(":")[0]);
                        setHour(hour); }} />
                <StyledButton
                    onClick={() => {
                        if(!date || !hour) return alert("Faltan datos");
                        if(data.availableSlots.find((slot: Slot) => slot.day === date.getDate() && slot.month === date.getMonth() + 1 && slot.year === date.getFullYear() && slot.hour === hour)) return alert(" La cita ya existe");

                        createSlot({
                            variables: {
                                year: date.getFullYear(),
                                month: date.getMonth() + 1,
                                day: date.getDate(),
                                hour
                            },
                            refetchQueries: [{
                                query: GET_SLOTS,
                                variables: {
                                    year: date.getFullYear(),
                                    month: date.getMonth() + 1,
                                }
                            }]
                        });
                    }}
                >
                    +
                </StyledButton>
                {dataCreate && dataCreate.addSlot && (
                    <p>
                        Cita creada para el {dataCreate.addSlot.day}/{dataCreate.addSlot.month}/{dataCreate.addSlot.year} a las {dataCreate.addSlot.hour}:00
                    </p>
                )}
            </StyledForm>
                    <StyledTitle>Listado de citas</StyledTitle>
            <StyledTable>
                <thead>
                    <tr>
                        <th>Dia</th>
                        <th>Mes</th>
                        <th>Año</th>
                        <th>Hora</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {data.availableSlots.map((slot: Slot) => (
                        <tr key={`${slot.day}-${slot.month}-${slot.year}-${slot.hour}`}>
                            <td>{slot.day}</td>
                            <td>{slot.month}</td>
                            <td>{slot.year}</td>
                            <td>{slot.hour+ ":00"}</td>
                            <td>
                                <StyledButton
                                    onClick={() => {
                                        removeSlot({
                                            variables: {
                                                year: slot.year,
                                                month: slot.month,
                                                day: slot.day,
                                                hour: slot.hour,
                                            },
                                            refetchQueries: [{
                                                query: GET_SLOTS,
                                                variables: {
                                                    year: slot.year,
                                                    month : slot.month,
                                                }
                                            }]
                                        });
                                    }}
                                >
                                    🗑️
                                </StyledButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
            <StyledLink href="/">Volver al Menú</StyledLink>
        </>
    );
}

const StyledForm = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin bottom: 5rem;

    input {
        margin: 0 10px;
        padding: 5px;
        border-radius: 5px;
        background-color: #f2f2f2;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }

    input[type="date"] {
        width: 150px;
    }

    input[type="time"] {
        width: 100px;
    }

`;

const StyledInput = styled.input`
    margin: 0 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;

    &:hover {
        background-color: #ccc;
    }

    &:focus {
        outline: none;
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &::-webkit-calendar-picker-indicator {
        -webkit-appearance: none;
        display: none;
    }

`;

const StyledButton = styled.button`
    margin: 10px;
    padding: 5px;
    border-radius: 5px;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    cursor: pointer;

    &:hover {
        background-color: #ccc;
    }
`;

const StyledTable = styled.table`
    width: 50%;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    
    th, td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    button {
        margin: 0 10px;
        padding: 5px;
        border-radius: 5px;
        background-color: #f2f2f2;
        cursor: pointer;
    }

`;

const StyledTitle = styled.h1`
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 1rem;
    font-size: 2rem;
    color: #000;
`;

const StyledLink = styled.a`
    text-decoration: none; 
    color: #000;
    font-size: 1.4rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 1rem;
    display: block;
    cursor: pointer;
    &:hover {
        color: #ccc;
    }
`;




