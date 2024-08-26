export default function PageTitle({ title }) {
    return (
        <div className="m-4">
            <h1 className="border-4 border-black p-2 bg-red-400 inline text-3xl font-bold">{title}</h1>
        </div>
    )
}