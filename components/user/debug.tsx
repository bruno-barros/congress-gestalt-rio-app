import usePushNotification from "../hooks/usePushNotification";


export default function DebugPanel() {

  const {debugNotification} = usePushNotification()
  return (<div className="m-5">

    <button className="btn btn-primary btn-lg" onClick={()=>debugNotification()}>Push Notification</button>

  </div>)
}
