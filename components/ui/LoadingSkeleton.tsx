export function HotelSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col h-full">
            <div className="h-56 w-full bg-gray-200"></div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
                <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
