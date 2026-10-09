/* NM Motor — datos de EJEMPLO para la vista previa del portal de gestión.
   Todo inventado (clientes, matrículas, importes) para que el taller vea cómo
   quedaría. Fecha de trabajo: octubre de 2026. */

const TALLER = {
  nombre: "NM Motor",
  ciudad: "Parla",
  nif: "B12345678",
  direccion: "Ctra. Parla Pinto, 26, 28983 Parla, Madrid",
  telefono: "600 25 48 53",
  email: "taller@nmmotor.es"
};

const CLIENTES = [
  { id: "C-01", nombre: "Antonio Bermúdez", telefono: "6•• ••• •41", email: "antonio.b@correo.com", desde: "2018-04-11", vehiculos: [
      { marca: "Seat", modelo: "León 1.6 TDI", anyo: 2016, matricula: "1845 JHT", km: 178420, itv: "2026-11-12", revision: 180000 },
      { marca: "Seat", modelo: "Ibiza 1.2", anyo: 2011, matricula: "9087 FBC", km: 243900, itv: "2026-12-03", revision: 250000 } ] },
  { id: "C-02", nombre: "Laura Requena", telefono: "6•• ••• •77", email: "laura.requena@correo.com", desde: "2020-06-02", vehiculos: [
      { marca: "Renault", modelo: "Mégane 1.5 dCi", anyo: 2018, matricula: "7231 KDS", km: 96480, itv: "2027-02-18", revision: 100000 } ] },
  { id: "C-03", nombre: "Manuel Aguilar", telefono: "6•• ••• •22", email: "m.aguilar@correo.com", desde: "2015-01-19", vehiculos: [
      { marca: "Ford", modelo: "Focus 1.6 TDCI", anyo: 2013, matricula: "4520 FGH", km: 231450, itv: "2026-10-28", revision: 240000 },
      { marca: "Ford", modelo: "Transit 2.2 TDCi", anyo: 2011, matricula: "3390 GKL", km: 318400, itv: "2026-09-30", revision: 320000 } ] },
  { id: "C-04", nombre: "Yolanda Nieto", telefono: "6•• ••• •18", email: "yolanda.nieto@correo.com", desde: "2019-09-14", vehiculos: [
      { marca: "Volkswagen", modelo: "Golf 2.0 TDI", anyo: 2017, matricula: "6612 LBN", km: 143820, itv: "2027-01-22", revision: 150000 } ] },
  { id: "C-05", nombre: "Rubén Sanz", telefono: "6•• ••• •09", email: "ruben.sanz@correo.com", desde: "2017-11-06", vehiculos: [
      { marca: "Citroën", modelo: "C4 Picasso 1.6 HDi", anyo: 2015, matricula: "9876 MCD", km: 189340, itv: "2026-10-15", revision: 200000 } ] },
  { id: "C-06", nombre: "Pilar Muñoz", telefono: "6•• ••• •63", email: "pilar.munoz@correo.com", desde: "2021-03-25", vehiculos: [
      { marca: "Peugeot", modelo: "308 1.5 BlueHDi", anyo: 2019, matricula: "2145 JTR", km: 78260, itv: "2027-03-09", revision: 80000 } ] },
  { id: "C-07", nombre: "Óscar Delgado", telefono: "6•• ••• •31", email: "oscar.delgado@correo.com", desde: "2022-05-17", vehiculos: [
      { marca: "Toyota", modelo: "Corolla 1.8 Hybrid", anyo: 2020, matricula: "5567 KZF", km: 61230, itv: "2026-12-01", revision: 60000 } ] },
  { id: "C-08", nombre: "Cristina Vela", telefono: "6•• ••• •55", email: "cristina.vela@correo.com", desde: "2021-10-08", vehiculos: [
      { marca: "Dacia", modelo: "Sandero 1.0 TCe", anyo: 2019, matricula: "8823 LMR", km: 91420, itv: "2027-04-11", revision: 100000 } ] },
  { id: "C-09", nombre: "Javier Moya", telefono: "6•• ••• •27", email: "javier.moya@correo.com", desde: "2016-02-23", vehiculos: [
      { marca: "BMW", modelo: "320d", anyo: 2014, matricula: "3391 HBF", km: 214760, itv: "2026-11-30", revision: 220000 } ] },
  { id: "C-10", nombre: "Nerea Cabrera", telefono: "6•• ••• •70", email: "nerea.cabrera@correo.com", desde: "2023-07-04", vehiculos: [
      { marca: "Opel", modelo: "Corsa 1.2", anyo: 2021, matricula: "1178 LPG", km: 43110, itv: "2027-06-15", revision: 45000 } ] },
  { id: "C-11", nombre: "Emilio Pascual", telefono: "6•• ••• •84", email: "emilio.pascual@correo.com", desde: "2014-08-29", vehiculos: [
      { marca: "Audi", modelo: "A3 Sportback 1.6 TDI", anyo: 2016, matricula: "7745 JKM", km: 165930, itv: "2026-10-22", revision: 170000 },
      { marca: "Renault", modelo: "Kangoo 1.5 dCi", anyo: 2012, matricula: "2201 GHB", km: 268940, itv: "2026-11-08", revision: 270000 } ] },
  { id: "C-12", nombre: "Sonia Herranz", telefono: "6•• ••• •12", email: "sonia.herranz@correo.com", desde: "2020-12-01", vehiculos: [
      { marca: "Nissan", modelo: "Qashqai 1.5 dCi", anyo: 2018, matricula: "4489 KDT", km: 121780, itv: "2027-02-03", revision: 130000 } ] }
];

