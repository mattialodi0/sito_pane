import { useEffect, useState } from "react"
import ServerUrl from "./shared/ServerUrl"

export default function Product({name, imgSrc, imgUrl, desc}) {
    const [img, setImg] = useState('');
    useEffect(() => {
        setImg(imgUrl?imgUrl:ServerUrl.url+'/'+imgSrc);
    })

    return (
        <div className="product md:card m-2 p-2 flex flex-col md:grid md:grid-cols-2 w-3/4 md:w-1/3 md:min-w-fit">
            <img src={img} alt={'immagine di '+name} className="w-36 mx-auto md:m-0 row-span-2 rounded-md"/>
            <h3 className="mx-auto md:m-0 text-center overflow-hidden">{name}</h3>
            <p className="mx-auto md:ml-3 text-center overflow-hidden">{desc}</p>
        </div>
    )
}