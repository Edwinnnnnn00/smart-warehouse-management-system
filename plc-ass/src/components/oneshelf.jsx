export default function OneShelf({ name, status }) {
    return (
        <div className="border-8 border-teal-400 p-4 bg-teal-200 m-8">
            <h2 className="font-semibold mb-2 text-3xl ">{name}</h2>
            <div className="grid grid-cols-5 ">
                {status.map((item, index) => (
                    <div className="border-2 border-gray-700 p- w-full ">
                        <div
                        key={index}
                        className={`flex h-20 justify-center ${ !item ? 'bg-green-500' : 'bg-red-500'}`}
                        ></div>
                    </div>
                ))}
            </div>
        </div>        
    )
}