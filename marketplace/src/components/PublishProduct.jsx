import React, { useState } from "react";
import { db, storage } from "../firebase"; // Firebase configurado (Firestore y Storage)
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./PublishProduct.css";

const PublishProduct = ({ setIsFormVisible, setProducts }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [uploading, setUploading] = useState(false); // Para mostrar estado de carga

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Esperar a que todas las imágenes se suban y obtener sus URLs
      setUploading(true);
      const uploadedImages = await Promise.all(
        productImages.map(async (image) => {
          const imageRef = ref(storage, `products/${image.name}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      // Agregar el producto a Firebase Firestore
      const docRef = await addDoc(collection(db, "products"), {
        name: productName,
        price: productPrice,
        images: uploadedImages,
      });

      // Actualizar la lista de productos en el Marketplace
      setProducts((prevProducts) => [
        ...prevProducts,
        { id: docRef.id, name: productName, price: productPrice, images: uploadedImages },
      ]);

      // Resetear el formulario y cerrar
      setUploading(false);
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error al publicar producto: ", error);
      setUploading(false);
    }
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e) => {
    setProductImages(Array.from(e.target.files)); // Guardar archivos seleccionados
  };

  return (
    <div className="conta">
      <h2 className="titel">Publicar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input className="txt"
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
