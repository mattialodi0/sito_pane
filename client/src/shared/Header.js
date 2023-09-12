import { useContext, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import ServerUrl from "./ServerUrl";

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [selectState, setSelectState] = useState('dashboard');
    const [navOrder, setNavOrder] = useState(false);
    const [navProduct, setNavProduct] = useState(false);
    const [navNotification, setNavNotification] = useState(false);
    const [newNotifs, setNewNotifs] = useState([]);

    useEffect(() => {
        fetch(ServerUrl.url + '/profile', {
            credentials: 'include',
            method: 'GET'
        }).then(
            response => {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                });
            }
        );
        if (userInfo.username) {
            fetch(ServerUrl.url + '/notification/new', {
                credentials: 'include',
                method: 'GET'
            }).then(
                response => {
                    response.json().then(n => {
                        setNewNotifs(n);
                    });
                }
            );
        }
    }, []);     //userInfo.username

    function logout() {
        setUserInfo(null);
        fetch(ServerUrl.url + '/logout', {
            method: 'POST',
            credentials: 'include'
        })
    }

    function gotoDashboard(value) {
        if (value === 'orders') {
            setSelectState('orders');
            setNavOrder(true);
        }
        else if (value === 'products') {
            setSelectState('products');
            setNavProduct(true);
        }
        else if (value === 'notifications') {
            setSelectState('notifications');
            setNavNotification(true);
        }
    }

    const username = userInfo?.username;
    const admin = userInfo?.admin;

    return (
        <>
            {navOrder && (<Navigate to={'/dashboard/orders'} />)}
            {navProduct && (<Navigate to={'/dashboard/products'} />)}
            {navNotification && (<Navigate to={'/dashboard/notifications'} />)}
            <header>
                <div>
                    <Link to="/" className="logo my-2 md:m-0">Home</Link>
                    {username && (
                        <div className="md:inline">
                            <span className="relative">
                                <Link to="/notifications" className={`notifications ${admin ? "font-normal" : "font-semibold"}`}>notifiche</Link>
                                {newNotifs.length > 0 && (
                                    <span className="absolute -top-1 -right-1">
                                        <span className="relative inline-flex h-3 w-3 ">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                        </span>
                                    </span>
                                )}
                            </span>
                            <Link to="/personal" className={`orders ${admin ? "font-normal" : "font-semibold"}`}>ordini</Link>
                            {admin && (
                                <select className="mx-auto p-1 text-center text-primary font-semibold rounded-md bg-secondary"
                                    onChange={e => gotoDashboard(e.target.value)} value={selectState}>
                                    <option className="text-primary" value="dashboard">Dashboard</option>
                                    <option className="text-primary" value="orders">ordini</option>
                                    <option className="text-primary" value="products">prodotti</option>
                                    <option className="text-primary" value="notifications">notifiche</option>
                                </select>
                            )}
                        </div>
                    )}
                </div>
                <nav>
                    {username && (
                        <>
                            <a href='/' onClick={logout} className="btn-logout">Logout</a>
                            {/* <Link to="/" onClick={logout} className="btn-logout">Logout</Link> */}
                        </>
                    )}
                    {!username && (
                        <>
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/register" className="btn-register">Register</Link>
                        </>
                    )}
                </nav>
                <p>{ServerUrl.url}</p>
            </header>
        </>
    )
}