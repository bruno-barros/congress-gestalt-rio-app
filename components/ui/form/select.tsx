import {WrappedFieldProps} from 'redux-form';

type SelectProps = WrappedFieldProps & any;

const Select = (props: SelectProps) => {
  const {input, meta, type, label, placeholder, disabled, options} = props;
console.log(props);
  return (
    <div className="form-group">
      <label htmlFor={`fld_${input.name}`}>{label}</label>
      <select id={`fld_${input.name}`} {...input} placeholder={placeholder} disabled={disabled} className="form-control">
        {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}        
      </select>
      {(meta.touched &&
        (meta.error && (<label className="form-error text-danger">{meta.error}</label>))
      )}
    </div>
  );
};

export default Select;
