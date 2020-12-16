import SocialLogin from 'react-social-login'

const Generic = ({children, triggerLogin, ...props}) => {
  return (<button
    type="button"
    className="btn btn-outline-secondary"
    onClick={triggerLogin} {...props}>
    {children}
  </button>)
}
export default SocialLogin(Generic)
