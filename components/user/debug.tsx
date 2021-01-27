import usePushNotification from "../hooks/usePushNotification";
import * as gtag from '../../src/gtag'

export default function DebugPanel() {

  const {debugNotification} = usePushNotification()
  return (<div className="m-5">

    <button className="btn btn-primary btn-lg" onClick={()=>debugNotification()}>Push Notification</button>
    <button className="btn btn-primary btn-lg" onClick={()=>{
      console.log({action: 'debug', category: 'debug', label: 'debug click', value: 0});
      gtag.event({action: 'debug', category: 'debug', label: 'debug click', value: 0})
    }}>Google Analytics Event</button>

  </div>)
}
