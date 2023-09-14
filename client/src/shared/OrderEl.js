import { formatISO9075 } from 'date-fns';

export default function OrderEl({ username, productNames, quantities, prices, desc, date, _id, admin = false}) {
    function total(prices) {
        let sum = 0;
        for (let i = 0; i < prices.length; i++) {
            sum += prices[i];
        }
        return sum;
    }

    return (
        <div className="w-full">
            <h4 className="font-semibold text-lg text-primary">ordine n. {_id}:</h4>
            {admin === true && (
                <p>cliente: {username}</p>
            )}
            <p>data: {formatISO9075(new Date(date))}</p>
            {!(admin === true) && (
                <>
                    <p> prodotti: {productNames.map(p => {
                        return (`${p}: ${quantities[productNames.indexOf(p)]} `)
                    })}
                    </p>
                    <p>totale: {total(prices)}€</p>
                </>
            )}
            {admin === true && (
                <>
                    <p>prodotti: {productNames?.toString()}</p>
                    <p>quantità: {quantities?.toString()}</p>
                    <p>prezzi: {prices?.toString()}</p>
                </>
            )}
            {desc !== "" && (
                <p>richieste: "{desc}"</p>
            )}
        </div>
    )
}