/* NM Motor — vista previa del portal de gestión. Datos de ejemplo en memoria. */
const IVA = 0.21;
let facturas = JSON.parse(JSON.stringify(FACTURAS));
let presupuestos = JSON.parse(JSON.stringify(PRESUPUESTOS));
let ordenes = JSON.parse(JSON.stringify(ORDENES));
let recambios = JSON.parse(JSON.stringify(RECAMBIOS));
let seccion = "panel";
let filtro = "";

/* ---------- utilidades ---------- */
const eur = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
const num0 = n => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(n);
const cliente = id => CLIENTES.find(c => c.id === id) || { nombre: "Cliente", vehiculos: [] };
const coches = id => cliente(id).vehiculos || [];
const coche = id => coches(id)[0] || {};
const total = f => f.base * (1 + IVA);
const hoyISO = () => new Date().toISOString().slice(0, 10);
const fecha = iso => (iso || "").split("-").reverse().join("/");
const VEHICULOS = () => CLIENTES.flatMap(c => c.vehiculos.map(v => ({ ...v, clienteId: c.id, cliente: c.nombre })));
const dias = iso => Math.round((new Date(iso + "T00:00:00") - new Date(hoyISO() + "T00:00:00")) / 86400000);

const estadoClase = e => ({
  "Cobrada": "e-cobrada", "Pendiente": "e-pendiente", "Vencida": "e-vencida",
  "Recibida": "e-recibida", "Presupuestada": "e-presupuesto", "Aprobada": "e-aprobada",
  "En taller": "e-taller", "Lista": "e-lista", "Entregada": "e-entregada",
  "Enviado": "e-presupuesto", "Aprobado": "e-aprobada", "Rechazado": "e-vencida"
}[e] || "e-pendiente");

const semaforoITV = itv => {
  const d = dias(itv);
  if (d < 0) return { texto: "Caducada", clase: "e-vencida", d };
  if (d <= 30) return { texto: "Vence en " + d + " días", clase: "e-vencida", d };
  if (d <= 60) return { texto: "En " + d + " días", clase: "e-pendiente", d };
  return { texto: "En regla", clase: "e-ok", d };
};

function avisoRevision(v) {
  if (!v.revision) return null;
  const falta = v.revision - v.km;
  if (falta <= 0) return { texto: "Revisión pasada (" + num0(v.revision) + " km)", clase: "e-vencida", falta };
  if (falta <= 3000) return { texto: "Revisión en " + num0(falta) + " km", clase: "e-pendiente", falta };
  return null;
}

/* ---------- avisos del dia ---------- */
function avisos() {
  const lista = [];
  VEHICULOS().forEach(v => {
    const s = semaforoITV(v.itv);
    if (s.d <= 30) lista.push({ tipo: "ITV", texto: `${v.matricula} · ${v.marca} ${v.modelo} (${cliente(v.clienteId).nombre})`, detalle: s.d < 0 ? "ITV caducada" : "ITV vence en " + s.d + " días", clase: s.clase, seccion: "vehiculos" });
    const r = avisoRevision(v);
    if (r) lista.push({ tipo: "Revisión", texto: `${v.matricula} · ${num0(v.km)} km`, detalle: r.texto, clase: r.clase, seccion: "vehiculos" });
  });
  recambios.filter(r => r.stock < r.minimo).forEach(r => lista.push({
    tipo: "Recambio", texto: `${r.nombre}`, detalle: `Quedan ${r.stock}, el mínimo es ${r.minimo}`, clase: "e-vencida", seccion: "recambios" }));
  presupuestos.filter(p => p.estado === "Enviado").forEach(p => {
    const d = -dias(p.fecha);
    if (d >= 3) lista.push({ tipo: "Presupuesto", texto: `${p.num} · ${cliente(p.cliente).nombre}`, detalle: `${eur(total(p))} enviado hace ${d} días, sin respuesta`, clase: "e-pendiente", seccion: "facturas" });
  });
  facturas.filter(f => f.estado === "Vencida").forEach(f => lista.push({
    tipo: "Cobro", texto: `${f.num} · ${cliente(f.cliente).nombre}`, detalle: `${eur(total(f))} pendiente desde el ${fecha(f.fecha)}`, clase: "e-vencida", seccion: "facturas" }));
  ordenes.filter(o => o.recambio && o.estado !== "Entregada").forEach(o => lista.push({
    tipo: "Recambio pedido", texto: `${o.matricula} · ${o.trabajo.slice(0, 40)}`, detalle: o.recambio, clase: "e-pendiente", seccion: "ordenes" }));
  return lista;
}

/* ---------- graficos SVG ---------- */
function anchoGrafico() { return window.innerWidth < 760 ? 380 : 660; }

function graficoBarras(datos, ancho = anchoGrafico(), alto = 260) {
  const max = Math.max(...datos.map(d => d.valor)) * 1.15;
  const izq = 56, abajo = 34, arriba = 14;
  const anchoBarra = (ancho - izq - 14) / datos.length;
  const y = v => alto - abajo - (v / max) * (alto - abajo - arriba);
  let barras = "", ejes = "", etiquetas = "";
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i, yy = y(v);
    ejes += `<line class="eje" x1="${izq}" y1="${yy}" x2="${ancho - 6}" y2="${yy}"/>`;
    etiquetas += `<text x="${izq - 9}" y="${yy + 4}" text-anchor="end">${num0(v)}</text>`;
  }
  datos.forEach((d, i) => {
    const x = izq + i * anchoBarra + anchoBarra * 0.24;
    const w = anchoBarra * 0.52;
    const h = Math.max(2, alto - abajo - y(d.valor));
    barras += `<rect class="barra" x="${x.toFixed(1)}" y="${y(d.valor).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5"/>`;
    barras += `<text x="${(x + w / 2).toFixed(1)}" y="${alto - abajo + 20}" text-anchor="middle">${d.etiqueta.slice(0, 3)}</text>`;
  });
  return `<svg class="grafico barras" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="degradadoOro" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f2d888"/><stop offset="100%" stop-color="#b8912a"/></linearGradient></defs>
    ${ejes}${barras}${etiquetas}
  </svg>`;
}

const COLORES = ["#c9a227", "#3d9bff", "#35d07f", "#ff8a3d", "#c17ce0", "#ff5c5c"];

