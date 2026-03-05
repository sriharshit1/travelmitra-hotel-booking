export default function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="mb-10 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl">{subtitle}</p>
        </div>
    );
}
