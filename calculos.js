// Semana 12: laboratorio de cierre de brechas sobre el marketplace acumulativo.


function calcularPrecioConDescuento(precio, porcentaje) {
    return precio - (precio * porcentaje / 100);
}

function calcularPrecioConImpuesto(precio, porcentaje) {
    return precio + (precio * porcentaje / 100);
}

function calcularTotalPedido(precio, cantidad, envio) {
    const envioAplicado = cantidad > 5 ? 0 : envio;
    const total = (precio * cantidad) + envioAplicado;
    return total > 100000 ? calcularPrecioConDescuento(total, 10) : total;
}

function actualizarStock(stockActual, cantidadVendida) {
    return Math.max(0, stockActual - cantidadVendida);
}

const formatoMoneda = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
});
const leerNumero = (selector) => Number(document.querySelector(selector).value);
const valoresValidos = (...valores) => valores.every((valor) => Number.isFinite(valor) && valor >= 0);

// submit, preventDefault, value y textContent conectan los cálculos con la interfaz.
document.querySelector("#formDescuento").addEventListener("submit", function (event) {
    event.preventDefault();
    const precio = leerNumero("#precioDescuento");
    const porcentaje = leerNumero("#porcentajeDescuento");
    document.querySelector("#resultadoDescuento").textContent =
        valoresValidos(precio, porcentaje) && porcentaje <= 100
            ? `Resultado: ${formatoMoneda.format(calcularPrecioConDescuento(precio, porcentaje))}`
            : "Resultado: revisa los valores ingresados.";
});

document.querySelector("#formImpuesto").addEventListener("submit", function (event) {
    event.preventDefault();
    const precio = leerNumero("#precioImpuesto");
    const porcentaje = leerNumero("#porcentajeImpuesto");
    document.querySelector("#resultadoImpuesto").textContent = valoresValidos(precio, porcentaje)
        ? `Resultado: ${formatoMoneda.format(calcularPrecioConImpuesto(precio, porcentaje))}`
        : "Resultado: revisa los valores ingresados.";
});

document.querySelector("#formTotal").addEventListener("submit", function (event) {
    event.preventDefault();
    const precio = leerNumero("#precioUnitario");
    const cantidad = leerNumero("#cantidad");
    const envio = leerNumero("#costoEnvio");
    const salida = document.querySelector("#resultadoTotal");
    if (!valoresValidos(precio, cantidad, envio) || cantidad < 1) {
        salida.textContent = "Resultado: revisa los valores ingresados.";
        return;
    }
    const notas = [];
    if (cantidad > 5) notas.push("envío gratis");
    if ((precio * cantidad) + (cantidad > 5 ? 0 : envio) > 100000) notas.push("10% de descuento");
    salida.textContent = `Resultado: ${formatoMoneda.format(calcularTotalPedido(precio, cantidad, envio))}${notas.length ? ` (${notas.join(" y ")})` : ""}`;
});

// Carrito: querySelectorAll, click, event.target, createElement, appendChild y remove.
const listaCarrito = document.querySelector("#listaCarrito");
const cantidadCarrito = document.querySelector("#cantidadCarrito");
const totalCarrito = document.querySelector("#totalCarrito");
const estadoCarrito = document.querySelector("#estadoCarrito");
let productosCarrito = [];

function actualizarResumenCarrito() {
    const total = productosCarrito.reduce((suma, producto) => suma + producto.precio, 0);
    cantidadCarrito.textContent = productosCarrito.length;
    totalCarrito.textContent = formatoMoneda.format(total);
    estadoCarrito.textContent = productosCarrito.length
        ? "Puedes eliminar productos individualmente o vaciar el carrito."
        : "El carrito está vacío.";
}

function agregarProductoAlCarrito(tarjeta) {
    const stockActual = Number(tarjeta.dataset.stock);
    if (stockActual === 0) return;
    const producto = {
        id: `${Date.now()}-${Math.random()}`,
        nombre: tarjeta.dataset.nombre,
        precio: Number(tarjeta.dataset.precio),
        tarjeta
    };
    productosCarrito.push(producto);
    const item = document.createElement("li");
    const texto = document.createElement("span");
    const boton = document.createElement("button");
    texto.textContent = `${producto.nombre} — ${formatoMoneda.format(producto.precio)}`;
    boton.textContent = "Eliminar";
    boton.type = "button";
    boton.className = "boton-eliminar";
    boton.addEventListener("click", function () {
        productosCarrito = productosCarrito.filter((actual) => actual.id !== producto.id);
        cambiarStock(tarjeta, Number(tarjeta.dataset.stock) + 1);
        item.remove();
        actualizarResumenCarrito();
    });
    item.appendChild(texto);
    item.appendChild(boton);
    listaCarrito.appendChild(item);
    cambiarStock(tarjeta, actualizarStock(stockActual, 1));
    actualizarResumenCarrito();
}

