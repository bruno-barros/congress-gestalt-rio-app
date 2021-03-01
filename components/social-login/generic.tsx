import {Component} from "react";
import SocialLogin from 'react-social-login'

interface GenericProps {
  btnStyle?: string
}

class Generic extends Component<GenericProps & any> {

  noop() {
  }

  render() {

    const { children, triggerLogin, btnStyle, ...props } = this.props
    return (<button
      type="button"
      className={`btn -btn-outline-secondary btn-block ${btnStyle}`}
      onClick={triggerLogin} {...props}>
      {children}
    </button>)
  }

}

export default SocialLogin(Generic)