function graficoDonut(datos, tam = (window.innerWidth < 760 ? 210 : 240)) {
  const totalV = datos.reduce((s, d) => s + d.valor, 0);
  const r = 84, cx = tam / 2, cy = tam / 2, grosor = 26;
  let angulo = -Math.PI / 2, trozos = "";
  datos.forEach((d, i) => {
    const frac = d.valor / totalV, fin = angulo + frac * Math.PI * 2;
    const x1 = cx + r * Math.cos(angulo), y1 = cy + r * Math.sin(angulo);
    const x2 = cx + r * Math.cos(fin), y2 = cy + r * Math.sin(fin);
    trozos += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
      fill="none" stroke="${COLORES[i % COLORES.length]}" stroke-width="${grosor}" stroke-linecap="butt"/>`;
    angulo = fin;
  });
  return `<svg class="grafico donut" viewBox="0 0 ${tam} ${tam}">
    ${trozos}
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" style="font-size:19px;fill:#fff">${num0(totalV)}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle">facturas</text>
  </svg>`;
}

function graficoLineas(series, meses, ancho = anchoGrafico(), alto = 240) {
  const max = Math.max(...series.flatMap(s => s.datos)) * 1.2;
  const izq = 58, abajo = 30, arriba = 14;
  const x = i => izq + (i / (meses.length - 1)) * (ancho - izq - 16);
  const y = v => alto - abajo - (v / max) * (alto - abajo - arriba);
  let ejes = "", textos = "", lineas = "", puntos = "";
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i, yy = y(v);
    ejes += `<line class="eje" x1="${izq}" y1="${yy}" x2="${ancho - 8}" y2="${yy}"/>`;
    textos += `<text x="${izq - 9}" y="${yy + 4}" text-anchor="end">${num0(v)}</text>`;
  }
  meses.forEach((m, i) => { textos += `<text x="${x(i)}" y="${alto - 8}" text-anchor="middle">${m.slice(0, 3)}</text>`; });
  series.forEach(s => {
    lineas += `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"
      points="${s.datos.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}"/>`;
    puntos += s.datos.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.3" fill="${s.color}"/>`).join("");
  });
  return `<svg class="grafico lineas" viewBox="0 0 ${ancho} ${alto}">${ejes}${lineas}${puntos}${textos}</svg>`;
}

function cortoTexto(t, n = 24) { return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t; }

function graficoBarrasH(datos, ancho = (window.innerWidth < 760 ? 380 : 470)) {
  const alto = datos.length * 34 + 14, max = Math.max(...datos.map(d => d.valor));
  let filas = "";
  datos.forEach((d, i) => {
    const y = i * 34 + 4, w = (d.valor / max) * (ancho - 215);
    filas += `<text x="0" y="${y + 15}" style="fill:#b9c3d1">${cortoTexto(d.nombre)}</text>
      <rect x="168" y="${y + 3}" width="${w.toFixed(1)}" height="16" rx="5" fill="url(#degradadoOro)"/>
      <text x="${(174 + w).toFixed(1)}" y="${y + 16}" style="fill:#f2f5fa">${d.valor}</text>`;
  });
  return `<svg class="grafico" viewBox="0 0 ${ancho} ${alto}">
    <defs><linearGradient id="degradadoOro" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f2d888"/><stop offset="100%" stop-color="#b8912a"/></linearGradient></defs>${filas}</svg>`;
}

/* ---------- calculos ---------- */
const MES_CURSO = "2026-10";
function kpis() {
  const delMes = facturas.filter(f => f.fecha.startsWith(MES_CURSO));
  const facturadoMes = delMes.reduce((s, f) => s + f.base, 0);
  const pendiente = facturas.filter(f => f.estado !== "Cobrada").reduce((s, f) => s + total(f), 0);
  const sinRespuesta = presupuestos.filter(p => p.estado === "Enviado");
  const itvProximas = VEHICULOS().filter(v => semaforoITV(v.itv).d <= 30);
  const bajoMinimo = recambios.filter(r => r.stock < r.minimo);
  const abiertas = ordenes.filter(o => o.estado !== "Entregada");
  const ticket = facturas.length ? facturas.reduce((s, f) => s + f.base, 0) / facturas.length : 0;
  return { facturadoMes, nMes: delMes.length, pendiente, sinRespuesta, itvProximas, bajoMinimo, abiertas, ticket };
}

/* ---------- vistas ---------- */
function vistaPanel() {
  const k = kpis();
  const barras = CONTABILIDAD.map(m => ({ etiqueta: m.mes.slice(0, 3).toUpperCase(), valor: m.ingresos }));
  const porTipo = TIPOS.map(t => ({ nombre: t, valor: facturas.filter(f => f.tipo === t).length })).filter(d => d.valor);
  const series = [
    { nombre: "Ingresos", color: "#c9a227", datos: CONTABILIDAD.map(m => m.ingresos) },
    { nombre: "Gastos", color: "#ff5c5c", datos: CONTABILIDAD.map(m => m.gastos) }
  ];
  const av = avisos();
  return `
  <div class="rejilla-kpi">
    <div class="kpi"><div class="kpi-eti">Facturado en octubre</div><div class="kpi-valor">${eur(k.facturadoMes)}</div>
      <div class="kpi-pie">${k.nMes} facturas emitidas</div></div>
    <div class="kpi"><div class="kpi-eti">Pendiente de cobro</div><div class="kpi-valor">${eur(k.pendiente)}</div>
      <div class="kpi-pie"><span class="aviso">${facturas.filter(f => f.estado !== "Cobrada").length} facturas sin cobrar</span></div></div>
    <div class="kpi"><div class="kpi-eti">Presupuestos sin respuesta</div><div class="kpi-valor">${k.sinRespuesta.length}</div>
      <div class="kpi-pie">${eur(k.sinRespuesta.reduce((s, p) => s + total(p), 0))} esperando al cliente</div></div>
    <div class="kpi"><div class="kpi-eti">ITV que vencen este mes</div><div class="kpi-valor">${k.itvProximas.length}</div>
      <div class="kpi-pie">${k.itvProximas.map(v => v.matricula).slice(0, 3).join(" · ") || "ninguna"}</div></div>
  </div>

  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Avisos de hoy</h3>
      <span class="pista">lo que no se puede olvidar, sacado solo de tus datos</span></div>
      <div class="tarjeta-cuerpo"><div class="avisos">
        ${av.map(a => `<div class="aviso-fila" data-ir="${a.seccion}"><span class="etiqueta ${a.clase}">${a.tipo}</span>
          <div><b>${a.texto}</b><span>${a.detalle}</span></div></div>`).join("") || `<div class="suave">Todo en orden.</div>`}
      </div></div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Trabajo abierto</h3>
      <span class="pista">vehículos que están o vienen al taller</span></div>
      <div class="tarjeta-cuerpo"><div class="lista-compacta">
        ${ordenes.filter(o => o.estado !== "Entregada").map(o => `<div class="fila-coche" data-orden="${o.num}">
          <span class="placa">${o.matricula}</span>
          <div><b>${o.vehiculo}</b><span>${cortoTexto(o.trabajo, 34)}</span></div>
          <span class="etiqueta ${estadoClase(o.estado)}">${o.estado}</span></div>`).join("")}
      </div></div></div>
  </div>

  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Facturación por mes</h3>
      <span class="pista">base sin IVA, año en curso</span></div>
      <div class="tarjeta-cuerpo">${graficoBarras(barras)}</div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Reparto del trabajo</h3>
      <span class="pista">facturas por tipo de trabajo</span></div>
      <div class="tarjeta-cuerpo">${graficoDonut(porTipo)}</div>
      <div class="leyenda">${porTipo.map((d, i) => `<span><i style="background:${COLORES[i % COLORES.length]}"></i>${d.nombre} (${d.valor})</span>`).join("")}</div>
    </div>
  </div>
  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Ingresos y gastos</h3><span class="pista">evolución del año</span></div>
      <div class="tarjeta-cuerpo">${graficoLineas(series, CONTABILIDAD.map(m => m.mes))}</div>
      <div class="leyenda"><span><i style="background:#c9a227"></i>Ingresos</span><span><i style="background:#ff5c5c"></i>Gastos</span></div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Recambios más usados</h3><span class="pista">unidades del año</span></div>
      <div class="tarjeta-cuerpo">${graficoBarrasH(TOP_RECAMBIOS)}</div></div>
  </div>`;
}

