import { useState, useEffect } from "react";
import React from "react";
import Header from '../shared/Header';
import FormEl from '../FormEl';
import Loader from '../shared/Loader';
import UserOrderList from "../UserOrderList";
import DefaultModal from "../shared/DefaultModal";
import ServerUrl from "../shared/ServerUrl";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [formEl, setFormEl] = useState([{ id: crypto.randomUUID(), selProd: "", quantity: 1 }]);
    const [desc, setDesc] = useState('');
    const [products, setProducts] = useState([]);

    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(ServerUrl.url+'/product', { credentials: 'include' })
                .then(response => {
                    response.json().then(products => {
                        setProducts(products);
                    })
                })
            const jwt = localStorage.getItem('jwt')
            await fetch(ServerUrl.url+`/${jwt}/user/order`, { credentials: 'include' })
                .then(response => {
                    response.json().then(orders => {
                        setOrders(orders);
                    })
                })
        }
        fetchData();
    }, []);

    function addFormEl() {
        if (formEl.length < 5) {
            setFormEl(currFormEl => {
                return [...currFormEl, { id: crypto.randomUUID() }]
            })
        }
        else alert('Non è possibile ordinare più di 5 articoli alla volta');
    }

    function deleteFormEl(id) {
        if (formEl.length > 1)
            setFormEl(currFormEl => {
                return currFormEl.filter(el => el.id !== id);
            })
        else alert('Non è possibile effettuare ordini vuoti');
    }

    function changeSelProd(id, value) {
        setFormEl(currFormEls => {
            let els = currFormEls.filter(el => el.id !== id);
            let currEl = currFormEls.filter(el => el.id === id);
            currEl[0].selProd = value;
            return [...els, currEl[0]];
        })
    }

    function changeSelQuantity(id, value) {
        setFormEl(currFormEls => {
            let els = currFormEls.filter(el => el.id !== id);
            let currEl = currFormEls.filter(el => el.id === id);
            currEl[0].quantity = value;
            return [...els, currEl[0]];
        })
    }

    async function verifyOrder(ev) {
        formEl.forEach(f => {
            if (f.quantity < 1)
                alert(`Quantità di "${f.selProd}" non vaida`);
        })
        if (formEl.length === 1 && formEl[0].selProd === "")
            alert('Non è possibile effettuare ordini vuoti');
        else {
            setModal(true);
        }
    }

    async function submitOrder(ev) {
        setModal(false);
        let productsNames = formEl.map(f => f.selProd);
        let quantities = formEl.map(f => f.quantity);
        const jwt = localStorage.getItem('jwt')
        
        const res = await fetch(ServerUrl.url+`/${jwt}/order`, {
            method: 'POST',
            body: JSON.stringify({ productsNames, quantities, desc }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (res.status === 200) { alert('ordine effettuato con successo') }
        else { alert('login fallito') }
        window.location.reload(false);
    }

    return (
        <>
            <Header />
            <div className="personal">
                <form onSubmit={(e) => { e.preventDefault(); }}>
                    <h1>Nuovo ordine</h1>
                    {products.length === 0 && (
                        <div className="m-10 flex justify-center w-1/12">
                            <Loader />
                        </div>
                    )}
                    {products.length !== 0 && (
                        <>
                            <div className="grid grid-cols-5 w-1/2 m-2 gap-4">
                                {/* <span className="col-span-2 mx-auto">prodotto</span>
                                <span className="mx-auto">quantità</span>
                                <span className="mx-auto">prezzo</span> */}
                            </div>
                            {formEl.map(el => {
                                return (
                                    <FormEl {...el} products={products} deleteFormEl={deleteFormEl}
                                        changeSelProd={changeSelProd} changeSelQuantity={changeSelQuantity} key={formEl.indexOf(el)}
                                    />
                                )
                            })}
                            <button className="w-10 btn-full" onClick={addFormEl}>+</button>
                            <label htmlFor="desc" className="">descrizione</label>
                            <textarea id="desc" name="desc" rows="6" className="m-1 w-3/4 md:w-1/2 lg:w-1/3 border-2 border-primary rounded-md"
                                value={desc} onChange={e => setDesc(e.target.value)}
                            ></textarea>
                            <button className="w-1/2 mx-auto mt-8 btn-full" onClick={verifyOrder}>invia</button>
                            {modal && (<DefaultModal content={(
                                <div>
                                    <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">Vuoi confermare l'ordine?</p>
                                    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">Poi non sarà più possibile cambiarlo</p>
                                </div>
                            )} confirm={submitOrder} cancel={() => setModal(false)} />)}
                        </>
                    )}
                </form>
                {orders.length > 0 && (
                    <div className="mb-10 w-full">
                        <h2>I tuoi ordini</h2>
                        <UserOrderList  {...orders} />
                    </div>
                )}
            </div>
        </>
    )
}