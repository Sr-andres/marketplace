import React, { useState } from "react";
import { db, storage } from "../firebase"; // Importar configuración de Firebase
import { collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore"; // Importar serverTimestamp
import "./PublishProduct.css";

const PublishProduct = ({ setIsFormVisible, setProducts }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [productLocation, setProductLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  // Función para obtener la ubicación del usuario
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProductLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error obteniendo ubicación: ", error);
          alert("No se pudo obtener la ubicación.");
        }
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Subir imágenes a Firebase Storage y obtener URLs
      setUploading(true);
      const uploadedImages = await Promise.all(
        productImages.map(async (image) => {
          const imageRef = ref(storage, `products/${image.name}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      // Guardar producto en Firestore con timestamp
      const docRef = await addDoc(collection(db, "products"), {
        name: productName,
        price: productPrice,
        images: uploadedImages,
        location: productLocation,
        timestamp: serverTimestamp(), // Agregar fecha de publicación
      });

      // Actualizar lista de productos en la interfaz
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          id: docRef.id,
          name: productName,
          price: productPrice,
          images: uploadedImages,
          location: productLocation,
          timestamp: new Date(), // Mostrar la fecha en la UI
        },
      ]);

      // Resetear formulario y cerrar
      setUploading(false);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error al publicar producto: ", error);
      setUploading(false);
    }
  };

  // Manejar la selección de archivos
  const handleFileChange = (e) => {
    setProductImages(Array.from(e.target.files));
  };

  // Función para obtener productos ordenados por fecha de publicación
  const fetchProductsByRecent = async () => {
    const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <div className="conta">
      <h2 className="titel">Publicar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="txt"
          type="text"
          placeholder="Nombre del producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={productLocation}
          readOnly
          onClick={getLocation} // Llamar función cuando el usuario toque la casilla
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Subiendo..." : "Publicar"}
        </button>
      </form>
      <button onClick={() => setIsFormVisible(false)}>Cancelar</button>
    </div>
  );
};

export default PublishProduct;
