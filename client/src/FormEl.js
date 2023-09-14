import { useEffect, useState } from "react";
import React from "react";

export default function FormEl({ id, products, deleteFormEl, changeSelProd, changeSelQuantity }) {
    const [quantity, setQuantity] = useState(0);
    const [product, setProduct] = useState('');
    const [price, setPrice] = useState(' ');

    return (
        <div className="flex flex-col   md:grid md:grid-cols-5 md:w-1/2 m-2 gap-4">
            <div className="flex flex-col col-span-2">
                <label htmlFor={`product-${id}`}>prodotto</label>
                <select
                    id={`product-${id}`}
                    value={product}
                    onChange={e => {
                        const p = products.filter(prod => prod.name === e.target.value);
                        setPrice(p[0] ? p[0].price : 0);
                        setProduct(e.target.value);
                        changeSelProd(id, e.target.value);
                    }}
                    className="text-center"
                >
                    <option className="hover:bg-primary" disabled></option>
                    {products.map(prod => {
                        return (
                            <option className="hover:bg-primary" value={prod.name} key={products.indexOf(prod)}>{prod.name}</option>
                        )
                    })}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor={`quantity-${id}`}>quantità</label>
                <input type="number" placeholder="quantity"
                    id={`quantity-${id}`}
                    value={quantity}
                    onChange={el => {
                        if (el.target.value >= 0 && el.target.value < 100)
                            setQuantity(el.target.value);
                        changeSelQuantity(id, el.target.value);
                    }}
                    className=""
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor={`price-${id}`}>prezzo</label>
                <input type="text" disabled color="primary"
                    id={`price-${id}`}
                    value={quantity * price + '€'}
                    className=""
                />
            </div>
            <button className="w-1/2 md:w-full mx-auto btn-empty md:translate-y-2" onClick={() => deleteFormEl(id)}>delete</button>
        </div>
    )
}