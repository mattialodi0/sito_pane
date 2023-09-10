import { useState, useEffect } from "react";
import Header from '../shared/Header';
import DefaultModal from '../shared/DefaultModal';
import ServerUrl from "../shared/ServerUrl";

export default function ProductDashboard() {
    const [namec, setNamec] = useState('');
    const [descc, setDescc] = useState('');
    const [pricec, setPricec] = useState('');
    const [filec, setFilec] = useState('');
    const [nameu, setNameu] = useState('');
    const [descu, setDescu] = useState('');
    const [priceu, setPriceu] = useState('');
    const [fileu, setFileu] = useState('');
    const [named, setNamed] = useState('');
    
    const [admin, setAdmin] = useState(true);
    const [prodModal, setProdModal] = useState(false);

    useEffect(() => {
        if (admin) {
            fetch(ServerUrl.url+`/profile`, { credentials: 'include' })
            .then(response => {
                if (response.status === 400) {
                    alert("Non sei un amministratore");
                    setAdmin(false);
                }
                else {
                    setAdmin(true);
                }
            })
        }
    });
    
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

    return (
        <>
            <Header />

            <h1>Cambia i prodotti</h1>
                <form onSubmit={createProduct} className="md:w-1/3 mx-auto">
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
                <form onSubmit={updateProduct} className="md:w-1/3 mx-auto">
                    <h3>Modifica prodotto</h3>
                    <div className="flex flex-col">
                        <label htmlFor="name-to-change" className="pl-2">elemento da modificare </label>
                        <input type="text" placeholder="nome" required id="name-to-change"
                            value={nameu}
                            onChange={ev => setNameu(ev.target.value)}
                        />
                        <p className="pl-2">nuovi parametri</p>
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
                <form onSubmit={() => setProdModal(true)} className="md:w-1/3 mx-auto">
                    <h3>Rimuovi prodotto</h3>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="prodotto"
                            required
                            className="mx-auto w-[303.2px]"
                            value={named}
                            onChange={ev => setNamed(ev.target.value)}
                        />
                        <button className="w-1/2 mx-auto">cancella</button>
                    </div>
                </form>

                {prodModal && (<DefaultModal content={(
                    <div>
                        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">Vuoi davvero cancellare questo prodotto?</p>
                        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">Poi non sarà più possibile ripristinarlo</p>
                    </div>
                )} confirm={deleteProduct} cancel={() => setProdModal(false)} />)}
        </>
    )
}