const { onObjectFinalize } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Inicializar Firebase Admin
admin.initializeApp();
const storage = new Storage();

exports.resizeImage = onObjectFinalize(async (event) => {
    try {
        const filePath = event.data.name;
        const fileName = path.basename(filePath);
        const bucket = storage.bucket(event.data.bucket);

        // Verificar si el archivo ya ha sido procesado
        if (filePath.startsWith("resized/")) {
            console.log("La imagen ya está redimensionada. Saliendo...");
            return;
        }

        // Verificar si es una imagen
        if (!event.data.contentType || !event.data.contentType.startsWith("image/")) {
            console.log("No es una imagen. Saliendo...");
            return;
        }

        // Ruta temporal para procesar la imagen
        const tempFilePath = path.join(os.tmpdir(), fileName);
        const newFilePath = `resized/${fileName}`;

        console.log(`Descargando imagen: ${filePath}...`);
        await bucket.file(filePath).download({ destination: tempFilePath });

        console.log("Redimensionando imagen...");
        await sharp(tempFilePath)
            .resize(500, 500)
            .toFile(tempFilePath);

        console.log(`Subiendo imagen redimensionada a: ${newFilePath}...`);
        await bucket.upload(tempFilePath, {
            destination: newFilePath,
            metadata: { contentType: event.data.contentType },
        });

        // Eliminar la imagen temporal de manera segura
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        console.log(`Imagen redimensionada y guardada en: ${newFilePath}`);
    } catch (error) {
        console.error("Error al procesar la imagen:", error);
    }
});
