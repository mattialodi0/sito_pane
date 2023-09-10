import { useEffect, useState } from 'react';
import Header from '../shared/Header';
import Notification from '../Notification';
import ServerUrl from '../shared/ServerUrl';

export default function NotificationPage() {
    const [notifs, setNotifs] = useState([]);
    const [notifsType, setNotifsType] = useState('notification/new');

    useEffect(() => {
        fetch(ServerUrl.url+`/${notifsType}`, { credentials: 'include' })
            .then(response => {
                response.json().then(n => {
                    setNotifs(n);
                });
            })
    }, [notifsType])

    async function markAsRead(id) {
        const response = await fetch(ServerUrl.url+`/order/${id}/notification`, {
            method: 'PUT',
            credentials: 'include',
        });
        // const j = await response.json();
        if (response.ok) {
            window.location.reload(false);
        }
    }

    return (
        <div className='md:h-[calc(100vh-90px)] flex flex-col items-center'>
            <Header />
            <h1>Notifiche</h1>
            <select value={notifsType} onChange={e => { setNotifsType(e.target.value); }}
                className="mx-auto p-1 text-center border-2 border-primary rounded-md bg-secondary">
                <option className="hover:bg-primary" value={'notification/new'}>{'non lette'}</option>
                <option className="hover:bg-primary" value={'notification'}>{'tutte'}</option>
            </select>
            <div className="m-5">
                {notifs.length === 0 && (
                    <p>Non ci sono notifiche</p>
                )}
                {notifs.length > 0 && notifs.map(n => (
                    <Notification n={{id:n._id, title:n.title, content:n.content, date:n.date}} markAsRead={markAsRead} key={notifs.indexOf(n)} />
                ))}
            </div>
        </div>
    )
}