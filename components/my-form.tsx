import {reduxForm, Field, FormErrors, InjectedFormProps} from "redux-form";
import Text from "./ui/form/text";
import {Dispatch} from "redux";
import Select from "./ui/form/select";

interface ProfileFormProps {
}

type MyFormProps = InjectedFormProps<{}, ProfileFormProps, FormErrors> & ProfileFormProps;

const MyForm = ({handleSubmit}: MyFormProps) => {

  function onSubmit(values: any) {
    console.log('SUBMITED', values);
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <Field name="name" type="text" component={Text}
           label="Nome completo" disabled={false}/>
    <Field name="email" type="text" component={Text}
           label="E-mail" disabled={false}/>
    <Field name="opcao" component={Select} label="Opção"
           disabled={false} options={[
      {label: '', value: ''},
      {label: 'Opção 1', value: '1'},
      {label: 'Opção 2', value: '2'},
      {label: 'Opção 3', value: '3'},
    ]}/>

    <button type="submit" className="btn btn-outline-secondary"
            disabled={false}>ENVIAR
    </button>
  </form>)

}


const asyncValidate = async (values: any, dispatch: Dispatch, props: ProfileFormProps, fieldString: string) => {

  if (!fieldString && !values.name) {
    throw {name: `Nome completo é obrigatório`};
  }
  if (values.name.split(' ').length < 2) {
    throw {name: `Nome completo é obrigatório`};
  }
  if (!fieldString &&
    (!values.email || values.email.indexOf('@') === -1)) {
    throw {email: `E-mail é obrigatório`};
  }
  if (!fieldString && (!values.opcao || values.opcao.length === 0)) {
    throw {opcao: `Escolha uma opção`};
  }
};


export default reduxForm<{}, ProfileFormProps, FormErrors>({
  form: 'myform',
  enableReinitialize: true,
  // validate,
  asyncValidate,
  asyncBlurFields: [],
  persistentSubmitErrors: true
})(MyForm);
