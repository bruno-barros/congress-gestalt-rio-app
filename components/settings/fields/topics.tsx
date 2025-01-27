import { FieldArray, useField } from "formik";
import Button from "react-bootstrap/Button";
import Text from "../../ui/form/formik/text";
import s from './topics.module.scss';
import LangIndicator from "../lang-indicator";

interface Topic {
  id: string;
  pt: string;
  en: string;
  es: string;
}

interface TopicsProps {
  name: string;
  customId?: boolean;
}
function generateId() {
  return Math.random().toString(36).substring(7);
}

export default function Topics(props: TopicsProps) {
  const { name, customId } = props;

  const [field, meta, helpers] = useField(name);
  const values = Array.isArray(field.value) ? field.value : [];

  function handleAddEdition(helpers) {
    helpers.push({ id: generateId(), pt: "", en: "", es: "" });
  }

  return (
    <>
      <FieldArray
        name={name}
        render={(helpers) => {
          return (
            <div className={s.form_ctrl}>
              {(values && values.length > 0) ? (
                values.map((item, idx) => {
                  return (
                    <div key={idx} className={s.wrapper}>
                        <div className={s.col_fields}>
                        {customId && (
                          <div style={{maxWidth: 80}}>
                            <Text name={`${name}.${idx}.id`} label="ID" inputClass="form-control-sm" />
                          </div>
                        )}
                        <Text name={`${name}.${idx}.pt`} label={<LangIndicator lang="pt">Nome</LangIndicator>} inputClass="form-control-sm" />
                        <Text name={`${name}.${idx}.en`} label={<LangIndicator lang="en">Nome</LangIndicator>} inputClass="form-control-sm" />
                        <Text name={`${name}.${idx}.es`} label={<LangIndicator lang="es">Nome</LangIndicator>} inputClass="form-control-sm" />
                        </div>
                        <div className={s.col_ctrls}>
                            <Button variant="outline-danger" size="sm" onClick={() => helpers.remove(idx)}>-</Button>
                        </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  <div className="badge badge-secondary">Crie o primeiro item</div>
                </div>
              )}
              <Button size="sm" variant="outline-primary" onClick={() => handleAddEdition(helpers)}>+ adicionar</Button>
            </div>
          );
        }}
      ></FieldArray>
    </>
  );
}
