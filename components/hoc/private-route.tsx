import {NextPageContext} from "next";
import React, {Component} from "react";
import AuthToken from "../../src/http/auth-token";
import {redirectToLogin} from "../../src/helpers";
import {connect} from "react-redux";
import {fetchUserData, renewAuthToken} from "../../src/store/user.actions";
import {Action, Dispatch} from "redux";


export type AuthProps = {
  token: string;
  auth: AuthToken;
  dispatch: Dispatch<any>;
  user: any;
}

const privateRoute = (WrappedComponent: any) => {
  class HOC extends Component<AuthProps> {
    state = {
      auth: new AuthToken(this.props.token)
    };

    static async getInitialProps(ctx: NextPageContext) {

      const auth = AuthToken.factory();
      const pageProps =
        WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))
      // Return props.
      return {...pageProps, auth}
    }

    // static async getInitialProps(ctx: NextPageContext) {
    //   // create AuthToken
    //   // const auth = AuthToken.fromNext(ctx);
    //   const auth = AuthToken.factory();
    //   const initialProps = {auth};
    //   // if the token is expired, that means the user is no longer (or never was) authenticated
    //   // and if we allow the request to continue, they will reach a page they should not be at.
    //   if (auth.isExpired) {
    //     console.log("hey! server says you shouldnt be here! you are not logged in!");
    //     console.log(auth.expiresAt.toString());
    //
    //   }
    //   // passing in a copy of the ServerResponse tells the redirect this server side
    //   if (auth.isExpired) redirectToLogin(ctx.res);
    //   if (WrappedComponent.getInitialProps) {
    //     const wrappedProps = await WrappedComponent.getInitialProps(initialProps);
    //     // make sure our `auth: AuthToken` is always returned
    //     return {...wrappedProps, auth};
    //   }
    //   return initialProps;
    // }

    componentDidMount(): void {

      // since getInitialProps returns our props after they've JSON.stringify
      // we need to reinitialize it as an AuthToken to have the full class
      // with all instance methods available
      const auth = AuthToken.factory();

      if (auth.isExpired){
        redirectToLogin();
        return;
      }
      // refill user if not present
      /*      @deprecated       */
      // if(!this.props.user.hasOwnProperty('id')) this.props.dispatch(fetchUserData())
      // refresh token 1 minute before expires
      if (auth.almostExpired() && auth.tokenExists()) this.props.dispatch(renewAuthToken())

      this.setState({auth})
    }

    render() {
      // we want to hydrate the WrappedComponent with a full instance method of
      // AuthToken, the existing props.auth is a flattened auth, we want to use
      // the state instance of auth that has been rehydrated in browser after mount
      const {auth, ...propsWithoutAuth} = this.props;
      return <WrappedComponent auth={this.state.auth} {...propsWithoutAuth} />;
    }
  }

  return connect(mapStateToProps, null)(HOC);
}

const mapStateToProps = state => ({
  user: state.user
})

export default privateRoute;
