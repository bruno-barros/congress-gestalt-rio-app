import { DocumentContext, DocumentSchema } from "../types/document";

/**
 * Retorna os contextos de documentos, ou um contexto específico
 * @param findBy ID do contexto
 * @returns 
 */
export function DocumentContexts(findBy: string|null = null): DocumentContext[] {
  const data = [
    { id: "affirmative_action", name: "Ação Afirmativa", translationKey: null },
  ];

  return findBy ? data.filter((doc) => doc.id === findBy) : data;
}

export function filterDocumentsContext(
  documents: DocumentSchema[],
  context: string
) {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents.filter((doc) => doc.context === context);
}
