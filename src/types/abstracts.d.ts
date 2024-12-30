/**
 * Usado para listar categorias e itens como opções de seleção
 */
export interface KeyValueItem {
  id: string;
  pt: string;
  en: string;
  es: string;
}
/**
 * Define se o fluxo será completo: resumo + trabalho completo, ou apenas trabalho
 */
export enum AbstractStatusModelEnum {
  SINOPSE_ABSTRACT = "sinopse_abstract",
  ABSTRACT = "abstract",
}

export type StatusType = 'pending' | 'synopsis_revision' | 'synopsis_evaluating' | 'synopsis_rejected' | 'synopsis_waiting_upd' |
  'synopsis_approved' | 'final_revision' | 'evaluating' | 'rejected' | 'waiting_update' | 'pre_approved' | 'approved';
