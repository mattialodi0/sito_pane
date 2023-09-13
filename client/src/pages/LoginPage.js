import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import ServerUrl from "../shared/ServerUrl";

export default function IndexPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault(); 
        const res = await fetch(ServerUrl.url+'/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (res.status === 200) {
            res.json().then(o => {
                const {info, jwt} = o;
                localStorage.setItem('jwt',jwt);
                setUserInfo(info);
                setRedirect(true);
            });
        }
        else { alert('login failed') }
    }

    if (redirect) {
        return (
            <Navigate to={'/'} />
        )
    }
    return (
        <>
            <Link to={'/'} className="btn-back"><button>back</button></Link>
            <form className="login" onSubmit={login}>
                <h1>Login</h1>
                <input className="mt-2" type="text" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} />
                <input className="mt-2" type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} />
                <button>Login</button>
            </form>
        </>
    )
}