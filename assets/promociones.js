// assets/js/promociones.js
// JavaScript puro para calcular promociones:
// - Promo A: "Llevá 2 productos y obtené 50% en el segundo." (aplica por producto, pares)
// - Promo B: "3x2 en productos seleccionados." (atributo data-promo-3x2="true")
// - Promo C: "10% de descuento por compras superiores a $30.000." (aplica sobre subtotal luego de los descuentos producto-level)

(function () {
  // helper para formatear número a entero (sin decimales) y separar miles
  function formatCurrency(n) {
    return Number(Math.round(n)).toLocaleString("es-AR");
  }

  // Obtener nodos
  const qtyInputs = Array.from(document.querySelectorAll(".qty-input"));
  const calcBtn = document.getElementById("calcBtn");
  const resetBtn = document.getElementById("resetBtn");

  // elementos resultado
  const elTotalNoDesc = document.getElementById("totalNoDesc");
  const elDescHalf = document.getElementById("descHalf");
  const elDesc3x2 = document.getElementById("desc3x2");
  const elDesc10p = document.getElementById("desc10p");
  const elTotalDescuentos = document.getElementById("totalDescuentos");
  const elSubtotal = document.getElementById("subtotal");
  const elTotalFinal = document.getElementById("totalFinal");

  // Lógica principal para calcular
  function calcular() {
    const productRows = Array.from(document.querySelectorAll(".product-row"));
    let totalSinDescuento = 0;
    let totalDescHalf = 0;
    let totalDesc3x2 = 0;

    // recorrer productos
    productRows.forEach((row) => {
      const price = Number(row.dataset.price); // en pesos, p.ej. 24990
      const qtyInput = row.querySelector(".qty-input");
      const qty = Math.max(0, Math.floor(Number(qtyInput.value) || 0));
      const isHalf =
        row.dataset.promoHalf === "true" || row.dataset.promoHalf === "True";
      const is3x2 =
        row.dataset.promo3x2 === "true" || row.dataset.promo3x2 === "True";

      // total por este producto sin descuentos
      const lineTotal = price * qty;
      totalSinDescuento += lineTotal;

      // Promo A: Llevá 2 -> 50% segundo
      // Para cada par (2 unidades), descuento = 0.5 * price (por par)
      if (isHalf && qty >= 2) {
        const pares = Math.floor(qty / 2);
        const descuentoPorPares = pares * (price * 0.5);
        totalDescHalf += descuentoPorPares;
      }

      // Promo B: 3x2
      // Por cada 3 unidades, se descuenta 1 unidad (la más barata, aquí es el mismo producto)
      if (is3x2 && qty >= 3) {
        const grupos = Math.floor(qty / 3);
        const descuento3x2 = grupos * price; // 1 producto gratis por cada 3
        totalDesc3x2 += descuento3x2;
      }
    });

    // subtotal después de descuentos por producto
    const descuentosProducto = totalDescHalf + totalDesc3x2;
    const subtotalLuegoDescProd = totalSinDescuento - descuentosProducto;

    // Promo C: 10% si subtotal (luego desc. producto) > 30000
    let descuento10p = 0;
    const UMBRAL = 30000;
    if (subtotalLuegoDescProd > UMBRAL) {
      descuento10p = subtotalLuegoDescProd * 0.1;
    }

    const totalDescuentos = descuentosProducto + descuento10p;
    const totalFinal = totalSinDescuento - totalDescuentos;

    // Actualizar UI (redondeo y formato)
    elTotalNoDesc.textContent = formatCurrency(totalSinDescuento);
    elDescHalf.textContent = formatCurrency(totalDescHalf);
    elDesc3x2.textContent = formatCurrency(totalDesc3x2);
    elDesc10p.textContent = formatCurrency(descuento10p);
    elTotalDescuentos.textContent = formatCurrency(totalDescuentos);
    elSubtotal.textContent = formatCurrency(
      subtotalLuegoDescProd - descuento10p
    );
    elTotalFinal.textContent = formatCurrency(totalFinal);
  }

  // Eventos: calcular al presionar el botón o al cambiar cantidades (actualización en vivo)
  calcBtn.addEventListener("click", calcular);

  qtyInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // opcional: actualizar automáticamente mientras escriben
      calcular();
    });
  });

  resetBtn.addEventListener("click", () => {
    qtyInputs.forEach((i) => (i.value = 0));
    calcular();
  });

  // calcular inicialmente
  calcular();
})();