function vistaOrdenes() {
  const columnas = ["Recibida", "Presupuestada", "Aprobada", "En taller", "Lista"];
  const q = filtro.toLowerCase();
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Órdenes de trabajo abiertas</h3>
    <span class="pista">cada vehículo, su estado y su fecha prevista</span></div>
    <div class="tarjeta-cuerpo"><div class="kanban">
    ${columnas.map(e => {
      const grupo = ordenes.filter(o => o.estado === e && (`${o.num} ${o.matricula} ${o.vehiculo} ${o.trabajo} ${cliente(o.cliente).nombre}`.toLowerCase().includes(q)));
      return `<div class="columna" data-columna="${e}"><h4>${e}<span>${grupo.length}</span></h4>
        ${grupo.map(o => `<div class="tarjeta-ot ${o.recambio ? "con-aviso" : ""}" data-orden="${o.num}">
          <span class="placa">${o.matricula}</span>
          <b>${o.vehiculo}</b>
          <div class="moto">${cliente(o.cliente).nombre} · ${cortoTexto(o.trabajo, 42)}</div>
          ${o.recambio ? `<div class="chip-aviso">Recambio pedido</div>` : ""}
          <div class="pie"><span>${o.num}</span><span class="fuerte">${eur(o.presupuesto)}</span></div>
          <div class="pie pie2"><span>Entrega prevista</span><span>${fecha(o.prevista)}</span></div></div>`).join("")
        || `<div class="suave" style="font-size:13px">Nada aquí</div>`}
      </div>`;
    }).join("")}
    </div></div>
  </div>
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Últimas entregas</h3><span class="pista">histórico reciente</span></div>
    <div class="tabla-scroll"><table><thead><tr><th>Orden</th><th>Matrícula</th><th>Vehículo</th><th>Cliente</th>
      <th>Trabajo</th><th class="derecha">Importe</th><th>Entrega</th></tr></thead><tbody>
      ${ordenes.filter(o => o.estado === "Entregada").map(o => `<tr data-orden="${o.num}">
        <td class="num suave">${o.num}</td><td><span class="placa">${o.matricula}</span></td>
        <td class="fuerte">${o.vehiculo}</td><td>${cliente(o.cliente).nombre}</td>
        <td class="suave">${o.trabajo}</td><td class="num derecha">${eur(o.presupuesto)}</td>
        <td class="num suave">${fecha(o.prevista)}</td></tr>`).join("")}
    </tbody></table></div></div>`;
}

function vistaClientes() {
  const q = filtro.toLowerCase();
  const lista = CLIENTES.filter(c => `${c.nombre} ${coches(c.id).map(v => v.matricula + " " + v.marca + " " + v.modelo).join(" ")}`.toLowerCase().includes(q));
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Fichas de clientes</h3>
    <span class="pista">con los vehículos y el historial de cada uno</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Cliente</th><th>Teléfono</th><th>Vehículos</th><th class="derecha">Visitas</th>
      <th>Última visita</th><th class="derecha">Facturado</th></tr></thead><tbody>
      ${lista.map(c => {
        const suyas = facturas.filter(f => f.cliente === c.id);
        const ultima = suyas.map(f => f.fecha).sort().pop();
        return `<tr data-cliente="${c.id}">
          <td class="fuerte">${c.nombre}</td><td class="num suave">${c.telefono}</td>
          <td>${coches(c.id).map(v => `<span class="placa">${v.matricula}</span>`).join(" ")}</td>
          <td class="num derecha">${suyas.length}</td>
          <td class="num suave">${fecha(ultima)}</td>
          <td class="num derecha fuerte">${eur(suyas.reduce((s, f) => s + f.base, 0))}</td></tr>`;
      }).join("")}
    </tbody></table></div>
  </div>`;
}

