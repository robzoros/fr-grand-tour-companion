import React from "react";
import "./ControlPanel.css";

function ControlPanel({
  etapaActual,
  idPartida,
  mostrarClasificacionFinal,
  onAvanzarEtapa,
  onRetrocederEtapa,
  onDescanso,
  onFinal,
  onGuardar,
  onModalEnlaces
}) {
  
  const mostrarBoton = (etapaActual > 1 && !mostrarClasificacionFinal);
  return (
    <div className="control-panel">
      <h2>Control de Etapa</h2>
      <p>Etapa Actual: {etapaActual}</p>
      {!mostrarClasificacionFinal && <button onClick={onAvanzarEtapa}>Avanzar Etapa</button>}
      {mostrarBoton && <button onClick={onRetrocederEtapa}>Retroceder Etapa</button>}
      {mostrarBoton && <button onClick={onDescanso}>Descanso</button>}
      {mostrarBoton && <button onClick={onFinal}>Final</button>}
      <button onClick={onGuardar}>Guardar</button>
      {idPartida !== "" && <button onClick={onModalEnlaces}>Compartir</button>}
    </div>
  );
}

export default ControlPanel;
