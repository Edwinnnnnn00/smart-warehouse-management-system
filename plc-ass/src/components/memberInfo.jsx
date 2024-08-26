

export default function MemberInfo( {name, matric, pic} ) {
    return (
        <div className="flex border-8 border-teal-400 p-4 bg-teal-200 justify-center grid grid-rows-10 items-center">
            <img src={pic} alt={name} className="block row-span-8"
            style={{ width: '200px', aspectRatio: '9/12'}}
            />
            <h2 className="font-semibold mb-2 text-2xl ">{name}</h2>
            <p className="text-2xl">{matric}</p>
        </div>        
    )
}