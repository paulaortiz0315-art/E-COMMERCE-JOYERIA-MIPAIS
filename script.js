const productos = [
  {
    id: 1,
    nombre: "Candongas Combinadas",
    precio: 50000,
    imagen: "https://www.joyeriacaracas.co/cdn/shop/files/Candongas-combinadas-_-Esmeraldas-1.png?v=1721859401",
    categoria: "Candongas"
  },
  {
    id: 2,
    nombre: "Collar Corazón",
    precio: 35000,
    imagen: "https://cdn-media.glamira.com/media/catalog/category/product_image_top_banner_colliers.jpg",
    categoria: "Collares"
  },
  {
    id: 3,
    nombre: "Anillos de Compromiso",
    precio: 65000,
    imagen: "https://laguacajoyeros.com/cdn/shop/files/joyasparamujerorode18k-126.jpg?v=1739914736&width=3840",
    categoria: "Anillos"
  },
  {
    id: 4,
    nombre: "Cadena Tejido Especial",
    precio: 28000,
    imagen: "https://static.wixstatic.com/media/302ef5_82789a0bc5c8486f99b74192be04190b~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/302ef5_82789a0bc5c8486f99b74192be04190b~mv2.jpg",
    categoria: "Cadenas"
  },
  {
    id: 5,
    nombre: "Pulsera Watson",
    precio: 30000,
    imagen: "https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/15061watson/alloycolour/yellow/accent/black.jpg",
    categoria: "Pulseras"
  }
];

const carrito = [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const filtroEl = document.getElementById("filtro");
const iaButton = document.getElementById("iaButton");

function mostrarProductos(lista = productos) {
  contenedorProductos.innerHTML = "";
  if (lista.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  lista.forEach(prod => {
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

filtroEl.addEventListener("change", () => {
  const cat = filtroEl.value;
  if (cat === "all") mostrarProductos(productos);
  else {
    const filtrados = productos.filter(p => p.categoria === cat);
    mostrarProductos(filtrados);
  }
});

iaButton.addEventListener("click", () => {
  const cat = filtroEl.value;
  if (cat === "all") {
    alert("💡 Asistente IA: Elige una categoría primero para sugerirte productos.");
    return;
  }
  const sugeridos = productos.filter(p => p.categoria === cat).slice(0, 2);
  mostrarProductos(sugeridos);
  alert(`💎 Asistente IA: Te muestro los mejores productos de la categoría "${cat}"`);
});

function agregarAlCarrito(id) {
  const prodExistente = carrito.find(p => p.id === id);
  if (prodExistente) prodExistente.cantidad++;
  else {
    const prod = productos.find(p => p.id === id);
    carrito.push({ ...prod, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0, totalItems = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    totalItems += item.cantidad;
  });
  totalCarrito.textContent = total.toFixed(2);
  document.querySelector(".carrito h2").textContent = `🧾 Carrito de Compras (${totalItems})`;
}

function vaciarCarrito() {
  if (confirm("¿Vaciar todo el carrito?")) {
    carrito.length = 0;
    actualizarCarrito();
  }
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🛒");
    return;
  }
  alert("🎉 ¡Gracias por tu compra! Recibirás confirmación pronto.");
  carrito.length = 0;
  actualizarCarrito();
}

const botonFinalizar = document.createElement("button");
botonFinalizar.textContent = "✅ Finalizar Compra";
botonFinalizar.className = "btn";
botonFinalizar.onclick = finalizarCompra;
document.querySelector(".carrito").appendChild(botonFinalizar);

// ---------- Pago PayPal y Tarjeta Simulada ----------

function getCartTotal() {
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

paypal.Buttons({
  style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
  createOrder: (data, actions) => {
    const total = getCartTotal();
    if (total <= 0) {
      alert("🛒 Agrega productos antes de pagar.");
      return actions.reject();
    }
    return actions.order.create({
      purchase_units: [{
        amount: { value: (total / 4000).toFixed(2) }, // conversión COP→USD aprox.
        description: "Compra en Mi País Joyería"
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      const confirmEl = document.getElementById("confirm");
      confirmEl.style.display = "block";
      confirmEl.innerHTML = `<strong>Pago exitoso</strong><br>Transacción: ${details.id}<br>Gracias, ${details.payer.name.given_name || "cliente"}!`;
      carrito.length = 0;
      actualizarCarrito();
    });
  },
  onError: err => alert("Error en el pago: " + err)
}).render("#paypal-button-container");

document.getElementById("pagarTarjeta").addEventListener("click", () => {
  const total = getCartTotal();
  if (total <= 0) {
    alert("🛒 No hay productos en el carrito.");
    return;
  }
  const nombre = prompt("Nombre en la tarjeta (simulado):");
  if (!nombre) return alert("Pago cancelado.");
  setTimeout(() => {
    const confirmEl = document.getElementById("confirm");
    confirmEl.style.display = "block";
    confirmEl.innerHTML = `<strong>Pago con tarjeta simulado exitoso</strong><br>Monto: $${total.toFixed(2)} COP<br>Cliente: ${nombre}`;
    carrito.length = 0;
    actualizarCarrito();
  }, 700);
});

// Inicializar
mostrarProductos();