function vistaVehiculos() {
  const q = filtro.toLowerCase();
  const lista = VEHICULOS().filter(v => `${v.matricula} ${v.marca} ${v.modelo} ${v.cliente}`.toLowerCase().includes(q));
  const proximos = VEHICULOS().filter(v => semaforoITV(v.itv).d <= 60 || avisoRevision(v))
    .sort((a, b) => dias(a.itv) - dias(b.itv));
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Vehículos del taller</h3>
    <span class="pista">matrícula, kilómetros y estado de la ITV</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Matrícula</th><th>Vehículo</th><th class="derecha">Año</th><th class="derecha">Kilómetros</th>
      <th>Cliente</th><th>ITV</th><th>Estado</th></tr></thead><tbody>
      ${lista.map(v => {
        const s = semaforoITV(v.itv);
        return `<tr data-vehiculo="${v.matricula}">
          <td><span class="placa">${v.matricula}</span></td>
          <td class="fuerte">${v.marca} ${v.modelo}</td>
          <td class="num derecha suave">${v.anyo}</td>
          <td class="num derecha">${num0(v.km)} km</td>
          <td>${v.cliente}</td>
          <td class="num suave">${fecha(v.itv)}</td>
          <td><span class="etiqueta ${s.clase}">${s.texto}</span></td></tr>`;
      }).join("")}
    </tbody></table></div>
  </div>
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Avisos programados</h3>
    <span class="pista">ITV y revisiones de los próximos dos meses</span></div>
    <div class="tarjeta-cuerpo"><div class="avisos">
      ${proximos.map(v => {
        const s = semaforoITV(v.itv), r = avisoRevision(v);
        return `<div class="aviso-fila" data-vehiculo="${v.matricula}">
          <span class="placa">${v.matricula}</span>
          <div><b>${v.marca} ${v.modelo} · ${v.cliente}</b>
          <span>ITV ${fecha(v.itv)} (${s.texto})${r ? " · " + r.texto : ""}</span></div>
          <span class="etiqueta ${s.clase}">${s.d < 0 ? "Caducada" : "Avisar"}</span></div>`;
      }).join("") || `<div class="suave">Sin avisos en los próximos dos meses.</div>`}
    </div></div>
    <div class="nota-legal" style="margin:0 18px 18px">El día que compres el programa, estos avisos salen solos: al cliente le llega un WhatsApp recordándole la ITV o la revisión, y tú lo ves aquí.</div>
  </div>`;
}

function vistaRecambios() {
  const lista = recambios.filter(r => `${r.ref} ${r.nombre} ${r.proveedor} ${r.ubicacion}`.toLowerCase().includes(filtro.toLowerCase()));
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Almacén de recambios</h3>
    <span class="pista">stock, mínimos, ubicación y margen de cada pieza</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Referencia</th><th>Pieza</th><th>Ubicación</th><th>Proveedor</th><th class="derecha">Stock</th>
      <th class="derecha">Mínimo</th><th class="derecha">Coste</th><th class="derecha">PVP</th><th class="derecha">Margen</th><th></th></tr></thead><tbody>
      ${lista.map(r => {
        const margen = ((r.pvp - r.coste) / r.pvp) * 100;
        const bajo = r.stock < r.minimo;
        return `<tr data-recambio="${r.ref}">
          <td class="num suave">${r.ref}</td><td class="fuerte">${r.nombre}</td>
          <td class="num suave">${r.ubicacion}</td><td class="suave">${r.proveedor}</td>
          <td class="num derecha ${bajo ? "aviso" : ""}">${r.stock}</td><td class="num derecha suave">${r.minimo}</td>
          <td class="num derecha suave">${eur(r.coste)}</td><td class="num derecha">${eur(r.pvp)}</td>
          <td class="num derecha">${margen.toFixed(0)}%</td>
          <td><button class="btn secundario mini" data-reponer="${r.ref}">${bajo ? "Pedir" : "Reponer"}</button></td></tr>`;
      }).join("")}
    </tbody></table></div>
  </div>`;
}

function vistaFacturas() {
  const lista = facturas.filter(f => `${f.num} ${cliente(f.cliente).nombre} ${f.concepto}`.toLowerCase().includes(filtro.toLowerCase()));
  const abiertos = presupuestos.filter(p => p.estado === "Enviado");
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Presupuestos esperando al cliente</h3>
    <span class="pista">cuando el cliente dice sí, el presupuesto se convierte en orden de trabajo</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Número</th><th>Fecha</th><th>Cliente</th><th>Vehículo</th><th>Concepto</th>
      <th class="derecha">Total</th><th></th></tr></thead><tbody>
      ${abiertos.map(p => `<tr data-presupuesto="${p.num}">
        <td class="num fuerte">${p.num}</td>
        <td class="num suave">${fecha(p.fecha)}<span class="mini-suave">válido hasta ${fecha(p.validez)}</span></td>
        <td>${cliente(p.cliente).nombre}</td><td><span class="placa">${p.matricula}</span></td>
        <td class="suave">${p.concepto}</td><td class="num derecha fuerte">${eur(total(p))}</td>
        <td><button class="btn mini" data-aprobar="${p.num}">Aprobar</button></td></tr>`).join("")
      || `<tr><td colspan="7" class="suave">No hay presupuestos pendientes.</td></tr>`}
    </tbody></table></div>
  </div>
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Facturas</h3>
    <span class="pista">numeración correlativa, IVA desglosado y huella de cada factura</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Número</th><th>Fecha</th><th>Cliente</th><th>Concepto</th><th class="derecha">Base</th>
      <th class="derecha">IVA 21%</th><th class="derecha">Total</th><th>Estado</th></tr></thead><tbody>
      ${lista.map(f => `<tr data-factura="${f.num}">
        <td class="num fuerte">${f.num}</td><td class="num suave">${fecha(f.fecha)}</td>
        <td>${cliente(f.cliente).nombre}</td><td class="suave">${f.concepto}</td>
        <td class="num derecha">${eur(f.base)}</td><td class="num derecha suave">${eur(f.base * IVA)}</td>
        <td class="num derecha fuerte">${eur(total(f))}</td>
        <td><span class="etiqueta ${estadoClase(f.estado)}">${f.estado}</span></td></tr>`).join("")}
    </tbody></table></div>
    ${lista.length ? "" : `<div class="tarjeta-cuerpo suave">Nada que mostrar con ese filtro.</div>`}
  </div>`;
}

function vistaContabilidad() {
  const ultimos = CONTABILIDAD.slice(-3);
  const iTrim = ultimos.reduce((s, m) => s + m.ingresos, 0);
  const gTrim = ultimos.reduce((s, m) => s + m.gastos, 0);
  const ivaRep = iTrim * IVA, ivaSop = gTrim * IVA;
  const anio = CONTABILIDAD.reduce((s, m) => s + m.ingresos, 0);
  const gastoAnio = CONTABILIDAD.reduce((s, m) => s + m.gastos, 0);
  const totalGastos = GASTOS_MES.reduce((s, g) => s + g.importe, 0);
  return `
  <div class="rejilla-kpi">
    <div class="kpi"><div class="kpi-eti">Ingresos últimos 3 meses</div><div class="kpi-valor">${eur(iTrim)}</div>
      <div class="kpi-pie">agosto, septiembre y octubre</div></div>
    <div class="kpi"><div class="kpi-eti">Gastos últimos 3 meses</div><div class="kpi-valor">${eur(gTrim)}</div>
      <div class="kpi-pie">${eur(totalGastos)} al mes de estructura</div></div>
    <div class="kpi"><div class="kpi-eti">IVA del trimestre</div><div class="kpi-valor">${eur(ivaRep - ivaSop)}</div>
      <div class="kpi-pie">repercutido ${eur(ivaRep)} menos soportado ${eur(ivaSop)}</div></div>
    <div class="kpi"><div class="kpi-eti">Resultado del año</div><div class="kpi-valor">${eur(anio - gastoAnio)}</div>
      <div class="kpi-pie">${eur(anio)} de ingresos, ${eur(gastoAnio)} de gastos</div></div>
  </div>
  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Ingresos y gastos mes a mes</h3><span class="pista">año en curso</span></div>
      <div class="tarjeta-cuerpo">${graficoLineas([
        { nombre: "Ingresos", color: "#c9a227", datos: CONTABILIDAD.map(m => m.ingresos) },
        { nombre: "Gastos", color: "#ff5c5c", datos: CONTABILIDAD.map(m => m.gastos) }], CONTABILIDAD.map(m => m.mes))}</div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Gastos de estructura</h3><span class="pista">mes en curso</span></div>
      <div class="tarjeta-cuerpo"><table><tbody>
      ${GASTOS_MES.map(g => `<tr class="sin-click"><td>${g.concepto}</td><td class="suave num derecha">${g.tipo}</td>
        <td class="num derecha fuerte">${eur(g.importe)}</td></tr>`).join("")}
      <tr class="sin-click"><td class="fuerte">Total</td><td></td><td class="num derecha fuerte">${eur(totalGastos)}</td></tr>
      </tbody></table></div>
      <div class="leyenda"><span>Los impuestos del trimestre salen solos de los datos del año.</span></div></div>
  </div>`;
}

/* ---------- modales ---------- */
function hashFactura(f) {
  const texto = `${f.num}|${f.fecha}|${f.base.toFixed(2)}|${cliente(f.cliente).nombre}|${TALLER.nif}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  let salida = "";
  for (let bloque = 0; bloque < 8; bloque++) {
    h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
    h = (h + Math.imul(bloque + 1, 2654435761)) >>> 0;
    salida += h.toString(16).padStart(8, "0");
  }
  return salida;
}

