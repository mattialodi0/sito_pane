import { useEffect, useState } from "react";
import Product from "./Product";
import ServerUrl from "./shared/ServerUrl";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetch(ServerUrl.url+'/product', { credentials: 'include' })
            .then(response => {
                response.json().then(products => {
                    setProducts(products);
                })
            })
    }, []);

    Array.prototype.displayProd = function (callback) {
        const resultArray = [];
        if (this.length <= 6) {
            for (let index = 0; index < this.length; index++) {
                resultArray.push(callback(this[index], index, this));
            }
        }
        else {
            let max = Math.min(6 * page + 6, this.length);
            for (let index = 6 * page; index < max; index++) {
                resultArray.push(callback(this[index], index, this));
            }
        }
        return resultArray;
    }

    function prevPage() {
        setPage(p => {
            if (p >= 1) {
                return p - 1;
            }
            else
                return p;
        })
    }

    function nextPage() {
        setPage(p => {
            if (products.length > (6 * p + 6)) {
                return p + 1;
            }
            else
                return p;
        })
    }

    return (
        <div className="h-full relative">
            {products.length === 0 && (<p className="h-[51vh]">Al momento non ci sono prodotti disponibili</p>)}
            {products.length > 0 && (<h2>I nostri prodotti</h2>)}
            <div className='flex justify-evenly items-center grow-0 shrink-0 flex-wrap'>
                {products.length > 0 && products.displayProd((p) => (
                    <Product {...p} key={products.indexOf(p)} />
                ))}
            </div>
            {products.length > 6 && (
                <div className="mb-5 mx-auto w-1/4 flex justify-between">
                    <button className="text-2xl font-bold text-primary" onClick={prevPage}>{('<')}</button>
                    <button className="text-2xl font-bold text-primary" onClick={nextPage}>{('>')}</button>
                </div>
            )}
        </div>
    )
}