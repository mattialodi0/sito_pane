import { formatISO9075 } from 'date-fns';

export default function OrderEl({ username, productNames, quantities, prices, desc, date, _id,}, admin=false) {
    return (
        <div className="w-full">
            <h4 className="font-semibold text-lg text-primary">ordine n. {_id}:</h4>
            {admin && (
                <p>cliente: {username}</p>
            )}
            <p>data: {formatISO9075(new Date(date))}</p>
            <p>prodotti: {productNames?.toString()}</p>
            <p>quantità: {quantities?.toString()}</p>
            {admin && (
                <p>prezzi: {prices?.toString()}</p>
            )}
            {desc !== "" && (
                <p>richieste: "{desc}"</p>
            )}
        </div>
    )
}