function cambiarStock(tarjeta, nuevoStock) {
    tarjeta.dataset.stock = nuevoStock;
    tarjeta.querySelector(".stock span").textContent = nuevoStock;
    tarjeta.querySelector(".boton-comprar").disabled = nuevoStock === 0;
}

document.querySelectorAll(".boton-comprar").forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        agregarProductoAlCarrito(event.target.closest(".tarjeta-producto"));
    });
});

document.querySelector("#btnVaciarCarrito").addEventListener("click", function () {
    productosCarrito.forEach((producto) => cambiarStock(producto.tarjeta, Number(producto.tarjeta.dataset.stock) + 1));
    productosCarrito = [];
    listaCarrito.replaceChildren();
    actualizarResumenCarrito();
});

// To-do: submit, input, keydown, toggle, createElement, appendChild y remove.
const formTarea = document.querySelector("#formTarea");
const inputTarea = document.querySelector("#inputTarea");
const listaTareas = document.querySelector("#listaTareas");
const errorTarea = document.querySelector("#errorTarea");
const contadorCaracteres = document.querySelector("#contadorCaracteres");
const contadorPendientes = document.querySelector("#contadorPendientes");

function actualizarContadorPendientes() {
    const pendientes = listaTareas.querySelectorAll("li:not(.completada)").length;
    contadorPendientes.textContent = pendientes === 0 ? "No hay tareas pendientes."
        : `Te ${pendientes === 1 ? "queda" : "quedan"} ${pendientes} ${pendientes === 1 ? "tarea pendiente" : "tareas pendientes"}.`;
}

function guardarTareas() {
    const tareas = [...listaTareas.querySelectorAll("li")].map((item) => ({
        texto: item.querySelector("span").textContent,
        completada: item.classList.contains("completada")
    }));
    localStorage.setItem("semana12-tareas", JSON.stringify(tareas));
}

function crearTarea(textoTarea, completada = false, guardar = true) {
    const item = document.createElement("li");
    item.className = "tarea";
    if (completada) item.classList.add("completada");
    const texto = document.createElement("span");
    const boton = document.createElement("button");
    texto.textContent = textoTarea;
    texto.tabIndex = 0;
    texto.title = "Clic o Enter para cambiar el estado";
    boton.textContent = "Eliminar";
    boton.type = "button";
    boton.className = "boton-eliminar";
    const alternar = () => {
        item.classList.toggle("completada");
        actualizarContadorPendientes();
        guardarTareas();
        aplicarFiltroTareas(filtroTareasActual);
    };
    texto.addEventListener("click", alternar);
    texto.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); alternar(); }
    });
    boton.addEventListener("click", function () {
        item.remove();
        actualizarContadorPendientes();
        guardarTareas();
    });
    item.appendChild(texto);
    item.appendChild(boton);
    listaTareas.appendChild(item);
    actualizarContadorPendientes();
    if (guardar) guardarTareas();
}

formTarea.addEventListener("submit",  function (event) {       
    event.preventDefault();
    const texto = inputTarea.value.trim();
    if (texto === "") {
        errorTarea.textContent = "Escribe una tarea antes de agregarla.";
        inputTarea.focus();
        return;
    }
    errorTarea.textContent = "";
    crearTarea(texto);
    inputTarea.value = "";
    contadorCaracteres.textContent = "0/60 caracteres";
    inputTarea.focus();
    
});

inputTarea.addEventListener("input", function (event) {
    contadorCaracteres.textContent = `${event.target.value.length}/60 caracteres`;
    if (event.target.value.trim() !== "") errorTarea.textContent = "";
});

actualizarResumenCarrito();
actualizarContadorPendientes();

let filtroTareasActual = "todas";

function aplicarFiltroTareas(filtro) {
    filtroTareasActual = filtro;
    listaTareas.querySelectorAll(".tarea").forEach((item) => {
        const completada = item.classList.contains("completada");
        item.hidden = (filtro === "pendientes" && completada) || (filtro === "completadas" && !completada);
    });
}

document.querySelectorAll("[data-filtro]").forEach((boton) => {
    boton.addEventListener("click", function () {
        document.querySelectorAll("[data-filtro]").forEach((actual) => actual.classList.remove("filtro-activo"));
        boton.classList.add("filtro-activo");
        aplicarFiltroTareas(boton.dataset.filtro);
    });
});

JSON.parse(localStorage.getItem("semana12-tareas") || "[]")
    .forEach((tarea) => crearTarea(tarea.texto, tarea.completada, false));

