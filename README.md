# Semana 12 - Día de cierre de brechas

Este proyecto transforma el marketplace acumulativo en un laboratorio de diagnóstico y práctica. No introduce un tema nuevo: permite comprobar y reforzar **Sintaxis JS**, **DOM y eventos**, **Grid/Tailwind** y **sitio estático + deploy**.

## Ejecución

```bash
npm start
```

Abre `http://localhost:3000`. Para validar la sintaxis usa `npm run check`.

## Recorrido

1. **Semáforo:** autoevaluación local por tema, conservada con `localStorage`.
2. **Sintaxis:** repara coerción de tipos, operadores y variables sin declarar.
3. **DOM:** cuenta, filtra y persiste tareas al recargar.
4. **Grid/Tailwind:** cambia columnas y compara el CSS con clases utilitarias.
5. **Deploy:** verifica archivos, consola, rutas, Git y URL pública.
6. **Plan personal:** registra la brecha, aplicación y recurso de práctica.

## Respuestas clave

- `const` por defecto; `let` cuando el valor cambia; `var` se evita por su alcance de función y hoisting.
- `"5" + 3` produce `"53"`; `"5" - 3` produce `2`.
- `querySelector()` devuelve la primera coincidencia; `querySelectorAll()` devuelve todas.
- `preventDefault()` evita la recarga predeterminada de un formulario.
- `textContent` inserta texto; `innerHTML` interpreta HTML y es riesgoso con datos del usuario.
- Flexbox organiza principalmente en una dimensión; Grid trabaja con filas y columnas.
- `repeat(3, 1fr)` crea tres columnas iguales; Tailwind usa `p-4` para padding.
- GitHub Pages publica desde un repositorio; Netlify ofrece despliegue manual o conectado y más configuración.

## Retos por ritmo

- **Mínimo:** cálculo correcto, contador, tres columnas y publicación básica.
- **Medio:** validar tipos, filtrar tareas, grid responsive y probar el deploy externamente.
- **Extendido:** `localStorage`, combinación Grid/Flex y diagnóstico de rutas 404.

## Archivos

- `index.html`: laboratorio y marketplace acumulativo.
- `styles.css`: Grid responsive, estados y diseño original.
- `calculos.js`: ejercicios, DOM y persistencia.
- `servidor.js`: servidor local con respuestas 200/403/404.
- `package.json`: scripts `start` y `check`.

## Evidencia personal

Responde en tu README:

1. ¿Qué tema necesito reforzar?
2. ¿Dónde lo aplicaré en mi proyecto?
3. ¿Qué recurso usaré para practicar?
