import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import ServerUrl from "../shared/ServerUrl";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(ServerUrl.url+'/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('registration successful');
      setRedirect(true);
    } else {
      alert('registration failed');
    }
  }

  if (redirect) {
    return (
      <Navigate to={'/'} />
    )
  }
  return (
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
