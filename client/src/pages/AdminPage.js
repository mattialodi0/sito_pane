import { useState, useEffect } from "react";
import Header from "../shared/Header";
import OrderList from "../OrderList";
import { Navigate } from 'react-router-dom';
import DefaultModal from '../shared/DefaultModal';
import ServerUrl from "../shared/ServerUrl";

export default function AdminPage() {
    const [namec, setNamec] = useState('');
    const [descc, setDescc] = useState('');
    const [pricec, setPricec] = useState('');
    const [filec, setFilec] = useState('');
    const [nameu, setNameu] = useState('');
    const [descu, setDescu] = useState('');
    const [priceu, setPriceu] = useState('');
    const [fileu, setFileu] = useState('');
    const [named, setNamed] = useState('');

    const [orders, setOrders] = useState([]);
    const [admin, setAdmin] = useState(true);
    const [orderStatus, setOrderStatus] = useState('order');

    const [prodModal, setProdModal] = useState(false);
    const [orderModal, setOrderModal] = useState(false);

    useEffect(() => {
        if (admin) {
            retriveOrders();
        }
    }, [orderStatus]);

    function retriveOrders() {
        ServerUrl.url
        fetch(ServerUrl.url+`/${orderStatus}`, { credentials: 'include' })
            .then(response => {
                if (response.status == 400) {
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

    async function createProduct(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('name', namec);
        data.set('desc', descc);
        data.set('price', Number(pricec));
        data.set('file', filec[0]);
        data.set('hidden', false);

        const res = await fetch(ServerUrl.url+"/product", {
            method: 'POST',
            body: data,
            credentials: 'include'
        });
        if (res.ok) {
            alert("prodotto aggiunto con successo");
            setNamec('');
            setDescc('');
            setPricec('');
            setFilec('');
        }
    }

    async function updateProduct(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('name', nameu);

        if (descu) {
            data.set('desc', descu);
        }
        if (priceu) {
            data.set('price', Number(priceu));
        }
        if (1) {
            data.set('hidden', false);
        }
        if (fileu?.[0]) {
            data.set('file', fileu?.[0]);
        }
        const response = await fetch(ServerUrl.url+'/product', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            alert("prodotto modificato con successo")
            setNameu('');
            setDescu('');
            setPriceu('');
            setFileu('');
        }
    }

    async function deleteProduct(ev) {
        ev.preventDefault();

        const response = await fetch(ServerUrl.url+`/product/${named}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const j = await response.json();
        if (response.ok && j.deletedCount === 1) {
            alert("prodotto eliminato con successo")
            setNamed('');
        }
    }

    async function deleteOrder(ev, id) {
        ev.preventDefault();

        const response = await fetch(ServerUrl.url+`/order/${id}`, {
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

        const response = await fetch(ServerUrl.url+`/order/${id}/mark`, {
            method: 'PUT',
            credentials: 'include',
        });
        const j = await response.json();
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
                    <OrderList order={orders} deleteOrder={() => setOrderModal(true)} markOrder={markOrder} />
                    {orderModal && (<DefaultModal content={(
                        <div>
                            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">Vuoi davvero cancellare questo ordine?</p>
                            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">Poi non sarà più possibile ripristinarlo</p>
                        </div>
                    )} confirm={deleteOrder} cancel={() => setOrderModal(false)} />)}
                </div>

                <hr className="my-10 h-1 w-4/5 mx-auto bg-primary" />

                <h2>Cambia i prodotti</h2>
                <form onSubmit={createProduct}>
                    <h3>Aggiungi prodotto</h3>
                    <div className="flex flex-col">
                        <input type="text" placeholder="nome" required
                            value={namec}
                            onChange={ev => setNamec(ev.target.value)}
                        />
                        <input type="text" placeholder="prezzo in €/kg" required
                            value={pricec}
                            onChange={ev => setPricec(ev.target.value)}
                        />
                        <input type="text" placeholder="descrizione"
                            value={descc}
                            onChange={ev => setDescc(ev.target.value)}
                        />
                        <input type="file" placeholder="immagine" required className="bg-white"
                            onChange={ev => setFilec(ev.target.files)}
                        />
                        <button className="w-1/2 m-auto">aggiungi</button>
                    </div>
                </form>
                <form onSubmit={updateProduct}>
                    <h3>Modifica prodotto</h3>
                    <div className="flex flex-col">
                        <label htmlFor="name-to-change">elemento da modificare </label>
                        <input type="text" placeholder="nome" required id="name-to-change"
                            value={nameu}
                            onChange={ev => setNameu(ev.target.value)}
                        />
                        <p>nuovi parametri</p>
                        <input type="text" placeholder="prezzo in €/kg"
                            value={priceu}
                            onChange={ev => setPriceu(ev.target.value)}
                        />
                        <input type="text" placeholder="descrizione"
                            value={descu}
                            onChange={ev => setDescu(ev.target.value)}
                        />
                        <input type="file" placeholder="immagine" className="bg-white"
                            onChange={ev => setFileu(ev.target.files)}
                        />
                        <button className="w-1/2 m-auto">modifica</button>
                    </div>
                </form>
                <form onSubmit={() => setProdModal(true)}>
                    <h3>Rimuovi prodotto</h3>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="prodotto"
                            required
                            className="w-[303.2px]"
                            value={named}
                            onChange={ev => setNamed(ev.target.value)}
                        />
                        <button className="w-1/2 m-auto">cancella</button>
                    </div>
                </form>

                {prodModal && (<DefaultModal content={(
                    <div>
                        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">Vuoi davvero cancellare questo prodotto?</p>
                        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">Poi non sarà più possibile ripristinarlo</p>
                    </div>
                )} confirm={deleteProduct} cancel={() => setProdModal(false)} />)}
                <div className="h-32 w-screen"></div>
            </div>
        </>
    )
}
