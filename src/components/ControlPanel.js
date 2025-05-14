import React from "react";
import "./ControlPanel.css";

function ControlPanel({
  etapaActual,
  onAvanzarEtapa,
  onRetrocederEtapa,
  onDescanso,
  onFinal,
}) {
  // ¡Añade onRetrocederEtapa aquí!
  return (
    <div className="control-panel">
      <h2>Control de Etapa</h2>
      <p>Etapa Actual: {etapaActual}</p>
      <button onClick={onAvanzarEtapa}>Avanzar Etapa</button>
      {etapaActual > 1 && (
        <button onClick={onRetrocederEtapa}>Retroceder Etapa</button>
      )}
      {etapaActual > 1 && <button onClick={onDescanso}>Descanso</button>}
      {etapaActual > 1 && <button onClick={onFinal}>Final</button>}
    </div>
  );
}

export default ControlPanel;
