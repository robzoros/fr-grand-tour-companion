// src/firebaseService.ts
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Action, State } from "../state/definitions";
import { TABLE_NAME } from "../state/definitions";
import { v4 as uuidv4 } from "uuid";


export function getEstadoPersistente(state: State) {
  return {
    idPartida: state.idPartida,
    idSoloLectura: state.idSoloLectura,
    equipos: state.equipos,
    resultadosPorEtapa: state.resultadosPorEtapa,
    clasificacionesTotales: state.clasificacionesTotales,
    etapaActual: state.etapaActual,
    clasificacionesFinales: state.clasificacionesFinales,
    mostrarClasificacionFinal: state.mostrarClasificacionFinal,
  };
}

export async function guardarEstadoFirebase(state: State, dispatch: React.Dispatch<Action>) {
  let idPartida = state.idPartida;
  let idSoloLectura = state.idSoloLectura;

  // Si no hay IDs, generar
  if (!idPartida || !idSoloLectura) {
    idPartida = uuidv4();
    idSoloLectura = uuidv4();

    // Actualizar estado local con los IDs nuevos
    dispatch({ type: "ASIGNAR_IDS_PARTIDA", payload: { idPartida, idSoloLectura } });
  }

  const estadoAGuardar = {
    ...getEstadoPersistente(state),
    idPartida,
    idSoloLectura,
  };

  try {
    console.log("Guardar estado con idPartida:", idPartida);
    console.log("Contenido estadoAGuardar:", estadoAGuardar);
    console.log("Nombre colección TABLE_NAME:", TABLE_NAME);


    // Guardar usando el idPartida (ya definido)
    await setDoc(doc(db, TABLE_NAME, idPartida), estadoAGuardar);
    console.log("Estado guardado correctamente");
  } catch (error) {
    console.error("Error guardando estado:", error);
  }
}

export async function cargarEstadoFirebase(idPartida: string, initialState: State): Promise<State | null> {
  try {
    const docRef = doc(db, TABLE_NAME, idPartida);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      return {
        ...initialState,
        ...datos,
        mostrarFormularioEquipo: false,
        faseCreacionEquipos: false,
        permisosEscritura: true,
        activeTab: `Etapa ${datos.etapaActual || initialState.etapaActual}`,
      };
    } else {
      console.log("No existe la partida");
      return null;
    }
  } catch (error) {
    console.error("Error cargando estado:", error);
    return null;
  }
}

export const buscarPartidaSoloLectura = async (idSoloLectura: string, initialState: State) => {
  const partidasRef = collection(db, TABLE_NAME);
  const q = query(partidasRef, where("idSoloLectura", "==", idSoloLectura));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("No se encontró ninguna partida con esa clave.");
    return null;
  }

  const doc = querySnapshot.docs[0];
  console.log("Partida encontrada:", doc.id, doc.data());
  return {
    ...initialState,
    ...doc.data(),
    permisosEscritura: false,
    mostrarFormularioEquipo: false,
    faseCreacionEquipos: false,
    activeTab: `Etapa ${doc.data().etapaActual || initialState.etapaActual}`,
  };
  
};
