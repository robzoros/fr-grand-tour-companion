export const calcularClasificacionesTotales = (
  equipos,
  resultados,
  tourPoints = {}
) => {
  const totales = { general: {}, sprint: {}, montaña: {} };

  equipos.forEach((equipo) => {
    [equipo.rodador, equipo.sprinter].forEach((corredor) => {
      totales.general[corredor.nombre] = { tiempoTotal: 0 };
      totales.sprint[corredor.nombre] = 0;
      totales.montaña[corredor.nombre] = 0;
    });
  });

  for (const etapa in resultados) {
    const resultadosEtapa = resultados[etapa];

    resultadosEtapa?.individual?.forEach((resultado) => {
      if (totales.general[resultado.corredor]) {
        totales.general[resultado.corredor].tiempoTotal +=
          resultado.tiempo || 0;
      }
    });

    resultadosEtapa?.puntos?.sprint?.forEach(({ corredor, puntos }) => {
      if (totales.sprint[corredor] !== undefined) {
        totales.sprint[corredor] += puntos;
      }
    });

    resultadosEtapa?.puntos?.montaña?.forEach(({ corredor, puntos }) => {
      if (totales.montaña[corredor] !== undefined) {
        totales.montaña[corredor] += puntos;
      }
    });
  }

  // Ordenar clasificaciones
  totales.general = Object.entries(totales.general)
    .sort(([, a], [, b]) => a.tiempoTotal - b.tiempoTotal)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  totales.sprint = Object.entries(totales.sprint)
    .sort(([, a], [, b]) => b - a)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  totales.montaña = Object.entries(totales.montaña)
    .sort(([, a], [, b]) => b - a)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  return {
    ...totales,
    tour: tourPoints || {},
  };
};
