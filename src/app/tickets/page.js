export default function Tickets() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Contenido principal */}
            <main className="flex-1 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
                <h2 className="text-lg font-semibold mb-3">Tickets</h2>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p>Contenido de Tickets</p>
                </div>
            </main>
        </div>
    );
}