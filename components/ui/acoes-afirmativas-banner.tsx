import { asset } from "../../src/helpers";


export default function AcoesAfirmativasBanner() {
  return (
    <div className="alert alert-info- d-flex align-items-center" role="alert" style={{
        borderRadius: 5, backgroundImage: `url(${asset('img/banner-af.jpg')})`, 
        backgroundRepeat: 'repeat-x', paddingTop: 50, backgroundColor: '#E1CFB7' }}>    
      <div className="d-flex align-items-center justify-content-between gap-4">
        <strong>Doe para Ações Afirmativas</strong>
        <div>
            <a href="https://congressogestaltrj.com.br/product-category/cotas-para-doacao-pt/" target="_blank" className="btn btn-sm btn-primary text-truncate">Fazer doação</a>
        </div>
      </div>
    </div>
  )
}