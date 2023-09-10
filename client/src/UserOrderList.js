import OrderEl from "./shared/OrderEl.js";
import Loader from "./shared/Loader.js";

export default function OrderList(o) {
    let orders = Object.values(o);
    return (
        <div className="mx-24 flex justify-evenly flex-wrap gap-5">
            {orders.length === 0 && (
                <div className="m-10 flex justify-center w-1/12">
                    <Loader />
                </div>
            )}
            {orders.length !== 0 && (
                <>
                    {orders.map(el => {
                        return (
                            <div className="card m-5">
                                <OrderEl {...el} key={orders.indexOf(el)} admin={false}/>
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}