function modalFactura(numero) {
  const f = facturas.find(x => x.num === numero); if (!f) return;
  const c = cliente(f.cliente), v = coche(f.cliente);
  abrirModal(`Factura ${f.num}`, `
    <div class="fila-datos"><span>Cliente</span><b>${c.nombre}</b></div>
    <div class="fila-datos"><span>Vehículo</span><b>${v.marca || ""} ${v.modelo || ""} · ${v.matricula || ""}</b></div>
    <div class="fila-datos"><span>Concepto</span><b>${f.concepto}</b></div>
    <div class="fila-datos"><span>Fecha</span><b>${fecha(f.fecha)}</b></div>
    <div class="fila-datos"><span>Base imponible</span><b class="num">${eur(f.base)}</b></div>
    <div class="fila-datos"><span>IVA 21%</span><b class="num">${eur(f.base * IVA)}</b></div>
    <div class="fila-datos"><span>Total</span><b class="num" style="color:#e6c85a">${eur(total(f))}</b></div>
    <div class="fila-datos"><span>Estado</span><span class="etiqueta ${estadoClase(f.estado)}">${f.estado}</span></div>
    <div class="sub-bloque"><h4>Registro inalterable</h4>
      <div class="hash">${hashFactura(f)}</div>
      <div class="nota-legal">Huella de la factura: si alguien cambia un importe o una fecha, la huella deja de coincidir. Así el registro queda cerrado y a prueba de retoques.</div></div>
    <div class="campo-doble">
      <button class="btn" data-cobrar="${f.num}">${f.estado === "Cobrada" ? "Marcar como pendiente" : "Marcar como cobrada"}</button>
      <button class="btn secundario" data-pdf="${f.num}">Descargar PDF</button>
    </div>`);
}

function modalCliente(id) {
  const c = cliente(id);
  const suyas = facturas.filter(f => f.cliente === id);
  abrirModal(c.nombre, `
    <div class="fila-datos"><span>Teléfono</span><b class="num">${c.telefono}</b></div>
    <div class="fila-datos"><span>Correo</span><b>${c.email}</b></div>
    <div class="fila-datos"><span>Cliente desde</span><b class="num">${fecha(c.desde)}</b></div>
    ${coches(id).map(v => `<div class="sub-bloque"><h4>Vehículo</h4>
      <div class="fila-datos"><span>Modelo</span><b>${v.marca} ${v.modelo} (${v.anyo})</b></div>
      <div class="fila-datos"><span>Matrícula</span><b class="num">${v.matricula}</b></div>
      <div class="fila-datos"><span>Kilómetros</span><b class="num">${num0(v.km)} km</b></div>
      <div class="fila-datos"><span>Próxima ITV</span><b class="num">${fecha(v.itv)} · <span class="etiqueta ${semaforoITV(v.itv).clase}">${semaforoITV(v.itv).texto}</span></b></div></div>`).join("")}
    <div class="sub-bloque"><h4>Historial de trabajos</h4>
      <div class="historial">
        ${suyas.map(f => `<div><b>${fecha(f.fecha)}</b><span>${f.concepto}</span>
          <span style="margin-left:auto" class="num">${eur(total(f))}</span></div>`).join("") || "<div class='suave'>Sin trabajos registrados</div>"}
      </div></div>
    <div class="nota-legal">Avisos automáticos: cuando el coche toque revisión o ITV, el sistema se lo recuerda al cliente por WhatsApp y te lo apunta aquí.</div>`);
}

function modalVehiculo(matricula) {
  const v = VEHICULOS().find(x => x.matricula === matricula); if (!v) return;
  const c = cliente(v.clienteId);
  const suyos = facturas.filter(f => f.cliente === v.clienteId);
  const s = semaforoITV(v.itv), r = avisoRevision(v);
  abrirModal(`${v.marca} ${v.modelo}`, `
    <div class="fila-datos"><span>Matrícula</span><b class="num">${v.matricula}</b></div>
    <div class="fila-datos"><span>Año</span><b class="num">${v.anyo}</b></div>
    <div class="fila-datos"><span>Kilómetros</span><b class="num">${num0(v.km)} km</b></div>
    <div class="fila-datos"><span>Propietario</span><b>${c.nombre} · ${c.telefono}</b></div>
    <div class="fila-datos"><span>Próxima ITV</span><b class="num">${fecha(v.itv)} <span class="etiqueta ${s.clase}">${s.texto}</span></b></div>
    <div class="fila-datos"><span>Próxima revisión</span><b class="num">${num0(v.revision)} km ${r ? `<span class="etiqueta ${r.clase}">${r.texto}</span>` : ""}</b></div>
    <div class="sub-bloque"><h4>Historial del vehículo</h4>
      <div class="historial">
        ${suyos.map(f => `<div><b>${fecha(f.fecha)}</b><span>${f.concepto}</span>
          <span style="margin-left:auto" class="num">${eur(total(f))}</span></div>`).join("") || "<div class='suave'>Sin trabajos registrados</div>"}
      </div></div>
    <div class="campo-doble">
      <button class="btn" data-wa="1">Avisar por WhatsApp</button>
      <button class="btn secundario" data-cliente="${v.clienteId}">Ver ficha del cliente</button>
    </div>`);
}

