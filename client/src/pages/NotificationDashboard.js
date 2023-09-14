import { useState, useEffect } from "react";
import Header from '../shared/Header';
import DefaultModal from '../shared/DefaultModal';
import ServerUrl from "../shared/ServerUrl";

export default function NotificationDashboard() {
    const [ admin, setAdmin ] = useState(true);
    const [ newNotif, setNewNotif ] = useState({title:"", content:"", dest:""});
    const [ deleteTitle, setDeleteTitle ] = useState('');

    useEffect(() => {
        if (admin) {
            const jwt = localStorage.getItem('jwt')
            fetch(ServerUrl.url+`/${jwt}/profile`, { credentials: 'include' })
                .then(response => {
                    if (response.status === 403) {
                        alert("Non sei un amministratore");
                        setAdmin(false);
                    }
                    else {
                        setAdmin(true);
                    }
                })
        }
    });

    async function createNotification(ev) {
        ev.preventDefault();

        if(!verifyData()) return;

        // { title: newNotif.title, content:newNotif.content, dest:newNotif.dest }
        const data = new FormData();
        data.set('title', newNotif.title);
        data.set('content', newNotif.content);
        if(newNotif.dest === "")
            data.set('dest', 'all');
        else
            data.set('dest', newNotif.dest);
        
        const jwt = localStorage.getItem('jwt')
        const res = await fetch(ServerUrl.url+'/'+jwt+"/notification", {
            method: 'POST',
            body: data,
            credentials: 'include'
        });
        if (res.ok) {
            alert("notifica creata con successo");
            setNewNotif({title:"", content:"", dest:""});
        }
        else if(res.status === 411)
            alert("il destinatario non è un utente valido");
    }

    function verifyData() {
        let v = true;

        if(newNotif.title.length > 30) {
            alert('titolo troppo lungo');
            v = false
        }
        if(newNotif.content.length > 200) {
            alert('contenuto troppo lungo');
            v = false
        }
        if(newNotif.dest.length > 20) {
            alert('titolo troppo lungo');
            v = false
        }

        // console.log(newNotif.dest);
        // if(newNotif.dest == "") {
        //     setNewNotif({title: newNotif.title, content: newNotif.content, dest: 'all'});
        // }
        // console.log(newNotif.dest);

        return v;
    }

    async function deleteNotif() {
        const jwt = localStorage.getItem('jwt')
        const response = await fetch(ServerUrl.url + `/${jwt}/notification/${deleteTitle}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const j = await response.json();
        if (response.ok) {
            alert("notifica eliminata con successo");
            setDeleteTitle('');
        }
    }

    return (
        <>
            <Header />
            <form onSubmit={createNotification}>
                <h3>Invia una notifica</h3>
                <div className="flex flex-col md:w-1/3 mx-auto px-2">
                    <input type="text" placeholder="titolo" required
                        value={newNotif.title}
                        onChange={ev => setNewNotif({title: ev.target.value, content: newNotif.content, dest: newNotif.dest})}
                    />
                    <input type="text" placeholder="messaggio" required
                        value={newNotif.content}
                        onChange={ev => setNewNotif({title: newNotif.title, content: ev.target.value, dest: newNotif.dest})}
                    />
                    <input type="text" placeholder="(destinatario)"
                        value={newNotif.dest}
                        onChange={ev => setNewNotif({title: newNotif.title, content: newNotif.content, dest: ev.target.value})}
                    />

                    <button className="w-1/2 m-auto">invia</button>
                </div>
            </form>
            <form onSubmit={ev => {ev.preventDefault(); deleteNotif();}} className="md:w-1/3 mx-auto">
                <h3>Rimuovi una notifica</h3>
                <div className="flex flex-col">
                    <input
                            type="text"
                            placeholder="titolo"
                            className="mx-auto w-[303.2px]"
                            value={deleteTitle}
                            onChange={ev => {setDeleteTitle(ev.target.value); }}
                        />
                    <button className="w-1/2 mx-auto">cancella</button> 
                </div>
            </form>
        </>
    )
}