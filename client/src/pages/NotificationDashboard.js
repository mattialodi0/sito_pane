import { useState, useEffect } from "react";
import Header from '../shared/Header';
import ServerUrl from "../shared/ServerUrl";

export default function NotificationDashboard() {
    const [ admin, setAdmin ] = useState(true);
    const [ newNotif, setNewNotif ] = useState({title:"", content:"", dest:""});

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

        const res = await fetch(ServerUrl.url+"/notification", {
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
        </>
    )
}