function modalPresupuesto(num) {
  const p = presupuestos.find(x => x.num === num); if (!p) return;
  const c = cliente(p.cliente);
  abrirModal(`Presupuesto ${p.num}`, `
    <div class="fila-datos"><span>Cliente</span><b>${c.nombre}</b></div>
    <div class="fila-datos"><span>Vehículo</span><b>${p.vehiculo} · ${p.matricula}</b></div>
    <div class="fila-datos"><span>Trabajo</span><b>${p.concepto}</b></div>
    <div class="fila-datos"><span>Enviado</span><b>${fecha(p.fecha)}</b></div>
    <div class="fila-datos"><span>Válido hasta</span><b>${fecha(p.validez)}</b></div>
    <div class="fila-datos"><span>Base</span><b class="num">${eur(p.base)}</b></div>
    <div class="fila-datos"><span>Total con IVA</span><b class="num" style="color:#e6c85a">${eur(total(p))}</b></div>
    <div class="fila-datos"><span>Estado</span><span class="etiqueta ${estadoClase(p.estado)}">${p.estado}</span></div>
    <div class="nota-legal">El presupuesto se envía al cliente con el detalle de piezas y mano de obra. Si lo aprueba, entra solo en la lista de órdenes de trabajo.</div>
    <div class="campo-doble">
      <button class="btn" data-aprobar="${p.num}">El cliente lo aprueba</button>
      <button class="btn secundario" data-wa="1">Reenviar por WhatsApp</button>
    </div>`);
}

function modalNuevaFactura() {
  abrirModal("Nueva factura", `
    <div class="campo"><label>Cliente</label><select id="nf-cliente">
      ${CLIENTES.map(c => `<option value="${c.id}">${c.nombre} · ${coches(c.id).map(v => v.matricula).join(" / ")}</option>`).join("")}
    </select></div>
    <div class="campo"><label>Concepto</label><input id="nf-concepto" placeholder="Revisión, frenos, neumáticos, distribución..."></div>
    <div class="campo-doble">
      <div class="campo"><label>Base sin IVA</label><input id="nf-base" type="number" min="0" step="0.01" value="180"></div>
      <div class="campo"><label>Tipo de trabajo</label><select id="nf-tipo">${TIPOS.map(t => `<option>${t}</option>`).join("")}</select></div>
    </div>
    <div class="fila-datos"><span>IVA 21%</span><b class="num" id="nf-iva">${eur(180 * IVA)}</b></div>
    <div class="fila-datos"><span>Total</span><b class="num" id="nf-total" style="color:#e6c85a">${eur(180 * (1 + IVA))}</b></div>
    <div class="nota-legal">Al guardar, la factura entra en el registro con su número correlativo y su huella, lista para imprimir o enviar por WhatsApp con el logo del taller.</div>
    <button class="btn" id="nf-guardar">Guardar factura</button>`);
  const base = document.querySelector("#nf-base");
  const pintar = () => {
    const v = parseFloat(base.value) || 0;
    document.querySelector("#nf-iva").textContent = eur(v * IVA);
    document.querySelector("#nf-total").textContent = eur(v * (1 + IVA));
  };
  base.addEventListener("input", pintar);
  document.querySelector("#nf-guardar").addEventListener("click", () => {
    const b = parseFloat(base.value) || 0;
    const concepto = document.querySelector("#nf-concepto").value.trim() || "Trabajo de taller";
    const ultimo = facturas.map(f => parseInt(f.num.split("-").pop(), 10)).sort((a, b2) => b2 - a)[0] || 0;
    facturas.unshift({
      num: `NM-2026-${String(ultimo + 1).padStart(4, "0")}`, fecha: hoyISO(),
      cliente: document.querySelector("#nf-cliente").value, concepto, base: b,
      tipo: document.querySelector("#nf-tipo").value, estado: "Pendiente"
    });
    cerrarModal(); pintarTodo(); toast("Factura guardada con su número correlativo.");
  });
}

function modalOrden(num) {
  const o = ordenes.find(x => x.num === num); if (!o) return;
  const c = cliente(o.cliente);
  const siguiente = { "Recibida": "Presupuestada", "Presupuestada": "Aprobada", "Aprobada": "En taller", "En taller": "Lista", "Lista": "Entregada" }[o.estado];
  abrirModal(`Orden ${o.num}`, `
    <div class="fila-datos"><span>Cliente</span><b>${c.nombre} · ${c.telefono}</b></div>
    <div class="fila-datos"><span>Vehículo</span><b>${o.vehiculo}</b></div>
    <div class="fila-datos"><span>Matrícula</span><b class="num">${o.matricula}</b></div>
    <div class="fila-datos"><span>Kilómetros de entrada</span><b class="num">${num0(o.km)} km</b></div>
    <div class="fila-datos"><span>Trabajo</span><b>${o.trabajo}</b></div>
    <div class="fila-datos"><span>Presupuesto</span><b class="num">${eur(o.presupuesto)} + IVA = ${eur(o.presupuesto * (1 + IVA))}</b></div>
    <div class="fila-datos"><span>Entrada</span><b class="num">${fecha(o.entrada)}</b></div>
    <div class="fila-datos"><span>Entrega prevista</span><b class="num">${fecha(o.prevista)}</b></div>
    ${o.recambio ? `<div class="fila-datos"><span>Recambio</span><b>${o.recambio}</b></div>` : ""}
    <div class="fila-datos"><span>Estado</span><span class="etiqueta ${estadoClase(o.estado)}">${o.estado}</span></div>
    <div class="nota-legal">Cada cambio de estado se puede avisar al cliente por WhatsApp con un toque, y el cliente ve el estado de su coche desde el móvil.</div>
    <div class="campo-doble">
      ${siguiente ? `<button class="btn" data-estado="${o.num}">Pasar a ${siguiente}</button>` : `<button class="btn" data-wa="1">Avisar al cliente</button>`}
      <button class="btn secundario" data-facturar="${o.num}" ${(o.estado === "Lista" || o.estado === "En taller") ? "" : "disabled"}>Pasar a factura</button>
    </div>`);
}

