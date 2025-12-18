export default function PageContainer({ title, subtitle, children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-xl text-gray-300">{subtitle}</p>}
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
}
