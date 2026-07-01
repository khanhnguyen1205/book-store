import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from './bookService';
import BookCard from '../../components/BookCard';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Sidebar from '../../components/Sidebar';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import './BookList.css';

const categoriesList = [
  { label: "All" },
  { label: "Programming" },
  { label: "Self-help" },
  { label: "Novel" },
];

const LIMIT = 6;

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [maxPrice, setMaxPrice] = useState(60);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          _page: page,
          _limit: LIMIT,
        };
        
        if (debouncedSearch) {
          params.q = debouncedSearch;
        }
        
        if (category !== 'All') {
          params.category = category;
        }
        
        params.price_lte = maxPrice * 1000;

        if (sort === 'price_asc') {
          params._sort = 'price';
          params._order = 'asc';
        } else if (sort === 'price_desc') {
          params._sort = 'price';
          params._order = 'desc';
        }
        
        const res = await bookService.getBooks(params);
        setBooks(res.data);
        setTotalCount(res.totalCount);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [debouncedSearch, category, sort, maxPrice, page]);

  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handleCategoryChange = (catLabel) => {
    setCategory(catLabel);
    setPage(1);
  };

  const handlePriceChange = (value) => {
    setMaxPrice(value);
    setPage(1);
  };

  return (
    <div className="lg-wrap">
      <Navbar search={search} onSearchChange={setSearch} />

      <Hero />

      {/* Main layout */}
      <div className="lg-main">
        <Sidebar
          categories={categoriesList}
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
        />

        {/* Book grid */}
        <div className="lg-content">
          <div className="lg-content-header">
            <h2 className="lg-section-title">Featured <em>New Arrivals</em></h2>
            <div className="lg-sort">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="lg-state">Loading books...</div>
          ) : error ? (
            <div className="lg-state error">{error}</div>
          ) : books.length === 0 ? (
            <div className="lg-state">No books found for your search.</div>
          ) : (
            <div className="lg-grid">
              {books.map((book) => (
                <div key={book.id} className="lg-grid-item" onClick={() => navigate(`/book/${book.id}`)}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && (
            <Pagination 
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}