const TIPOS = ["Mantenimiento", "Frenos", "Neumáticos", "Distribución", "Diagnosis", "Aire acondicionado"];

const ORDENES = [
  { num: "OT-2026-0187", cliente: "C-07", vehiculo: "Toyota Corolla 1.8 Hybrid", matricula: "5567 KZF", km: 61230,
    trabajo: "Revisión de los 60.000 km: aceite, filtros y bujías", presupuesto: 289.00, estado: "En taller",
    entrada: "2026-10-07", prevista: "2026-10-10", recambio: "", tecnico: "Giovany" },
  { num: "OT-2026-0186", cliente: "C-04", vehiculo: "Volkswagen Golf 2.0 TDI", matricula: "6612 LBN", km: 143820,
    trabajo: "Correa de distribución, bomba de agua y anticongelante", presupuesto: 640.00, estado: "En taller",
    entrada: "2026-10-06", prevista: "2026-10-13", recambio: "Kit pedido el 07/10, entra el 12/10", tecnico: "Giovany" },
  { num: "OT-2026-0185", cliente: "C-03", vehiculo: "Ford Transit 2.2 TDCi", matricula: "3390 GKL", km: 318400,
    trabajo: "Embrague: kit completo y volante motor", presupuesto: 1180.00, estado: "Aprobada",
    entrada: "2026-10-05", prevista: "2026-10-14", recambio: "", tecnico: "Giovany" },
  { num: "OT-2026-0184", cliente: "C-02", vehiculo: "Renault Mégane 1.5 dCi", matricula: "7231 KDS", km: 96480,
    trabajo: "Pastillas y discos de freno delanteros", presupuesto: 340.00, estado: "Presupuestada",
    entrada: "2026-10-08", prevista: "2026-10-12", recambio: "", tecnico: "" },
  { num: "OT-2026-0183", cliente: "C-06", vehiculo: "Peugeot 308 1.5 BlueHDi", matricula: "2145 JTR", km: 78260,
    trabajo: "Aire acondicionado: carga de gas y prueba de fugas", presupuesto: 145.00, estado: "Recibida",
    entrada: "2026-10-09", prevista: "2026-10-10", recambio: "", tecnico: "" },
  { num: "OT-2026-0182", cliente: "C-05", vehiculo: "Citroën C4 Picasso 1.6 HDi", matricula: "9876 MCD", km: 189340,
    trabajo: "Pre-ITV: frenos, luces y alineación", presupuesto: 210.00, estado: "Lista",
    entrada: "2026-10-05", prevista: "2026-10-09", recambio: "", tecnico: "Giovany" },
  { num: "OT-2026-0181", cliente: "C-01", vehiculo: "Seat León 1.6 TDI", matricula: "1845 JHT", km: 178420,
    trabajo: "Diagnosis: testigo de motor encendido, válvula EGR", presupuesto: 120.00, estado: "En taller",
    entrada: "2026-10-08", prevista: "2026-10-10", recambio: "", tecnico: "Giovany" },
  { num: "OT-2026-0180", cliente: "C-10", vehiculo: "Opel Corsa 1.2", matricula: "1178 LPG", km: 43110,
    trabajo: "Ruido en suspensión: amortiguadores delanteros", presupuesto: 430.00, estado: "Recibida",
    entrada: "2026-10-09", prevista: "2026-10-15", recambio: "", tecnico: "" },
  { num: "OT-2026-0179", cliente: "C-08", vehiculo: "Dacia Sandero 1.0 TCe", matricula: "8823 LMR", km: 91420,
    trabajo: "Neumáticos delanteros 205/55 R16 y equilibrado", presupuesto: 268.00, estado: "Entregada",
    entrada: "2026-10-02", prevista: "2026-10-03", recambio: "", tecnico: "Giovany" },
  { num: "OT-2026-0178", cliente: "C-09", vehiculo: "BMW 320d", matricula: "3391 HBF", km: 214760,
    trabajo: "Mantenimiento completo y limpieza del filtro de partículas", presupuesto: 410.00, estado: "Entregada",
    entrada: "2026-09-29", prevista: "2026-10-01", recambio: "", tecnico: "Giovany" }
];

