import {Component} from "react";
import SocialLogin from 'react-social-login'


class Generic extends Component<any>{

  noop(){}

  render() {

    let triggerLogin = this.props.hasOwnProperty('triggerLogin') ? this.props.triggerLogin : this.noop

    return (<button
      type="button"
      className="btn btn-outline-secondary btn-block"
      onClick={triggerLogin} {...this.props}>
      {this.props.children}
    </button>)
  }

}

export default SocialLogin(Generic)
