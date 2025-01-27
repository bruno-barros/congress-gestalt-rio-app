import { method } from "lodash";
import Abstract from "../resources/abstract";

export const CRITERIAS = {
  relevance: {
    title: { pt: "Relevância", en: "Relevance", es: "Relevancia" },
    description: {
      pt: "O quanto o conteúdo é relevante para o tema proposto",
      en: "How relevant the content is to the proposed theme",
      es: "Cuán relevante es el contenido para el tema propuesto",
    },
    weight: 1,
    min: 0,
    max: 5,
    type: "number",
  },
  clarity: {
    title: { pt: "Clareza", en: "Clarity", es: "Claridad" },
    description: {
      pt: "O quanto o conteúdo é claro e compreensível",
      en: "How clear and understandable the content is",
      es: "Cuán claro y comprensible es el contenido",
    },
    weight: 1,
    min: 0,
    max: 5,
    type: "number",
  },
  bibliography: {
    title: { pt: "Bibliografia", en: "Bibliography", es: "Bibliografía" },
    description: {
      pt: "Adequação e qualidade da bibliografia",
      en: "Adequacy and quality of the bibliography",
      es: "Adecuación y calidad de la bibliografía",
    },
    weight: 1,
    min: 0,
    max: 5,
    type: "number",
  },
  methodology: {
    title: { pt: "Metodologia", en: "Methodology", es: "Metodología" },
    description: {
      pt: "Adequação e qualidade da metodologia",
      en: "Adequacy and quality of the methodology",
      es: "Adecuación y calidad de la metodología",
    },
    weight: 1,
    min: 0,
    max: 5,
    type: "number",
  },
  research: {
    title: {
      pt: "Análise de dados (em caso de pesquisa)",
      en: "Data analysis (in case of research)",
      es: "Análisis de datos (en caso de investigación)",
    },
    description: {
      pt: "Adequação e qualidade da pesquisa",
      en: "Adequacy and quality of the research",
      es: "Adecuación y calidad de la investigación",
    },
    weight: 1,
    min: 0,
    max: 5,
    type: "number",
  },
  //   quality: {
  //     title: { pt: "Qualidade", en: "Quality", es: "Calidad" },
  //     description: {
  //       pt: "A qualidade do conteúdo apresentado",
  //       en: "The quality of the content presented",
  //       es: "La calidad del contenido presentado",
  //     },
  //     weight: 1,
  //     min: 0,
  //     max: 5,
  //     type: "number",
  //   },
  //   contributions: {
  //     title: { pt: "Contribuições", en: "Contributions", es: "Contribuciones" },
  //     description: {
  //       pt: "A originalidade e contribuições do trabalho",
  //       en: "The originality and contributions of the work",
  //       es: "La originalidad y contribuciones del trabajo",
  //     },
  //     weight: 1,
  //     min: 0,
  //     max: 5,
  //     type: "number",
  //   }
};

export interface CriteriaSchema {
  id: string;
  title: { pt: string; en: string; es: string };
  description: { pt: string; en: string; es: string };
  weight: number;
  max: number;
  min: number;
  type: "number" | "text";
  options?: string[];
  bla: string;
}

export interface EvaluationSchema {
  id: number;
  abstract_id: number;
  user_id: number;
  edition_id: string;
  status: string;
  relevance: number;
  quality: number;
  clarity: number;
  contributions: number;
  bibliography: number;
  methodology: number;
  research: number;
  comment: string;
  answers: object;
  is_public: number;
  created_at: string;
  updated_at: string;
  abstract?: Abstract
}
