import ServerUrl from "./shared/ServerUrl"

export default function Product({name, imgSrc, desc}) {
    return (
        <div className="product md:card m-2 p-2 flex flex-col md:grid md:grid-cols-2 w-3/4 md:w-1/3 md:min-w-fit">
            <img src={ServerUrl.url+'/'+imgSrc} alt={'immagine di '+name} className="w-36 mx-auto md:m-0 row-span-2 rounded-md"/>
            <h3 className="mx-auto md:m-0 text-center overflow-hidden">{name}</h3>
            <p className="mx-auto md:ml-3 text-center overflow-hidden">{desc}</p>
        </div>
    )
}