const PRESUPUESTOS = [
  { num: "PR-2026-0036", cliente: "C-11", vehiculo: "Audi A3 Sportback 1.6 TDI", matricula: "7745 JKM",
    concepto: "Kit de embrague con volante bimasa", base: 890.00, fecha: "2026-10-02", validez: "2026-10-16", estado: "Enviado" },
  { num: "PR-2026-0035", cliente: "C-09", vehiculo: "BMW 320d", matricula: "3391 HBF",
    concepto: "Cuatro neumáticos 225/45 R18 y alineación", base: 620.00, fecha: "2026-10-05", validez: "2026-10-19", estado: "Enviado" },
  { num: "PR-2026-0034", cliente: "C-12", vehiculo: "Nissan Qashqai 1.5 dCi", matricula: "4489 KDT",
    concepto: "Distribución con bomba de agua", base: 705.00, fecha: "2026-10-06", validez: "2026-10-20", estado: "Enviado" },
  { num: "PR-2026-0033", cliente: "C-03", vehiculo: "Ford Focus 1.6 TDCI", matricula: "4520 FGH",
    concepto: "Compresor de aire acondicionado y carga", base: 540.00, fecha: "2026-10-08", validez: "2026-10-22", estado: "Enviado" },
  { num: "PR-2026-0032", cliente: "C-06", vehiculo: "Peugeot 308 1.5 BlueHDi", matricula: "2145 JTR",
    concepto: "Revisión de los 80.000 km", base: 285.00, fecha: "2026-10-01", validez: "2026-10-15", estado: "Aprobado" }
];

