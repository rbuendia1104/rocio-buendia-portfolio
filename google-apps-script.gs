/**
 * Script para conectar el formulario de contacto de rociobuendia.com
 * con una hoja de Google Sheets que funciona como base de datos PRIVADA
 * de contactos. Cada vez que llega un contacto nuevo:
 *   1. Se agrega como una fila nueva en la hoja (queda guardado para siempre).
 *   2. Se envia un correo a quimirocio@hotmail.com con la lista COMPLETA
 *      y actualizada de todos los contactos registrados hasta el momento.
 *
 * La hoja nunca se enlaza ni se muestra en el sitio web: solo tu cuenta
 * de Google tiene acceso a ella. El sitio unicamente puede "agregar" un
 * contacto a traves de este script; no existe ninguna forma de leer o
 * listar los datos desde el sitio.
 *
 * INSTRUCCIONES:
 * 1. Ve a https://sheets.google.com y crea una hoja nueva.
 *    Nombrala, por ejemplo, "Contactos - Rocio Buendia (privado)".
 * 2. En la fila 1, escribe estos encabezados (uno por columna):
 *    Fecha | Nombre | Correo | Telefono | Mensaje
 * 3. Ve a Extensiones -> Apps Script.
 * 4. Borra el codigo de ejemplo que aparece y pega TODO este archivo.
 * 5. Guarda el proyecto (icono de disquete arriba).
 * 6. Haz clic en "Implementar" -> "Nueva implementacion".
 *    - Tipo: "Aplicacion web"
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quien tiene acceso: Cualquier usuario
 * 7. Autoriza los permisos cuando te lo pida (confirmas que confias en tu propio script).
 *    La primera vez Google mostrara una advertencia de "app no verificada" porque
 *    es un script personal tuyo, no publicado -> Avanzado -> Ir a (tu proyecto), sin peligro.
 * 8. Copia la URL que termina en "/exec" y pasasela a Claude para conectarla al formulario.
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  var timestamp = new Date();
  sheet.appendRow([
    timestamp,
    data.Nombre || '',
    data.Correo || '',
    data.Telefono || '',
    data.Mensaje || ''
  ]);

  sendUpdatedDatabase_(sheet);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendUpdatedDatabase_(sheet) {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var rows = values.slice(1);
  var tz = Session.getScriptTimeZone();

  var html = '<p>Se registro un nuevo contacto en rociobuendia.com. ' +
    'Esta es tu base de datos privada de contactos, actualizada:</p>';
  html += '<table border="1" cellpadding="8" cellspacing="0" ' +
    'style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">';
  html += '<tr style="background:#0f2a4a;color:#ffffff;">';
  headers.forEach(function (h) {
    html += '<th style="text-align:left;">' + h + '</th>';
  });
  html += '</tr>';

  rows.forEach(function (row, i) {
    var bg = i % 2 === 0 ? '#ffffff' : '#eef8ff';
    html += '<tr style="background:' + bg + ';">';
    row.forEach(function (cell) {
      var val = cell instanceof Date
        ? Utilities.formatDate(cell, tz, 'dd/MM/yyyy HH:mm')
        : cell;
      html += '<td>' + val + '</td>';
    });
    html += '</tr>';
  });
  html += '</table>';
  html += '<p>Total de contactos registrados: <b>' + rows.length + '</b></p>';
  html += '<p style="color:#888;font-size:12px;">Esta base de datos es privada y solo tu la puedes ' +
    'ver o modificar desde tu cuenta de Google.</p>';

  MailApp.sendEmail({
    to: 'quimirocio@hotmail.com',
    subject: 'Nuevo contacto en rociobuendia.com — base de datos actualizada (' + rows.length + ' registros)',
    htmlBody: html
  });
}
