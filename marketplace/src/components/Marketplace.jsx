import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import PublishProduct from "./PublishProduct";
import { useNavigate } from "react-router-dom";
import "./Marketplace.css";
import Map from "./Map";
import Grid from "@mui/material/Grid2";
import { Box, Container, Skeleton } from "@mui/material";


const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState([7.0597681, -73.8720947]);

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
    // .filter((product) =>
    //   locationFilter ? product.location?.includes(locationFilter) : true
    // )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else if (sortOrder === "desc") {
        return b.price - a.price;
      } else if (sortOrder === "recent") {
        return new Date(b.timestamp) - new Date(a.timestamp); // Ordenar por fecha de creación
      }
      return 0;
    });
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      <div className="title">
        <h1>Bienvenido a ReestrenaYa</h1>
      </div>


      <div className="filters">
        <input className="oo"
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="oo" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Precio: Menor a Mayor</option>
          <option value="desc">Precio: Mayor a Menor</option>
          <option value="recent">Más reciente</option>
        </select>
        <input className="oo"
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
      <button className="mi-ubic" >
        mi ubicación
      </button>

      {isFormVisible && (
        <PublishProduct
          setIsFormVisible={setIsFormVisible}
          setProducts={setProducts}
        />
      )}

      <Box sx={{ display: "flex", height: "calc(100vh - 100px)" }}> {/* Ajusta 100px si tu header ocupa otro alto */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          <Grid container spacing={2}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box className="product-card" >
                  <div className="product-img">
                    <Carousel images={product.images} />
                  </div>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  {product.location && (
                    <button className="ubic">
                      <a
                        onClick={() => {
                          const location = [product.location[0], product.location[1]];
                          setCurrentLocation(location);
                        }}
                      >
                        📍 Ver Ubicación
                      </a>
                    </button>
                  )}
                  <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                  <button onClick={() => handleViewMore(product)}>Ver más</button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mapa fijo */}
        <Box
          sx={{
            width: "400px", // Tamaño fijo del mapa
            minWidth: "400px",
            height: "100%",
            position: "sticky",
            top: 0,
            borderLeft: "1px solid #ccc",
          }}
        >
          <Map currentLocation={currentLocation} />
        </Box>
      </Box>

    </Box>
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
