import {WrappedFieldProps} from 'redux-form';

type TextProps = WrappedFieldProps & any;

const Text = (props: TextProps) => {
  const {input, meta, type, label, placeholder, disabled} = props;

  return (
    <div className="form-group">
      <label htmlFor={`fld_${input.name}`}>{label}</label>
      <input id={`fld_${input.name}`} {...input} placeholder={placeholder} disabled={disabled} className="form-control"/>
      {(meta.touched &&
        (meta.error && (<label className="form-error text-danger">{meta.error}</label>))
      )}
    </div>
  );
};

export default Text;
