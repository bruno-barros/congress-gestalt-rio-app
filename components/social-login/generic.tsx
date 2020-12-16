import {Component} from "react";
import SocialLogin from 'react-social-login'


class Generic extends Component<any>{

  render() {
    return (<button
      type="button"
      className="btn btn-outline-secondary"
      onClick={this.props.triggerLogin} {...this.props}>
      {this.props.children}
    </button>)
  }

}

export default SocialLogin(Generic)
