# Semana 11 JavaScript — Asincronía, APIs y Node.js

Este proyecto parte de **Semana 10 JS**. Conserva el marketplace, carrito, calculadoras y lista de tareas, y agrega ejemplos completos de promesas, `async/await`, `fetch`, manejo de errores y un servidor local con Node.js.

## Objetivos de aprendizaje

- Entender la diferencia entre iniciar una operación y recibir su resultado.
- Reconocer los estados de una promesa: `pending`, `fulfilled` y `rejected`.
- Consumir promesas con `.then()`, `.catch()` y `.finally()`.
- Reescribir el mismo flujo con `async/await` y `try/catch/finally`.
- Consultar una API pública con `fetch()` y mostrar el resultado en el DOM.
- Revisar `response.ok` y manejar errores HTTP o de red.
- Comprender qué hacen Node.js, npm, `package.json`, `localhost` y un puerto.

## Cómo ejecutar

Requiere Node.js instalado. Desde esta carpeta:

```bash
npm start
```

Abre `http://localhost:3000`. No hay dependencias externas que instalar; se usa el módulo nativo `http` de Node.js.

Para comprobar la sintaxis:

```bash
npm run check
```

## Ejemplo 1: PokéAPI con `fetch` y `async/await`

El formulario busca un Pokémon por nombre o número. El flujo es:

1. Se ejecuta `fetch(url)`, que devuelve una promesa.
2. El primer `await` espera la respuesta HTTP.
3. Se verifica `respuesta.ok`; un `404` no genera automáticamente un rechazo de `fetch`.
4. `respuesta.json()` devuelve otra promesa; se espera para obtener el objeto JavaScript.
5. Los datos se muestran con `textContent` y la imagen oficial se asigna mediante `src`.
6. `catch` muestra los errores y `finally` vuelve a habilitar el botón.

La consulta utiliza `https://pokeapi.co/api/v2/pokemon/{nombre}`. Requiere conexión a internet.

## Ejemplo 2: envío asíncrono de correo

`enviarCorreoConfirmacion()` crea una promesa con `new Promise()`. Un `setTimeout` de dos segundos representa la espera de un proveedor externo de correo.

- La promesa se **resuelve** cuando hay un correo válido y productos en el carrito.
- La promesa se **rechaza** cuando el carrito está vacío o el correo no es válido.
- El botón **Enviar con .then()** usa `.then()`, `.catch()` y `.finally()`.
- El botón **Enviar con async/await** consume exactamente la misma promesa mediante `await`, `try`, `catch` y `finally`.

El envío es una simulación educativa: no transmite datos, no usa credenciales y no envía mensajes reales.

## Ejemplo 3: servidor Node.js

`servidor.js` ejecuta JavaScript fuera del navegador. El servidor:

- Escucha solicitudes en el puerto `3000`.
- Entrega `index.html`, CSS y JavaScript.
- Devuelve estado `404` si el archivo solicitado no existe.

`localhost:3000` significa “esta computadora, puerto 3000”. El archivo `package.json` identifica el proyecto y define los comandos de npm.

## Relación con Semana 10

Se conservaron:

- Selección y modificación del DOM.
- Eventos `click`, `submit`, `input` y `keydown`.
- Carrito dinámico y control de stock.
- Calculadoras de descuento, impuesto y total.
- To-do list con creación, marcado y eliminación.

Semana 11 añade operaciones cuyo resultado no existe inmediatamente. Mientras PokéAPI o el correo simulado responden, la interfaz continúa activa.

## Archivos principales

- `index.html`: interfaz del marketplace y demostraciones asíncronas.
- `styles.css`: estilos base y estados de carga, éxito y error.
- `calculos.js`: DOM, carrito, promesas, `async/await` y PokéAPI.
- `servidor.js`: servidor HTTP local.
- `package.json`: identidad del proyecto y scripts npm.

## Pruebas sugeridas

1. Busca `pikachu` y luego un nombre inexistente para comparar éxito y error.
2. Intenta enviar el correo con el carrito vacío: la promesa debe rechazarse.
3. Agrega un producto y prueba ambos botones de correo: deben producir el mismo resultado usando sintaxis diferente.
4. Comprueba que los botones se deshabilitan durante la espera y se restauran en `finally`.
5. Visita `http://localhost:3000/archivo-inexistente` para observar una respuesta 404.
