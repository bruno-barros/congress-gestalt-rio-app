import {ReactNode, useEffect, useState} from "react";

interface SidebarProps {
  compact?: boolean
  sidebar?: { title?: string; component: ReactNode }
}

export default function Sidebar(props: SidebarProps) {

  const {sidebar, compact} = props
  const [state, setState] = useState('closed')

  useEffect(()=>{
    document.body.addEventListener('click', handleOutClick)
    return () => {
      document.body.removeEventListener('click', handleOutClick)
    }
  }, [])

  function handleOutClick(e){
    console.log(e.target, {state});
  }

  function toggle(){
    setState(state === 'closed' ? 'opened' : 'closed')
  }

  return (<div id="sidebar" className={`bg-light ${compact && 'compact'}`}>
    <header className="sb-header navbar-light ">
      <button className="navbar-toggler border-0" type="button" onClick={toggle}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="sb-title text-truncate dismiss">
        {sidebar?.title}
      </div>
    </header>
    <div className={`sb-body  bg-light ${state}`}>
      {sidebar?.component}
    </div>
  </div>)
}