const FACTURAS = [
  { num: "NM-2026-0216", fecha: "2026-10-09", cliente: "C-10", concepto: "Presupuesto y diagnosis de suspensión", base: 45.00, tipo: "Diagnosis", estado: "Pendiente" },
  { num: "NM-2026-0215", fecha: "2026-10-08", cliente: "C-05", concepto: "Pre-ITV: frenos, luces y alineación", base: 210.00, tipo: "Frenos", estado: "Pendiente" },
  { num: "NM-2026-0214", fecha: "2026-10-07", cliente: "C-01", concepto: "Cambio de aceite y filtros", base: 178.50, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "NM-2026-0213", fecha: "2026-10-06", cliente: "C-03", concepto: "Diagnosis de embrague y prueba en carretera", base: 90.00, tipo: "Diagnosis", estado: "Cobrada" },
  { num: "NM-2026-0212", fecha: "2026-10-05", cliente: "C-07", concepto: "Pastillas de freno delanteras", base: 165.00, tipo: "Frenos", estado: "Cobrada" },
  { num: "NM-2026-0211", fecha: "2026-10-03", cliente: "C-08", concepto: "Neumáticos delanteros 205/55 R16 y equilibrado", base: 268.00, tipo: "Neumáticos", estado: "Cobrada" },
  { num: "NM-2026-0210", fecha: "2026-10-02", cliente: "C-02", concepto: "Cambio de aceite y filtro de aire", base: 142.00, tipo: "Mantenimiento", estado: "Vencida" },
  { num: "NM-2026-0209", fecha: "2026-10-01", cliente: "C-04", concepto: "Correa auxiliar y tensor", base: 232.40, tipo: "Distribución", estado: "Cobrada" },
  { num: "NM-2026-0208", fecha: "2026-09-30", cliente: "C-12", concepto: "Carga de aire acondicionado y filtro de habitáculo", base: 118.00, tipo: "Aire acondicionado", estado: "Cobrada" },
  { num: "NM-2026-0207", fecha: "2026-09-28", cliente: "C-11", concepto: "Frenos traseros: discos y pastillas", base: 298.00, tipo: "Frenos", estado: "Cobrada" },
  { num: "NM-2026-0206", fecha: "2026-09-25", cliente: "C-06", concepto: "Revisión de los 80.000 km", base: 285.00, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "NM-2026-0205", fecha: "2026-09-23", cliente: "C-09", concepto: "Batería y comprobación del alternador", base: 186.00, tipo: "Diagnosis", estado: "Cobrada" },
  { num: "NM-2026-0204", fecha: "2026-09-19", cliente: "C-01", concepto: "Distribución y bomba de agua", base: 615.00, tipo: "Distribución", estado: "Cobrada" },
  { num: "NM-2026-0203", fecha: "2026-09-16", cliente: "C-05", concepto: "Amortiguadores delanteros", base: 430.00, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "NM-2026-0202", fecha: "2026-09-11", cliente: "C-07", concepto: "Neumáticos traseros y equilibrado", base: 254.00, tipo: "Neumáticos", estado: "Vencida" },
  { num: "NM-2026-0201", fecha: "2026-09-04", cliente: "C-03", concepto: "Revisión pre-viaje: niveles, frenos y filtros", base: 196.00, tipo: "Mantenimiento", estado: "Cobrada" }
];

