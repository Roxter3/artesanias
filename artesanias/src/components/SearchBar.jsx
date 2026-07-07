import "../styles/products.css";

// Ícono de búsqueda como SVG directo — sin dependencias externas
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
    viewBox="0 0 24 24" fill="none" stroke="#888"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar artesanía..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <span className="search-icon">
        <IconSearch />
      </span>
    </div>
  );
}

export default SearchBar;