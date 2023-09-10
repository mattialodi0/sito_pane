export default function Notification({n, markAsRead}) {
    const { id, title, content, data } = n;
    return (
        <div className="card flex flex-col items-center">
            <div className='flex flex-col items-center '>
                <h3>{title}</h3>
                <p className="text-sm text-gray-700">{data}</p>
                <p>{content}</p>
            </div>
            <button className="btn-empty" onClick={() => markAsRead(id)}>segna come già letto</button>
        </div>
    )
}