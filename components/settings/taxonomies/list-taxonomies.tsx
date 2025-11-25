import { useState } from "react";
import useSettingsContext from "../settings-context";
import useTaxonomyContext from "./taxonomies-context"
import useTaxonomies from "../../hooks/activities/useTaxonomies";
import Button from "react-bootstrap/Button";
import ProgressBar from "../../ui/progressbar";
import { getTaxonomyTypeLabel } from "../../../src/resources/taxonomy";
import TaxonomyLine from "./taxonomy-line";
import CustomSidePane from "../../side-pane/side-pane";
import TaxonomyForm from "./taxonomy-form";


export default function ListTaxonomies({ onActive, ...props }) {

    const {taxonmy, selected, setSelected} = useTaxonomyContext()
     const { lang, setLang, currentEdition } = useSettingsContext();  
      const { data, isFetching, isLoading, refetch } = useTaxonomies(currentEdition, (d) => {
        return (Array.isArray(d)) && d.filter((a) => a.type === taxonmy);
      });
      const singular = getTaxonomyTypeLabel(taxonmy, lang, false)
      const plural = getTaxonomyTypeLabel(taxonmy, lang, true)
    
    // console.log(onActive, props)
    
    return <div>
        <div className="d-flex justify-content-between align-items-center">
        <h3>Lista de {plural}</h3>
        <Button type="button" variant="warning" size="sm" onClick={() => setSelected(0)}>
            Criar {singular}
        </Button>
      </div>
      {(isLoading || isFetching) && <ProgressBar />}

      {((!data || data?.length === 0) && !isLoading) && 
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <div>Nenhum registro encontrado.</div>        
        </div>}
        {(data?.length > 0) && data.map((tax) => {
            return <TaxonomyLine key={tax.id} tax={tax} />;
        })}

        <CustomSidePane
            width={65}
            onActive={onActive}
            open={selected !== null}
            onClose={() => setSelected(null)}
            >
            {() => {
                return <TaxonomyForm id={selected} onUpdate={() => {
                setSelected(null)
                refetch()
                }} />;
            }}
        </CustomSidePane>

    </div>
}