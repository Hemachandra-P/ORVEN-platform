export default function StatCard({
    title,
    value,
    icon,
    color,
}) {

    return (

        <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-slate-500">
                        {title}
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        {value}
                    </h1>

                </div>

                <div
                    className={`h-14 w-14 rounded-xl ${color} flex items-center justify-center`}
                >

                    {icon}

                </div>

            </div>

        </div>

    );

}