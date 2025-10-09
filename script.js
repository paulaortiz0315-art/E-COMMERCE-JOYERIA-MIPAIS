const productos = [
  {
    id: 1,
    nombre: "Candongas Combinadas",
    precio: 50.000,
    imagen: "https://www.joyeriacaracas.co/cdn/shop/files/Candongas-combinadas-_-Esmeraldas-1.png?v=1721859401"
  },
  {
    id: 2,
    nombre: "Collar Corazón",
    precio: 35.000,
    imagen: "https://cdn-media.glamira.com/media/catalog/category/product_image_top_banner_colliers.jpg"
  },
  {
    id: 3,
    nombre: "Anillos de Compromiso",
    precio: 65.000,
    imagen: "https://laguacajoyeros.com/cdn/shop/files/joyasparamujerorode18k-126.jpg?v=1739914736&width=3840"
  },
  {
    id: 4,
    nombre: "Cadena Tejido Especial",
    precio: 28.000,
    imagen: "https://static.wixstatic.com/media/302ef5_82789a0bc5c8486f99b74192be04190b~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/302ef5_82789a0bc5c8486f99b74192be04190b~mv2.jpg"
  },
  {
    id: 5,
    nombre: "Pulsera Watson",
    precio: 30.000,
    imagen: "https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/15061watson/alloycolour/yellow/accent/black.jpg"
  }
];

const carrito = [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");

function mostrarProductos() {
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const productoExistente = carrito.find(p => p.id === id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    const producto = productos.find(p => p.id === id);
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    totalItems += item.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
  actualizarTituloCarrito(totalItems);
}

function actualizarTituloCarrito(cantidad) {
  const titulo = document.querySelector(".carrito h2");
  titulo.textContent = `🧾 Carrito de Compras (${cantidad})`;
}

function vaciarCarrito() {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    carrito.length = 0;
    actualizarCarrito();
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }

  alert("🎉 ¡Gracias por tu compra! En breve recibirás un correo de confirmación.");
  carrito.length = 0;
  actualizarCarrito();
}

const botonFinalizar = document.createElement("button");
botonFinalizar.textContent = "✅ Finalizar Compra";
botonFinalizar.style.backgroundColor = "#007bff";
botonFinalizar.style.marginTop = "10px";
botonFinalizar.style.color = "white";
botonFinalizar.style.padding = "8px";
botonFinalizar.style.borderRadius = "4px";
botonFinalizar.style.border = "none";
botonFinalizar.onclick = finalizarCompra;

document.querySelector(".carrito").appendChild(botonFinalizar);

mostrarProductos();
