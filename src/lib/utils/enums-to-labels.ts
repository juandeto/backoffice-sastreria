/**
 * Convierte el valor de la cámara a su etiqueta en español.
 */
export function getChamberLabel(chamber: string): string {
  switch (chamber) {
    case "DEPUTY":
      return "Diputados";
    case "SENATOR":
      return "Senadores";
    default:
      return chamber;
  }
}

/**
 * Convierte el tipo de votación a su etiqueta en español.
 */
export function getVoteTypeLabel(voteType: string): string {
  switch (voteType) {
    case "GENERAL":
      return "General";
    case "PARTICULAR":
      return "Particular";
    case "MOTION":
      return "Moción";
    default:
      return voteType;
  }
}

/**
 * Obtiene la variante del Badge según el resultado de la votación.
 */
export function getResultVariant(
  result: string | null | undefined,
): "default" | "destructive" | "outline" {
  if (!result) return "outline";
  switch (result) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
}

/**
 * Convierte el resultado de la votación a su etiqueta en español.
 */
export function getResultLabel(result: string | null | undefined): string {
  if (!result) return "Sin resultado";
  switch (result) {
    case "APPROVED":
      return "Aprobado";
    case "REJECTED":
      return "Rechazado";
    default:
      return result;
  }
}

/**
 * Convierte la opción de voto a su etiqueta en español.
 */
export function getVoteChoiceLabel(choice: string): string {
  switch (choice) {
    case "POSITIVE":
      return "Positivo";
    case "NEGATIVE":
      return "Negativo";
    case "ABSTENTION":
      return "Abstención";
    case "ABSENT":
      return "Ausente";
    case "INCONCLUSIVE":
      return "Inconcluso";
    default:
      return choice;
  }
}
