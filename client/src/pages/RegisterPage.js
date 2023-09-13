import { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import ServerUrl from "../shared/ServerUrl";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();

    if (!verifyCredentials()) {
      return;
    }

    const response = await fetch(ServerUrl.url + '/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      const res = await fetch(ServerUrl.url + '/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (res.status === 200) {
        res.json().then(o => {
          const { info, jwt } = o;
          localStorage.setItem('jwt', jwt);
          setUserInfo(info);
        });
        alert('registration successful');
      }
      setRedirect(true);
    } else {
      alert('registration failed');
    }
  }

  function verifyCredentials() {
    if (username.length < 4)
      alert('Il nome utente deve essere lungo al minimo 6 caratteri');
    else if (password.length < 6)
      alert('La password deve essere lunga al minimo 6 caratteri');
    else if (username.length > 20)
      alert('Il nome utente può essere lungo al massimo 20 caratteri');
    else if (password.length < 6)
      alert('La password può essere lunga al massimo 20 caratteri');
    else 
      return true;
    return false;
  }

  if (redirect) {
    return (
      <Navigate to={'/'} />
    )
  }
  else return (
    <>
      <Link to={'/'} className="btn-back"><button>back</button></Link>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input className="mt-2" type="text"
          placeholder="username"
          value={username}
          onChange={ev => setUsername(ev.target.value)} />
        <input className="mt-2" type="password"
          placeholder="password"
          value={password}
          onChange={ev => setPassword(ev.target.value)} />
        <button>Register</button>
      </form>
    </>
  );
}