function modalNuevaOrden() {
  const opciones = CLIENTES.map(c => `<option value="${c.id}">${c.nombre} · ${coches(c.id).map(v => v.matricula).join(", ")}</option>`).join("");
  abrirModal("Nueva orden de trabajo", `
    <div class="campo"><label>Cliente</label><select id="no-cliente">${opciones}</select></div>
    <div class="campo"><label>Trabajo a realizar</label>
      <input id="no-trabajo" placeholder="Ej.: cambio de aceite, filtros y revisión"></div>
    <div class="campo-doble">
      <div class="campo"><label>Presupuesto sin IVA</label><input id="no-presupuesto" type="number" inputmode="decimal" placeholder="180"></div>
      <div class="campo"><label>Kilómetros de entrada</label><input id="no-km" type="number" inputmode="numeric" placeholder="120000"></div>
    </div>
    <div class="nota-legal">La orden entra como «Recibida» y desde aquí se pasa a presupuestada, aprobada y taller. Cada paso se puede avisar al cliente por WhatsApp.</div>
    <button class="btn" id="no-guardar">Crear la orden</button>`);
}

function modalRecambio(ref) {
  const r = recambios.find(x => x.ref === ref); if (!r) return;
  const margen = ((r.pvp - r.coste) / r.pvp) * 100;
  abrirModal(r.nombre, `
    <div class="fila-datos"><span>Referencia</span><b class="num">${r.ref}</b></div>
    <div class="fila-datos"><span>Proveedor</span><b>${r.proveedor}</b></div>
    <div class="fila-datos"><span>Ubicación en almacén</span><b class="num">${r.ubicacion}</b></div>
    <div class="fila-datos"><span>Stock actual</span><b class="num">${r.stock} unidades</b></div>
    <div class="fila-datos"><span>Mínimo de seguridad</span><b class="num">${r.minimo}</b></div>
    <div class="fila-datos"><span>Precio de coste</span><b class="num">${eur(r.coste)}</b></div>
    <div class="fila-datos"><span>Precio de venta</span><b class="num">${eur(r.pvp)}</b></div>
    <div class="fila-datos"><span>Margen</span><b class="num" style="color:#35d07f">${margen.toFixed(1)}%</b></div>
    ${r.stock < r.minimo ? `<div class="nota-legal">Esta pieza está por debajo del mínimo. En la versión definitiva el pedido al proveedor sale de aquí con un clic, con tus referencias y tu precio de compra.</div>` : ""}
    <button class="btn" data-reponer="${r.ref}">Reponer hasta el mínimo más 10</button>`);
}

/* ---------- modal generico y avisos ---------- */
function abrirModal(titulo, html) {
  document.querySelector("#modal-titulo").textContent = titulo;
  document.querySelector("#modal-cuerpo").innerHTML = html;
  document.querySelector("#velo").classList.add("visible");
}
function cerrarModal() { document.querySelector("#velo").classList.remove("visible"); }

let toastTimer = null;
function toast(texto) {
  const t = document.querySelector("#toast");
  t.textContent = texto;
  t.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("visible"), 3200);
}

/* ---------- pintar ---------- */
function vistaActual() {
  return {
    panel: vistaPanel, ordenes: vistaOrdenes, clientes: vistaClientes, vehiculos: vistaVehiculos,
    recambios: vistaRecambios, facturas: vistaFacturas, contabilidad: vistaContabilidad
  }[seccion];
}

