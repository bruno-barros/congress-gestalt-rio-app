import Spinner from "react-bootstrap/Spinner";

interface LoadingProps {
  variant?: string;
  size?: "sm";
  vspace?: number | string;
  message?: string;
  centralized?: boolean;
}

export default function Loading(props: LoadingProps) {
  const {variant, size, vspace, message, centralized} = props;
  const center = typeof centralized === 'undefined' ? true : centralized;

  function generateStyles() {
    let stl: any = {
      textAlign: 'center',
    };
    if (typeof vspace !== 'undefined') {
      stl.paddingTop = vspace;
      stl.paddingBottom = vspace;
    }
    return stl
  }

  return (<div className={`spinner d-flex align-items-center ${center ? 'justify-content-center' : ''}`} style={generateStyles()}>
    <Spinner size={size} animation="border" variant={variant ? variant : 'primary'} />
    {message && <span className="ml-2">{message}</span>}
  </div>)
}
