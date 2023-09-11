export default function Notification({n, markAsRead, btnOn}) {
    const { id, title, content, data } = n;

    return (
        <div className="card m-4 flex flex-col items-center">
            <div className='flex flex-col items-center '>
                <h3>{title}</h3>
                <p className="text-sm text-gray-700">{data}</p>
                <p>{content}</p>
            </div>
            {btnOn && (
                <button className="btn-empty" onClick={() => markAsRead(id)}>segna come già letto</button>
            )}
        </div>
    )
}