
import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Slot } from '@/types';
import Link from 'next/link';

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

const BOOK_SLOT = gql`
    mutation BookSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!, $dni: String!) {
        bookSlot(day: $day, month: $month, year: $year, hour: $hour, dni: $dni) {
            day,
            month,
            year,
            hour,
            available,
            dni
        }
    }
`;

//En esta página el renderizado también se realiza en el cliente, ya que se trata de una página que se actualiza constantemente y que no necesita
//recargar la página para mostrar los cambios. Se interactúan con los datos de los formularios y la base de datos.

export default function Paciente() {
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(0);
    const [dni, setDni] = useState("");
    const { loading, error, data } = useQuery(GET_SLOTS, {
        variables: {
            year: date.getFullYear(),
            month : date.getMonth() + 1,
        }
    });
    const [bookSlot, { data: dataBook }] = useMutation(BOOK_SLOT);

    useEffect(() => {
        if(dataBook) {
            alert("Cita reservada");
            setDni("");
            setDate(new Date());
            setHour(0);
        }
    }, [dataBook]);



    if(error) return <p>Error :(</p>;
    if (loading) return <p>Loading...</p>;

    return (
        <>
        <title>Paciente</title>
        <StyledForm>
            <h1>Reservar cita</h1>
            <div>
                <label>
                    DNI:
                    <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} />
                </label>
            </div>
                <label>
                   Fecha:
                    <input type="date" value={date.toISOString().split("T")[0]} onChange={(e) => {
                        const date = new Date(e.target.value);
                        setDate(date);
                    }} />
                </label>
                <label>
                    Hora:
                    <input type="time" min="09:00" max="21:00" name="hora" value={hour.toString().padStart(2, "0") + ":00"} onChange={(e) => {
                        const hour = parseInt(e.target.value.split(":")[0]);
                        setHour(hour);
                    }} />
                </label>
                {data && data.availableSlots && data.availableSlots.filter((slot: Slot) => slot.hour === hour && slot.available).length > 0 ? <p>Cita disponible</p> : <p>Cita no disponible</p>}
                <button onClick={() => {
                    if(!dni) return alert("Ingrese un DNI");
                    if(!hour) return alert("Ingrese una hora");
                    if(!date) return alert("Ingrese una fecha");
                    if(dni.length !== 8 || isNaN(parseInt(dni))) return alert("Ingrese un DNI válido");

                    bookSlot({
                        variables: {
                            day: date.getDate(),
                            month : date.getMonth() + 1,
                            year : date.getFullYear(),
                            hour,
                            dni,
                        }
                    });
                    
                    
                }}
                >Reservar</button>{dataBook && dataBook.bookSlot ? <p>Reserva realizada</p> : null}
            </StyledForm>
            <StyledTable>
                <thead>
                    <tr>
                        <th>Dia</th>
                        <th>Mes</th>
                        <th>Año</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {data.availableSlots.length > 0 ? data.availableSlots.map((slot: Slot) => {
                        return (
                            <tr key={slot.day + "-" + slot.month + "-" + slot.year + "-" + slot.hour}>
                                <td>{slot.day}</td>
                                <td>{slot.month}</td>
                                <td>{slot.year}</td>
                                <td>{slot.hour}</td>
                            </tr>
                        );
                    }
                    ) : <tr><td colSpan={4}>No hay citas disponibles</td></tr>}
                </tbody>
        </StyledTable>
        <StyledLink href="/">Volver al menú</StyledLink>
        </>
    );
}

const StyledForm = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px;
    padding: 20px;
    border: 1px solid black;
    border-radius: 5px;
    background-color: #f2f2f2;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    h1 {
        margin: 0;
    }
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 10px;
        label {
            margin: 0 10px;
        }
    }
    button {
        margin: 10px;
        padding: 5px;
        border-radius: 5px;
        background-color: #f2f2f2;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        cursor: pointer;
    }

    button:hover {
        background-color: #e6e6e6;
    }


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








