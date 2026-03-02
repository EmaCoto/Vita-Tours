import { useState } from 'react';

export default function ToursGrid({ initialTours }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');

  const tags = ['Todos', ...new Set(initialTours.map(t => t.data.tag))];

  const filteredTours = initialTours.filter(tour => {
    const matchesSearch = tour.data.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filter === 'Todos' || tour.data.tag === filter;
    return matchesSearch && matchesTag;
  });

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Buscador y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Buscar tu próximo camino..."
            className="w-full px-6 py-3 rounded-lg border border-gray-500 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#38F5C4] transition-all text-gray-700"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                filter === tag 
                ? 'bg-[#38F5C4] text-black shadow-lg shadow-[#38F5C4]/20' 
                : 'bg-gray-100 border-gray-500 border text-gray-500 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map(tour => (
          <a 
            href={`/tours/${tour.slug}`} 
            key={tour.slug}
            className="group block bg-white rounded-lg overflow-hidden border border-gray-500 shadow-lg transition-all duration-500"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={tour.data.imagen} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={tour.data.nombre}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-800">{tour.data.tag}</span>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#38F5C4] transition-colors">
                {tour.data.nombre}
              </h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-light italic">
                "{tour.data.titulo}"
              </p>
              
              <div className="flex flex-wrap gap-y-3 border-t border-gray-50 pt-6">
                <div className="w-1/2 text-[11px] text-gray-400 uppercase tracking-widest">
                  <span className="block font-bold text-gray-900">{tour.data.fechaSalida}</span> Fecha
                </div>
                <div className="w-1/2 text-[11px] text-gray-400 uppercase tracking-widest">
                  <span className="block font-bold text-gray-900">{tour.data.duracion}</span> Duración
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}