const RECAMBIOS = [
  { ref: "RC-2001", nombre: "Aceite 5W30 sintético (5 L)", proveedor: "Castrol", ubicacion: "A-1", stock: 9, minimo: 6, coste: 34.00, pvp: 62.00 },
  { ref: "RC-2002", nombre: "Filtro de aceite (varios modelos)", proveedor: "Bosch", ubicacion: "A-2", stock: 18, minimo: 8, coste: 5.60, pvp: 14.90 },
  { ref: "RC-2003", nombre: "Filtro de aire (varios modelos)", proveedor: "Mann", ubicacion: "A-3", stock: 11, minimo: 5, coste: 8.90, pvp: 21.50 },
  { ref: "RC-2004", nombre: "Filtro de habitáculo con carbón", proveedor: "Mann", ubicacion: "A-4", stock: 4, minimo: 5, coste: 9.80, pvp: 24.00 },
  { ref: "RC-2005", nombre: "Juego de pastillas de freno delanteras", proveedor: "Brembo", ubicacion: "B-1", stock: 6, minimo: 4, coste: 28.50, pvp: 62.00 },
  { ref: "RC-2006", nombre: "Disco de freno ventilado 280 mm", proveedor: "Brembo", ubicacion: "B-2", stock: 2, minimo: 4, coste: 41.00, pvp: 89.00 },
  { ref: "RC-2007", nombre: "Kit de distribución con tensor", proveedor: "Dayco", ubicacion: "C-1", stock: 3, minimo: 2, coste: 96.00, pvp: 205.00 },
  { ref: "RC-2008", nombre: "Bomba de agua", proveedor: "SKF", ubicacion: "C-2", stock: 2, minimo: 2, coste: 58.00, pvp: 128.00 },
  { ref: "RC-2009", nombre: "Kit de embrague con volante bimasa", proveedor: "Luk", ubicacion: "C-3", stock: 1, minimo: 1, coste: 430.00, pvp: 780.00 },
  { ref: "RC-2010", nombre: "Batería 70 Ah AGM", proveedor: "Varta", ubicacion: "D-1", stock: 3, minimo: 3, coste: 92.00, pvp: 165.00 },
  { ref: "RC-2011", nombre: "Bujía de encendido de iridio", proveedor: "NGK", ubicacion: "D-2", stock: 24, minimo: 12, coste: 9.20, pvp: 21.00 },
  { ref: "RC-2012", nombre: "Amortiguador delantero (par)", proveedor: "Monroe", ubicacion: "E-1", stock: 2, minimo: 2, coste: 112.00, pvp: 245.00 },
  { ref: "RC-2013", nombre: "Neumático 205/55 R16 91V", proveedor: "Michelin", ubicacion: "E-2", stock: 4, minimo: 4, coste: 78.00, pvp: 138.00 },
  { ref: "RC-2014", nombre: "Compresor de aire acondicionado", proveedor: "Denso", ubicacion: "F-1", stock: 1, minimo: 1, coste: 265.00, pvp: 495.00 },
  { ref: "RC-2015", nombre: "Gas refrigerante R134a (por carga)", proveedor: "Varias", ubicacion: "F-2", stock: 7, minimo: 3, coste: 18.00, pvp: 49.00 }
];

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"];
const CONTABILIDAD = [
  { mes: "Enero", ingresos: 14820, gastos: 8420 },
  { mes: "Febrero", ingresos: 13190, gastos: 7960 },
  { mes: "Marzo", ingresos: 16430, gastos: 9110 },
  { mes: "Abril", ingresos: 15870, gastos: 8780 },
  { mes: "Mayo", ingresos: 17340, gastos: 9420 },
  { mes: "Junio", ingresos: 18620, gastos: 9880 },
  { mes: "Julio", ingresos: 14090, gastos: 8240 },
  { mes: "Agosto", ingresos: 9860, gastos: 6310 },
  { mes: "Septiembre", ingresos: 17210, gastos: 9350 },
  { mes: "Octubre", ingresos: 5410, gastos: 3180 }
];

const GASTOS_MES = [
  { concepto: "Compra de recambios y consumibles", importe: 2860, tipo: "Variable" },
  { concepto: "Alquiler de la nave", importe: 1150, tipo: "Fijo" },
  { concepto: "Luz, agua y gas", importe: 380, tipo: "Fijo" },
  { concepto: "Seguro del taller y responsabilidad civil", importe: 210, tipo: "Fijo" },
  { concepto: "Cuota de autónomo", importe: 294, tipo: "Fijo" },
  { concepto: "Gestoría", importe: 155, tipo: "Fijo" },
  { concepto: "Gestión de residuos: aceites y filtros", importe: 95, tipo: "Fijo" },
  { concepto: "Publicidad y redes", importe: 180, tipo: "Variable" },
  { concepto: "Herramienta y utillaje", importe: 240, tipo: "Variable" },
  { concepto: "Equipos de protección y seguridad", importe: 70, tipo: "Variable" }
];

const TOP_RECAMBIOS = [
  { nombre: "Aceite y filtro", valor: 58 },
  { nombre: "Pastillas de freno", valor: 34 },
  { nombre: "Filtros de aire y habitáculo", valor: 31 },
  { nombre: "Bujías", valor: 22 },
  { nombre: "Neumáticos", valor: 19 },
  { nombre: "Kits de distribución", valor: 12 }
];
