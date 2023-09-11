import OrderEl from "./shared/OrderEl.js";
import Loader from "./shared/Loader.js";

export default function OrderList(props) {
    let orders = Object.values(props.order);
    let deleteOrder = props.deleteOrder;
    let markOrder = props.markOrder;

    return (
        <div className="grid grid-cols-1 md:flex md:justify-between">
            {orders.length === 0 && (
                <p className="m-5">Non ci sono ancora ordini</p>
            )}
            {orders.length !== 0 && (
                <>
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
                </>
            )}
        </div>
    )
}