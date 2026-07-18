/**
 * Script para conectar el formulario de contacto de rociobuendia.com
 * con una hoja de Google Sheets que funciona como base de datos de contactos.
 *
 * INSTRUCCIONES:
 * 1. Ve a https://sheets.google.com y crea una hoja nueva.
 *    Nómbrala, por ejemplo, "Contactos - Rocío Buendía".
 * 2. En la fila 1, escribe estos encabezados (uno por columna):
 *    Fecha | Nombre | Correo | Telefono | Mensaje
 * 3. Ve a Extensiones -> Apps Script.
 * 4. Borra el código de ejemplo que aparece y pega TODO este archivo.
 * 5. Guarda el proyecto (icono de disquete arriba).
 * 6. Haz clic en "Implementar" -> "Nueva implementación".
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quien tiene acceso: Cualquier usuario
 * 7. Autoriza los permisos cuando te lo pida (confirmas que confías en tu propio script).
 * 8. Copia la URL que termina en "/exec" y pásasela a Claude para conectarla al formulario.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.Nombre || '',
    data.Correo || '',
    data.Telefono || '',
    data.Mensaje || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
