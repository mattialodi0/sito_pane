import OrderEl from "./shared/OrderEl.js";
import Loader from "./shared/Loader.js";

export default function OrderList(props) {
    let orders = Object.values(props.order);
    let deleteOrder = props.deleteOrder;
    let markOrder = props.markOrder;

    return (
        <>
            {orders.length === 0 && (
                <p className="my-5 mx-auto">Non ci sono ancora ordini</p>
            )}
            {orders.length !== 0 && (
                <div className="grid grid-cols-1 md:flex md:justify-evenly md:flex-wrap">
                    {orders.map(el => {
                        return (
                            <div className="card m-5" key={`card ${orders.indexOf(el)}`}>
                                <OrderEl {...el} key={orders.indexOf(el)} admin={true} />
                                <div className="mx-auto flex justify-evenly">
                                    <button className="btn-full py-0 mb-2" onClick={ev => markOrder(ev, el._id)}>evadi</button>
                                    <button className="btn-empty mb-2" onClick={ev => deleteOrder(ev, el._id)}>cancella</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}