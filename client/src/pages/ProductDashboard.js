import { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import Header from '../shared/Header';
import DefaultModal from '../shared/DefaultModal';
import ServerUrl from "../shared/ServerUrl";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function ProductDashboard() {
    const [namec, setNamec] = useState('');
    const [descc, setDescc] = useState('');
    const [pricec, setPricec] = useState('');
    const [filec, setFilec] = useState('');
    const [urlc, setUrlc] = useState('');
    const [nameu, setNameu] = useState('');
    const [descu, setDescu] = useState('');
    const [priceu, setPriceu] = useState('');
    const [fileu, setFileu] = useState('');
    const [urlu, setUrlu] = useState('');
    const [named, setNamed] = useState('');

    const [admin, setAdmin] = useState(true);
    const [prodModal, setProdModal] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (admin) {
            const jwt = localStorage.getItem('jwt')
            fetch(ServerUrl.url + `/${jwt}/profile`, { credentials: 'include' })
                .then(response => {
                    if (response.status === 400) {
                        alert("Non sei un amministratore");
                        setAdmin(false);
                    }
                    else {
                        setAdmin(true);
                    }
                })
            const f = async () => {
                const res = await fetch(ServerUrl.url + `/product`, { credentials: 'include' })
                if (res.ok) {
                    const p = await res.json();
                    setProducts(p);
                }
            }
            f();
        }
    }, []);

    async function createProduct(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('name', namec);
        data.set('desc', descc);
        data.set('price', Number(pricec));
        data.set('file', filec[0]);
        data.set('url', urlc);
        data.set('hidden', false);

        const jwt = localStorage.getItem('jwt')
        const res = await fetch(ServerUrl.url + `/${jwt}/product`, {
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
            setUrlc('');
        }
        else
            alert('non è stato possibile modificare il prodotto')
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
        if (urlu) {
            data.set('url', urlu);
        }

        const jwt = localStorage.getItem('jwt')
        const response = await fetch(ServerUrl.url + `/${jwt}/product`, {
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
            setUrlu('');
        }
        else
            alert('non è stato possibile modificare il prodotto')
    }

    async function deleteProduct() {
        console.log(named)
        const jwt = localStorage.getItem('jwt')
        const response = await fetch(ServerUrl.url + `/${jwt}/product/${named}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const j = await response.json();
        if (response.ok && j.deletedCount === 1) {
            alert("prodotto eliminato con successo");
            setNamed('');
        }
        else {
            alert(`il prodotto ${named} non esiste`);
        }
        setProdModal(false);
        window.location.reload(false);
    }

    const formatResult = (item) => {
        return (
            <>
                {/* <span style={{ display: 'block', textAlign: 'left' }}>{item._id}</span> */}
                <span style={{ display: 'block', textAlign: 'left' }} key={item._id}>{item.name}</span>
            </>
        )
    }

    if (!admin)
        return (<Navigate to="/" />)
    else
        return (
            <>
                <Header />

                <h1>Cambia i prodotti</h1>
                <form onSubmit={createProduct} className="md:w-1/3 mx-auto">
                    <h3>Aggiungi un prodotto</h3>
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
                        <input type="file" placeholder="immagine" className="bg-white"
                            onChange={ev => setFilec(ev.target.files)}
                        />
                        <input type="text" placeholder="url" className=""
                            value={urlc}
                            onChange={ev => setUrlc(ev.target.value)}
                        />
                        <button className="w-1/2 m-auto">aggiungi</button>
                    </div>
                </form>
                <form onSubmit={updateProduct} className="md:w-1/3 mx-auto">
                    <h3>Modifica un prodotto</h3>
                    <div className="flex flex-col">
                        <label htmlFor="name-to-change">elemento da modificare </label>
                        <input type="text" placeholder="nome" required id="name-to-change"
                            value={nameu}
                            onChange={ev => setNameu(ev.target.value)}
                        />
                        <p className="ml-3 md:ml-1">nuovi parametri</p>
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
                        <input type="text" placeholder="url" className=""
                            value={urlu}
                            onChange={ev => setUrlu(ev.target.value)}
                        />
                        <button className="w-1/2 m-auto">modifica</button>
                    </div>
                </form>
                <form onSubmit={ev => { ev.preventDefault(); setProdModal(true) }} className="md:w-1/3 mx-auto">
                    <h3>Rimuovi un prodotto</h3>
                    <div className="flex flex-col w-full">
                        {/* <input
                            type="text"
                            placeholder="prodotto"
                            className="mx-auto w-[303.2px]"
                            value={named}
                            onChange={ev => {setNamed(ev.target.value); }}
                        /> */}
                        <ReactSearchAutocomplete
                            items={products}
                            onSelect={item => { setNamed(item.name) }}
                            formatResult={formatResult}
                            // className="bg-secondary w-2/3 mx-auto border border-primary rounded-md"
                            className="w-[94%] md:w-full mx-3 md:mx-auto"
                            styling={{
                                backgroundColor: "#fffacd",
                                height: "34px",
                                margin: "auto 0",
                                border: "solid 1px #8b4513",
                                borderRadius: "0.375rem",
                                placeholderColor: "ligth-grey",
                                focusBackroundColor: "#fffacd",
                            }}
                            placeholder="nome"
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