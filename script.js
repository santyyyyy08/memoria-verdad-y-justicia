const testimonios = [
  { texto: "Mi abuela marchó cada jueves alrededor de la Pirámide. Nunca dejó de preguntar dónde estaba su hijo.", autor: "Lucía", meta: "Nieta, Buenos Aires" },
  { texto: "En la facultad desaparecieron compañeros de un día para otro. El silencio era lo que más miedo daba.", autor: "Jorge", meta: "Ex estudiante, La Plata" },
  { texto: "Recuperar mi identidad fue volver a nacer. Gracias a las Abuelas supe quién soy.", autor: "Martín", meta: "Nieto restituido" },
  { texto: "Leí el informe Nunca Más en la secundaria y entendí que la memoria es una tarea colectiva.", autor: "Camila", meta: "Docente, Hurlingham" },
  { texto: "Durante el Juicio a las Juntas mi familia escuchaba la radio en la cocina, conteniendo la respiración.", autor: "Ricardo", meta: "Vecino, Córdoba" },
  { texto: "Cada 24 de marzo marchamos con los pañuelos blancos. Es nuestra forma de decir que no olvidamos.", autor: "Sofía", meta: "Estudiante, UNAHUR" },
];

const toggle = document.querySelector(".nav__toggle");
const lista = document.getElementById("nav-lista");
toggle.addEventListener("click", () => {
  const abierta = lista.classList.toggle("abierta");
  toggle.setAttribute("aria-expanded", abierta);
});
lista.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    lista.classList.remove("abierta");
    toggle.setAttribute("aria-expanded", "false");
  }
});

const GOLPE = new Date(1976, 2, 24); 
function calcularTiempo() {
  const hoy = new Date();
  let anios = hoy.getFullYear() - GOLPE.getFullYear();
  const aniversario = new Date(hoy.getFullYear(), 2, 24);
  if (hoy < aniversario) anios--;

  const dias = Math.floor((hoy - GOLPE) / (1000 * 60 * 60 * 24));
  const ultimoAniv = new Date(GOLPE.getFullYear() + anios, 2, 24);
  const diasDesdeAniv = Math.floor((hoy - ultimoAniv) / (1000 * 60 * 60 * 24));

  document.getElementById("c-anios").textContent = anios;
  document.getElementById("c-dias").textContent = dias.toLocaleString("es-AR");
  document.getElementById("c-aniv").textContent = diasDesdeAniv;
  document.getElementById("c-frase").textContent =
    `Van ${anios} años de Memoria, Verdad y Justicia`;
  document.getElementById("anio-actual").textContent = hoy.getFullYear();
}
calcularTiempo();

const grilla = document.getElementById("grilla-testimonios");
const buscador = document.getElementById("buscador");
const estado = document.getElementById("estado-busqueda");

function normalizar(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function escaparHTML(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function resaltar(texto, termino) {
  if (!termino) return escaparHTML(texto);
  const textoNorm = normalizar(texto);
  const idx = textoNorm.indexOf(termino);
  if (idx === -1) return escaparHTML(texto);
  return (
    escaparHTML(texto.slice(0, idx)) +
    "<mark>" + escaparHTML(texto.slice(idx, idx + termino.length)) + "</mark>" +
    escaparHTML(texto.slice(idx + termino.length))
  );
}

function renderTestimonios(termino = "") {
  const t = normalizar(termino.trim());
  const filtrados = testimonios.filter((item) =>
    normalizar(`${item.texto} ${item.autor} ${item.meta}`).includes(t)
  );

  grilla.innerHTML = filtrados.length
    ? filtrados.map((item) => `
        <figure class="testimonio">
          <blockquote>“${resaltar(item.texto, t)}”</blockquote>
          <figcaption>${resaltar(item.autor, t)}
            <span class="testimonio__meta">${resaltar(item.meta, t)}</span>
          </figcaption>
        </figure>`).join("")
    : `<p class="sin-resultados">No se encontraron testimonios para “${escaparHTML(termino)}”.</p>`;

  estado.textContent = t
    ? `${filtrados.length} de ${testimonios.length} testimonios coinciden.`
    : `Mostrando ${testimonios.length} testimonios.`;
}
buscador.addEventListener("input", (e) => renderTestimonios(e.target.value));
renderTestimonios();

const formTarjeta = document.getElementById("form-tarjeta");
const tarjeta = document.getElementById("tarjeta");
const tMensaje = document.getElementById("t-mensaje");
const tFirma = document.getElementById("t-firma");
const inMensaje = document.getElementById("tarjeta-mensaje");
const restantes = document.getElementById("restantes");

function actualizarTarjeta() {
  const datos = new FormData(formTarjeta);
  const nombre = datos.get("nombre").trim();
  const mensaje = datos.get("mensaje").trim();
  const estilo = datos.get("estilo");

  tMensaje.textContent = mensaje || "Memoria, Verdad y Justicia";
  tFirma.textContent = nombre ? `— ${nombre}` : "— Tu nombre";
  tarjeta.className = "tarjeta" + (estilo !== "azul" ? ` tarjeta--${estilo}` : "");
  restantes.textContent = `${120 - inMensaje.value.length} caracteres restantes`;
}
formTarjeta.addEventListener("input", actualizarTarjeta);
formTarjeta.addEventListener("submit", (e) => e.preventDefault());
actualizarTarjeta();

const formAdhesion = document.getElementById("form-adhesion");
const mensajeForm = document.getElementById("mensaje-form");
const totalFirmas = document.getElementById("total-firmas");
let firmas = 1247;

const reglas = {
  nombre: (v) => v.trim().length >= 3 || "Ingresá tu nombre completo (mínimo 3 letras).",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Ingresá un email válido (ej: nombre@mail.com).",
  localidad: (v) => v.trim() !== "" || "Indicá tu localidad.",
  mensaje: (v) => v.trim().length <= 200 || "El mensaje no puede superar los 200 caracteres.",
};

function validarCampo(input) {
  const regla = reglas[input.name];
  if (!regla) return true;
  const resultado = regla(input.value);
  const campo = input.closest(".campo");
  const error = campo.querySelector(".campo__error");
  const ok = resultado === true;
  campo.classList.toggle("error", !ok);
  input.setAttribute("aria-invalid", !ok);
  error.textContent = ok ? "" : resultado;
  return ok;
}

formAdhesion.querySelectorAll("input:not([type=checkbox]), textarea").forEach((input) => {
  input.addEventListener("blur", () => validarCampo(input));
  input.addEventListener("input", () => {
    if (input.closest(".campo").classList.contains("error")) validarCampo(input);
  });
});

formAdhesion.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [...formAdhesion.querySelectorAll("input:not([type=checkbox]), textarea")];
  const validos = inputs.map(validarCampo).every(Boolean);

  const acepto = document.getElementById("acepto");
  const errorAcepto = document.getElementById("error-acepto");
  errorAcepto.textContent = acepto.checked ? "" : "Tenés que aceptar para adherir.";

  if (!validos || !acepto.checked) {
    mensajeForm.className = "mensaje-form fallo";
    mensajeForm.textContent = "Revisá los campos marcados en rojo.";
    formAdhesion.querySelector("[aria-invalid=true]")?.focus();
    return;
  }

  const nombre = formAdhesion.nombre.value.trim().split(" ")[0];
  firmas++;
  totalFirmas.textContent = firmas.toLocaleString("es-AR");
  mensajeForm.className = "mensaje-form exito";
  mensajeForm.textContent = `¡Gracias, ${nombre}! Tu adhesión fue registrada. Nunca Más.`;
  formAdhesion.reset();
});
