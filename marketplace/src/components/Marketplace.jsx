import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import PublishProduct from "./PublishProduct";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirigir al login si no hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetchedProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "products", productId));
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        alert("Producto eliminado con éxito.");
      } catch (error) {
        console.error("Error al eliminar el producto: ", error);
        alert("Hubo un problema al eliminar el producto.");
      }
    }
  };

  const handleViewMore = (product) => {
    alert(`Detalles del producto:\n\nNombre: ${product.name}\nPrecio: $${product.price}`);
  };

  // Filtrar productos por nombre y ubicación
  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      locationFilter ? product.location?.includes(locationFilter) : true
    )
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="marketplace-container">
      <div className="title">
      <h1>Bienvenido a ReestrenaYa</h1>
      </div>
     

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Precio: Menor a Mayor</option>
          <option value="desc">Precio: Mayor a Menor</option>
        </select>
        <input
          type="text"
          placeholder="Filtrar por ubicación"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {!isFormVisible && (
        <button className="publish-button" onClick={() => setIsFormVisible(true)}>
          Publicar Producto
        </button>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>

      {isFormVisible && (
        <PublishProduct
          setIsFormVisible={setIsFormVisible}
          setProducts={setProducts}
        />
      )}

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <div className="product-img">
                <Carousel images={product.images} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                
                {/* Mostrar botón de ubicación solo si el producto tiene coordenadas */}
                <button className="ubic">
                {product.location && (
                  <a
                    href={`https://www.google.com/maps?q=${product.location}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-button"
                  >
                    📍 Ver Ubicación
                  </a>
                )}
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
                <button
                  className="view-more-button"
                  onClick={() => handleViewMore(product)}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return <p>No hay imágenes disponibles</p>;
  }

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={handlePrev}>
        ❮
      </button>
      <img src={images[currentIndex]} alt={`Imagen ${currentIndex}`} className="carousel-image" />
      <button className="carousel-button next" onClick={handleNext}>
        ❯
      </button>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
