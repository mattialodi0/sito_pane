import { useContext, useState, useEffect } from "react";
import Header from '../shared/Header';
import ServerUrl from "../shared/ServerUrl";
import { UserContext } from "../UserContext";

export default function Personalpage() {
    const { userInfo } = useContext(UserContext);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const apiCall = async () => {
            const jwt = localStorage.getItem('jwt');
            const res = await fetch(`${ServerUrl.url}/${jwt}/user/stats`, { credentials: 'include' });
            if (res.status === 200)
                res.json().then(s => {
                    setStats(s);
                });
        };
        apiCall();
    }, []);

    return (
        <>
            <Header />
            <h2>Bentornato, { userInfo.username? userInfo.username : ' ' }</h2>
            <h4>statistiche:</h4>
            <div className="stats flex flex-col items-center">
                <p>ordini effettuati: {stats.orders}</p>
                <p>ordini completati: {stats.completedOrders}</p>
            </div>
        </>
    )
}