import { useState, useEffect } from "react";
import Header from "../shared/Header";
import OrderList from "../OrderList";
import { Navigate } from 'react-router-dom';
import DefaultModal from '../shared/DefaultModal';
import ServerUrl from "../shared/ServerUrl";

export default function OrderDashboard() {
    const [orders, setOrders] = useState([]);
    const [admin, setAdmin] = useState(true);
    const [orderStatus, setOrderStatus] = useState('order');

    const [orderModal, setOrderModal] = useState(false);
    const [delElId, setDelElId] = useState(0);


    useEffect(() => {
        if (admin) {
            retriveOrders();
        }
    }, [orderStatus]);

    function retriveOrders() {
        const jwt = sessionStorage.getItem('jwt')
        fetch(ServerUrl.url + `/${jwt}/${orderStatus}`, { credentials: 'include' })
            .then(response => {
                if (response.status === 400) {
                    alert("Non sei un amministratore");
                    setAdmin(false);
                }
                else {
                    setAdmin(true);
                    response.json().then(o => {
                        setOrders(o);
                    });
                }
            })
    }

    async function deleteOrder(ev) {
        ev.preventDefault();
        setOrderModal(false);
        const jwt = sessionStorage.getItem('jwt')
        const response = await fetch(ServerUrl.url + `/${jwt}/order/${delElId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const j = await response.json();
        if (response.ok && j.deletedCount === 1) {
            alert("ordine eliminato con successo")
            retriveOrders();
        }
    }

    async function markOrder(ev, id) {
        ev.preventDefault();
        setOrderModal(false);
        const jwt = sessionStorage.getItem('jwt')
        const response = await fetch(ServerUrl.url + `/${jwt}/order/${id}/mark`, {
            method: 'PUT',
            credentials: 'include',
        });
        // const j = await response.json();
        if (response.ok) {
            alert("ordine evaso con successo")
            retriveOrders();
        }
    }


    return (
        <>
            {!admin && <Navigate to="/" />}
            <Header />
            <div className="admin">
                <h1 className="text-center">Ordini effettuati</h1>
                <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); }}
                    className="mx-auto p-1 text-center border-2 border-primary rounded-md bg-secondary">
                    <option className="hover:bg-primary" value={'order'}>{'tutti'}</option>
                    <option className="hover:bg-primary" value={'non-marked-order'}>{'non evasi'}</option>
                    <option className="hover:bg-primary" value={'marked-order'}>{'solo evasi'}</option>
                </select>
                <div className="md:w-1/2 mx-auto">
                    <OrderList order={orders} deleteOrder={(e,id) => {setOrderModal(true); setDelElId(id)}} markOrder={markOrder} />
                    {orderModal && (<DefaultModal content={(
                        <div>
                            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">Vuoi davvero cancellare questo ordine?</p>
                            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">Poi non sarà più possibile ripristinarlo</p>
                        </div>
                    )} confirm={deleteOrder} cancel={() => {setOrderModal(false); setDelElId(0); }} />)}
                </div>
            </div>
        </>
    )
}