// PokéAPI: fetch devuelve una promesa y respuesta.json() devuelve otra.
const formPokemon = document.querySelector("#formPokemon");
const estadoPokemon = document.querySelector("#estadoPokemon");
const resultadoPokemon = document.querySelector("#resultadoPokemon");
const btnBuscarPokemon = document.querySelector("#btnBuscarPokemon");

async function buscarPokemon(nombre) {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nombre)}`);
    if (!respuesta.ok) {
        throw new Error(`Pokémon no encontrado (HTTP ${respuesta.status})`);
    }
    return respuesta.json();
}

async function enviarFormularioPokemon(event) {
    event.preventDefault();
    const nombre = document.querySelector("#nombrePokemon").value.trim().toLowerCase();
    if (!nombre) return;
    estadoPokemon.textContent = "Consultando PokéAPI...";
    estadoPokemon.dataset.tipo = "cargando";
    resultadoPokemon.hidden = true;
    btnBuscarPokemon.disabled = true;

    try {
        const pokemon = await buscarPokemon(nombre);
        document.querySelector("#pokemonNombre").textContent = pokemon.name;
        document.querySelector("#pokemonAltura").textContent = `${pokemon.height / 10} m`;
        document.querySelector("#pokemonPeso").textContent = `${pokemon.weight / 10} kg`;
        document.querySelector("#pokemonTipos").textContent = pokemon.types.map((item) => item.type.name).join(", ");
        const imagen = document.querySelector("#imagenPokemon");
        imagen.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
        imagen.alt = `Ilustración oficial de ${pokemon.name}`;
        resultadoPokemon.hidden = false;
        estadoPokemon.textContent = "Datos recibidos y mostrados en el DOM.";
        estadoPokemon.dataset.tipo = "exito";
    } catch (error) {
        estadoPokemon.textContent = `Error: ${error.message}`;
        estadoPokemon.dataset.tipo = "error";
    } finally {
        btnBuscarPokemon.disabled = false;
    }
}

formPokemon.addEventListener("submit",enviarFormularioPokemon);

// Promesa didáctica: simula el tiempo de respuesta de un proveedor de correo.
function enviarCorreoConfirmacion(correo, resumenCompra) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (!correo.includes("@")) {
                reject(new Error("El correo no es válido."));
                return;
            }
            if (resumenCompra.cantidad === 0) {
                reject(new Error("El carrito está vacío."));
                return;
            }
            resolve(
                {
                destinatario: correo,
                asunto: "Confirmación de compra",
                mensaje: `Pedido confirmado: ${resumenCompra.cantidad} producto(s) por ${formatoMoneda.format(resumenCompra.total)}.`
            }
        );
        }, 10000);
    });
}

function obtenerResumenCompra() {
    return {
        cantidad: productosCarrito.length,
        total: productosCarrito.reduce((suma, producto) => suma + producto.precio, 0)
    };
}

const formCorreo = document.querySelector("#formCorreo");
const correoCliente = document.querySelector("#correoCliente");
const estadoCorreo = document.querySelector("#estadoCorreo");
const btnEnviarCorreo = document.querySelector("#btnEnviarCorreo");
const btnCorreoThen = document.querySelector("#btnCorreoThen");

function iniciarEstadoCorreo(metodo) {
    estadoCorreo.textContent = `Promesa pendiente: enviando con ${metodo}...`;
    estadoCorreo.dataset.tipo = "cargando";
    btnEnviarCorreo.disabled = true;
    btnCorreoThen.disabled = true;
}

function finalizarEstadoCorreo() {
    btnEnviarCorreo.disabled = false;
    btnCorreoThen.disabled = false;
}

// Versión 1: consumo tradicional con .then(), .catch() y .finally().
btnCorreoThen.addEventListener("click", function () {
    if (!formCorreo.reportValidity()) return;
    iniciarEstadoCorreo(".then()/.catch()");
    enviarCorreoConfirmacion(correoCliente.value.trim(), obtenerResumenCompra())
        .then(function (confirmacion) {
            estadoCorreo.textContent = `${confirmacion.mensaje} Correo simulado para ${confirmacion.destinatario}.`;
            estadoCorreo.dataset.tipo = "exito";
        })
        .catch(function (error) {
            estadoCorreo.textContent = `Promesa rechazada: ${error.message}`;
            estadoCorreo.dataset.tipo = "error";
        })
        .finally(finalizarEstadoCorreo);
});

// Versión 2: la misma promesa consumida con async/await y try/catch/finally.
formCorreo.addEventListener("submit", async function (event) {
    event.preventDefault();
    iniciarEstadoCorreo("async/await");
    try {
        const confirmacion = await enviarCorreoConfirmacion(correoCliente.value.trim(), obtenerResumenCompra());
        estadoCorreo.textContent = `${confirmacion.mensaje} Correo simulado para ${confirmacion.destinatario}.`;
        estadoCorreo.dataset.tipo = "exito";
    } catch (error) {
        estadoCorreo.textContent = `Promesa rechazada: ${error.message}`;
        estadoCorreo.dataset.tipo = "error";
    } finally {
        finalizarEstadoCorreo();
    }
});

// Diagnóstico local: equivalente individual del semáforo propuesto en la guía.
const selectoresDominio = document.querySelectorAll("#semaforoDominio select");
const resumenDiagnostico = document.querySelector("#resumenDiagnostico");

function actualizarDiagnostico() {
    const diagnostico = {};
    selectoresDominio.forEach((selector) => { diagnostico[selector.dataset.tema] = selector.value; });
    localStorage.setItem("semana12-diagnostico", JSON.stringify(diagnostico));
    const reforzar = Object.entries(diagnostico).filter(([, estado]) => estado !== "verde").map(([tema]) => tema);
    resumenDiagnostico.textContent = reforzar.length
        ? `Prioridad de práctica: ${reforzar.join(", ")}.`
        : "Los cuatro temas están en verde: intenta los retos extendidos.";
}

const diagnosticoGuardado = JSON.parse(localStorage.getItem("semana12-diagnostico") || "{}");
selectoresDominio.forEach((selector) => {
    if (diagnosticoGuardado[selector.dataset.tema]) selector.value = diagnosticoGuardado[selector.dataset.tema];
    selector.addEventListener("change", actualizarDiagnostico);
});
actualizarDiagnostico();

// Bloque 1: coerción, typeof, validación y operadores correctos.
document.querySelector("#formRetoSintaxis").addEventListener("submit", function (event) {
    event.preventDefault();
    const precioTexto = document.querySelector("#retoPrecio").value.trim();
    const porcentajeTexto = document.querySelector("#retoPorcentaje").value.trim();
    const precio = Number(precioTexto);
    const porcentaje = Number(porcentajeTexto);
    const salida = document.querySelector("#resultadoRetoSintaxis");
    if (!Number.isFinite(precio) || !Number.isFinite(porcentaje) || precio < 0 || porcentaje < 0 || porcentaje > 100) {
        salida.textContent = `Entrada inválida: precio es ${typeof precioTexto} y debe convertirse a un número válido.`;
        return;
    }
    const total = calcularPrecioConDescuento(precio, porcentaje);
    salida.textContent = `Correcto: ${formatoMoneda.format(total)}. Number() evitó concatenar texto y const mantuvo valores estables.`;
});

// Bloque 3: modificación visible de CSS Grid.
document.querySelector("#columnasDemo").addEventListener("change", function (event) {
    document.querySelector("#demoGrid").style.setProperty("--columnas-demo", event.target.value);
});

// Bloque 4: progreso y persistencia del checklist de publicación.
const checksDeploy = document.querySelectorAll("#checklistDeploy input");
const progresoDeploy = document.querySelector("#progresoDeploy");

function actualizarDeploy() {
    const completados = [...checksDeploy].filter((check) => check.checked).map((check) => check.value);
    localStorage.setItem("semana12-deploy", JSON.stringify(completados));
    progresoDeploy.textContent = `${completados.length} de ${checksDeploy.length} verificaciones completas${completados.length === checksDeploy.length ? ": listo para publicar." : "."}`;
}

const deployGuardado = JSON.parse(localStorage.getItem("semana12-deploy") || "[]");
checksDeploy.forEach((check) => {
    check.checked = deployGuardado.includes(check.value);
    check.addEventListener("change", actualizarDeploy);
});
actualizarDeploy();

// Plan personal: tres respuestas concretas guardadas en el navegador.
const formPlan = document.querySelector("#formPlanBrecha");
const planGuardado = JSON.parse(localStorage.getItem("semana12-plan") || "null");
if (planGuardado) {
    document.querySelector("#temaBrecha").value = planGuardado.tema;
    document.querySelector("#aplicacionBrecha").value = planGuardado.aplicacion;
    document.querySelector("#recursoBrecha").value = planGuardado.recurso;
    document.querySelector("#estadoPlan").textContent = "Plan recuperado. Puedes editarlo y volver a guardarlo.";
}

formPlan.addEventListener("submit", function (event) {
    event.preventDefault();
    const plan = {
        tema: document.querySelector("#temaBrecha").value,
        aplicacion: document.querySelector("#aplicacionBrecha").value.trim(),
        recurso: document.querySelector("#recursoBrecha").value.trim()
    };
    localStorage.setItem("semana12-plan", JSON.stringify(plan));
    document.querySelector("#estadoPlan").textContent = `Plan guardado: reforzar ${plan.tema} aplicándolo en “${plan.aplicacion}” con apoyo de ${plan.recurso}.`;
});
