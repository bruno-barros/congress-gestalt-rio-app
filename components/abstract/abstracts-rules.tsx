import {useRouter} from "next/router";

export default function AbstractsRules() {

  const router = useRouter()
  const lang = router.locale

  return (<>
    <div className="border-info pl-4 py-1 my-1 text-sm " style={{borderLeft: 'solid 3px'}}>
      <h6>Especificação das Fontes</h6>
      <p>Somente a fonte Times New Roman deve ser usada em todas as partes do resumo estendido. Os tamanhos das fontes
        variam de acordo com o local do texto conforme indicado a seguir:</p>
      <ul style={{paddingLeft: '1.2rem'}}>
        <li>Título do artigo: tamanho 12</li>
        <li>Autores e entidades: tamanho 11</li>
        <li>Seções e subseções: tamanho 12</li>
        <li>Todos os demais Textos: tamanho 11</li>
      </ul>
      <p>Deve ser usado somente espaçamento simples em todo o resumo conforme indicado no modelo padrão fornecido pela
        ABRISCO.</p>
    </div>

    <div className="border-info pl-4 py-1 my-1 text-sm" style={{borderLeft: 'solid 3px'}}>
      <h6>Título do Artigo</h6>
      <p> Centre o título na página, o qual deve ter iniciais maiúsculas (ou seja, primeira letra de cada palavra
        significativa deve ser maiúscula) em negrito. Após uma linha de intervalo, introduza as informações sobre os
        autores.</p>
    </div>

    <div className="border-info pl-4 py-1 my-1 text-sm" style={{borderLeft: 'solid 3px'}}>
      <h6>
        Autores e Afiliações</h6>
      <p>Centre os nomes dos autores, que devem ter iniciais maiúsculas. Após uma linha de intervalo, introduza a informação sobre a afiliação dos autores. Se os autores forem afiliados a entidades diferentes, reúna os nomes dos autores de uma mesma entidade em uma linha e na linha seguinte a entidade. Após uma linha de intervalo, repita o processo para os autores da outra entidade. Tal como para os autores, também as afiliações devem ser centradas na página.</p>
    </div>

    <div className="border-info pl-4 py-1 my-1 text-sm" style={{borderLeft: 'solid 3px'}}>
      <h6>Parágrafos</h6>
      <p>Idente cada parágrafo em 10 mm. O texto deve ser em espaço simples, justificado em ambos os lados.</p>
    </div>


    <div className="border-info pl-4 py-1 my-1 text-sm" style={{borderLeft: 'solid 3px'}}>
      <h6>Como apresentar a versão final do trabalho</h6>
      <p>O trabalho final deve ser submetido através do site do evento no formato:  MS Word (.doc ou .docx) ou Adobe Acrobat (.pdf).</p>
    </div>
  </>)
}