function pintarTodo() {
  document.querySelectorAll(".menu button").forEach(b => b.classList.toggle("activo", b.dataset.seccion === seccion));
  document.querySelector("#contenido").innerHTML = vistaActual()();
  const titulos = {
    panel: "Panel del taller", ordenes: "Órdenes de trabajo", clientes: "Clientes", vehiculos: "Vehículos",
    recambios: "Recambios", facturas: "Facturas y presupuestos", contabilidad: "Contabilidad"
  };
  const subtitulos = {
    panel: "Todo lo del día en una pantalla",
    ordenes: "Dónde está cada coche y qué le falta",
    clientes: "Fichas con el historial de cada cliente",
    vehiculos: "Matrículas, kilómetros y avisos de ITV",
    recambios: "Stock, mínimos, ubicación y margen",
    facturas: "Presupuestos, facturas y cobros pendientes",
    contabilidad: "Ingresos, gastos, IVA y resultado"
  };
  document.querySelector("#titulo").textContent = titulos[seccion];
  document.querySelector("#subtitulo").textContent = subtitulos[seccion];
  const k = kpis();
  const cuentas = {
    ordenes: k.abiertas.length, clientes: CLIENTES.length, vehiculos: VEHICULOS().length,
    recambios: k.bajoMinimo.length || "", facturas: k.sinRespuesta.length || ""
  };
  document.querySelectorAll(".menu button").forEach(b => {
    const c = b.querySelector(".cuenta");
    if (c) c.textContent = cuentas[b.dataset.seccion] ?? "";
  });
  document.querySelector("#btn-nueva-orden").classList.toggle("oculto", seccion !== "ordenes");
  document.querySelector("#btn-nueva").classList.toggle("oculto", seccion !== "facturas");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- eventos ---------- */
document.addEventListener("click", ev => {
  const nav = ev.target.closest(".menu button, [data-ir]");
  if (nav) {
    const destino = nav.dataset.seccion || nav.dataset.ir;
    seccion = destino; filtro = document.querySelector("#buscar").value = ""; pintarTodo(); return;
  }

  const rowF = ev.target.closest("[data-factura]");
  if (rowF) { modalFactura(rowF.dataset.factura); return; }
  const rowC = ev.target.closest("[data-cliente]");
  if (rowC) { modalCliente(rowC.dataset.cliente); return; }
  const rowV = ev.target.closest("[data-vehiculo]");
  if (rowV) { modalVehiculo(rowV.dataset.vehiculo); return; }
  const rowP = ev.target.closest("[data-presupuesto]");
  if (rowP && !ev.target.closest("[data-aprobar]")) { modalPresupuesto(rowP.dataset.presupuesto); return; }
  const rowR = ev.target.closest("[data-recambio]");
  if (rowR && !ev.target.closest("[data-reponer]")) { modalRecambio(rowR.dataset.recambio); return; }
  const rowO = ev.target.closest("[data-orden]");
  if (rowO && !ev.target.closest("[data-estado]") && !ev.target.closest("[data-facturar]")) { modalOrden(rowO.dataset.orden); return; }

  const aprobar = ev.target.closest("[data-aprobar]");
  if (aprobar) {
    const p = presupuestos.find(x => x.num === aprobar.dataset.aprobar);
    p.estado = "Aprobado";
    const v = VEHICULOS().find(x => x.matricula === p.matricula) || {};
    const ultimo = ordenes.map(o => parseInt(o.num.split("-").pop(), 10)).sort((a, b) => b - a)[0] || 0;
    const prevista = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
    ordenes.unshift({
      num: `OT-2026-${String(ultimo + 1).padStart(4, "0")}`, cliente: p.cliente, vehiculo: p.vehiculo,
      matricula: p.matricula, km: v.km || 0, trabajo: p.concepto, presupuesto: p.base, estado: "Aprobada",
      entrada: hoyISO(), prevista, recambio: "", tecnico: ""
    });
    cerrarModal(); pintarTodo();
    toast(`Presupuesto aprobado: ya es una orden de trabajo (${eur(total(p))}).`);
    return;
  }

  const guardarOrden = ev.target.closest("#no-guardar");
  if (guardarOrden) {
    const cli = document.querySelector("#no-cliente").value;
    const v = coche(cli) || {};
    const trabajo = (document.querySelector("#no-trabajo").value || "").trim() || "Revisión general del vehículo";
    const base = parseFloat(document.querySelector("#no-presupuesto").value) || 0;
    const kmEntrada = parseInt(document.querySelector("#no-km").value, 10) || v.km || 0;
    const ultimo = ordenes.map(o => parseInt(o.num.split("-").pop(), 10)).sort((a, b) => b - a)[0] || 0;
    ordenes.unshift({
      num: `OT-2026-${String(ultimo + 1).padStart(4, "0")}`, cliente: cli,
      vehiculo: `${v.marca || ""} ${v.modelo || ""}`.trim(), matricula: v.matricula || "—",
      km: kmEntrada, trabajo, presupuesto: base, estado: "Recibida", entrada: hoyISO(),
      prevista: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), recambio: "", tecnico: ""
    });
    cerrarModal(); pintarTodo();
    toast(`Orden creada: ${v.matricula || ""} · ${cliente(cli).nombre}.`);
    return;
  }

  const estado = ev.target.closest("[data-estado]");
  if (estado) {
    const o = ordenes.find(x => x.num === estado.dataset.estado);
    const siguiente = { "Recibida": "Presupuestada", "Presupuestada": "Aprobada", "Aprobada": "En taller", "En taller": "Lista", "Lista": "Entregada" }[o.estado];
    o.estado = siguiente; if (siguiente === "Lista") o.recambio = "";
    cerrarModal(); pintarTodo(); toast(`${o.matricula}: ahora está en «${siguiente}».`);
    return;
  }

  const facturar = ev.target.closest("[data-facturar]");
  if (facturar) {
    const o = ordenes.find(x => x.num === facturar.dataset.facturar);
    const ultimo = facturas.map(f => parseInt(f.num.split("-").pop(), 10)).sort((a, b) => b - a)[0] || 0;
    facturas.unshift({
      num: `NM-2026-${String(ultimo + 1).padStart(4, "0")}`, fecha: hoyISO(), cliente: o.cliente,
      concepto: o.trabajo, base: o.presupuesto, tipo: TIPOS[0], estado: "Pendiente"
    });
    o.estado = "Entregada";
    cerrarModal(); pintarTodo(); toast("Factura creada desde la orden de trabajo.");
    return;
  }

  const cobrar = ev.target.closest("[data-cobrar]");
  if (cobrar) {
    const f = facturas.find(x => x.num === cobrar.dataset.cobrar);
    f.estado = f.estado === "Cobrada" ? "Pendiente" : "Cobrada";
    cerrarModal(); pintarTodo(); return;
  }

  const pdf = ev.target.closest("[data-pdf]");
  if (pdf) {
    abrirModal("PDF de la factura", `<div class="nota-legal">Esta vista previa no genera el PDF, pero en la versión definitiva sale con el logo del taller, la numeración, el desglose de IVA, la huella y el código QR de la factura, listo para imprimir o enviar.</div>
      <div class="campo-doble"><button class="btn secundario" id="cerrar2">Cerrar</button>
      <button class="btn" data-wa="1">Enviar por WhatsApp al cliente</button></div>`);
    return;
  }

  const wa = ev.target.closest("[data-wa]");
  if (wa) { abrirModal("Aviso enviado", `<div class="nota-legal">Enviado. En la versión definitiva el cliente recibe el aviso por WhatsApp desde el propio taller y queda registrado en su ficha.</div><button class="btn" id="cerrar3">Entendido</button>`); return; }

  const reponer = ev.target.closest("[data-reponer]");
  if (reponer) {
    const r = recambios.find(x => x.ref === reponer.dataset.reponer);
    const antes = r.stock; r.stock = r.minimo + 10;
    cerrarModal(); pintarTodo(); toast(`${r.nombre}: stock de ${antes} a ${r.stock} unidades.`);
    return;
  }

  if (ev.target.closest("#cerrar2") || ev.target.closest("#cerrar3")) { cerrarModal(); return; }
  if (ev.target.id === "velo" || ev.target.closest(".cerrar")) { cerrarModal(); return; }
});

document.addEventListener("DOMContentLoaded", () => {
  const vistas = ["panel", "ordenes", "clientes", "vehiculos", "recambios", "facturas", "contabilidad"];
  const pedida = (location.hash || "").replace("#", "");
  if (vistas.includes(pedida)) seccion = pedida;
  document.querySelector("#buscar").addEventListener("input", ev => { filtro = ev.target.value; pintarTodo(); });
  document.querySelector("#btn-nueva-orden").addEventListener("click", modalNuevaOrden);
  document.querySelector("#btn-nueva").addEventListener("click", modalNuevaFactura);
  pintarTodo();
  const detalle = new URLSearchParams(location.search).get("detalle");
  if (detalle && detalle.indexOf("factura:") === 0) modalFactura(detalle.split(":")[1]);
  if (detalle && detalle.indexOf("orden:") === 0) modalOrden(detalle.split(":")[1]);
});
