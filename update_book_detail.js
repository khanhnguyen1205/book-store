const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/book/BookDetail.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
content = content.replace(
  'import React from "react";',
  'import React, { useState, useEffect } from "react";\nimport { useParams } from "react-router-dom";\nimport { bookService } from "./bookService";'
);

// 2. Add state and data fetching
const newHookLogic = `export default function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const data = await bookService.getBookById(id);
                setBook(data);
                setError(null);
            } catch (err) {
                setError("Failed to load book data.");
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading) {
        return (
            <div className="bd-wrap">
                <style>{styles}</style>
                <div style={{ padding: "5rem", textAlign: "center", color: "#666" }}>Loading book details...</div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="bd-wrap">
                <style>{styles}</style>
                <div style={{ padding: "5rem", textAlign: "center", color: "#e24b4a" }}>{error || "Book not found."}</div>
            </div>
        );
    }

    const displayPrice = typeof book.price === 'number' ? \`$\${(book.price / 1000).toFixed(2)}\` : book.price;

    return (`;

content = content.replace('export default function BookDetail() {\n    return (', newHookLogic);

// 3. Replace dynamic fields in JSX
content = content.replace(
  '<div className="bd-book-placeholder">',
  '{book.image ? (\n                    <div className="bd-book-img">\n                        <img src={book.image} alt={book.title} style={{ width: "100%", display: "block" }} />\n                    </div>\n                ) : (\n                    <div className="bd-book-placeholder">'
);
content = content.replace(
  /                        <\/svg>\n                    <\/div>/g,
  '                        </svg>\n                    </div>\n                )}'
);

// Wait, replacing the SVG placeholder block accurately:
const svgPlaceholderStart = `<div className="bd-book-placeholder">`;
const svgPlaceholderEnd = `</svg>\n                    </div>`;

const [beforeSvg, ...rest] = content.split(svgPlaceholderStart);
if (rest.length > 0) {
  const restStr = rest.join(svgPlaceholderStart);
  const [svgContent, ...afterSvgArr] = restStr.split(svgPlaceholderEnd);
  const afterSvg = afterSvgArr.join(svgPlaceholderEnd);
  
  content = beforeSvg + 
    `{book.image ? (
                    <div className="bd-book-img">
                        <img src={book.image} alt={book.title} />
                    </div>
                ) : (
                    <div className="bd-book-placeholder">` + 
    svgContent + 
    `</svg>
                    </div>
                )}` + afterSvg;
}

// category
content = content.replace('<div className="bd-eyebrow">Contemporary Fiction</div>', '<div className="bd-eyebrow">{book.category || "General"}</div>');

// title
content = content.replace('<h1 className="bd-title">The Shadow of<br />Memory</h1>', '<h1 className="bd-title">{book.title}</h1>');

// author
content = content.replace('<p className="bd-author">by Elena V. Moretti</p>', '<p className="bd-author">by {book.author}</p>');

// price
content = content.replace('<span className="bd-price">$28.50</span>', '<span className="bd-price">{displayPrice}</span>');
content = content.replace('<span className="bd-price-original">$34.00</span>\n                        <span className="bd-discount">15% OFF</span>', '');

// sold
content = content.replace('1.2k+ Sold', '{book.sold || 0} Sold');

// stock dot
content = content.replace('<span className="bd-dot"></span>', '<span className="bd-dot" style={{ background: book.stock > 0 ? "#22cc77" : "#e24b4a" }}></span>');
content = content.replace('In Stock\n                            </div>', '{book.stock > 0 ? `${book.stock} In Stock` : "Out of Stock"}\n                            </div>');

// age
content = content.replace('Age 16+', 'Age {book.age || 0}+');

// description
content = content.replace(
  '<p>\n                        In the winding canals of a future Venice, architecture has become the vessel for collective memory. When a young cartographer discovers a void in the city\'s blueprints, she unravels a secret that threatens to dissolve the very history she was born to protect.\n                    </p>\n                    <p>\n                        Elena V. Moretti weaves a tapestry of suspense and lyrical beauty, exploring the fragile boundaries between what we remember and what truly exists. A masterpiece of atmospheric storytelling that lingers long after the final page is turned.\n                    </p>',
  '<p>{book.description}</p>'
);

fs.writeFileSync(filePath, content);
console.log('BookDetail updated successfully!');
