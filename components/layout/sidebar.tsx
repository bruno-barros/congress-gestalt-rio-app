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
  }, [state])

  function handleOutClick(e){
    const inside = document.getElementById('sidebar').contains(e.target)
    // console.log({inside, state});
    if(state === 'opened' && !inside) {
      setState('closed')
    }

  }

  function toggle(){
    setState(state === 'closed' ? 'opened' : 'closed')
  }

  return (<div id="sidebar" className={`bg-light ${compact && 'compact'}`}>
    <header className="sb-header navbar-light ">
      <button className="navbar-toggler border-0" type="button" onClick={toggle}>
        {state === 'closed' ? <span className="navbar-toggler-icon"/> : <span style={{verticalAlign: 'middle', display: 'inline-block', fontSize: '1.25rem', lineHeight: '1.2em', width: '1.5em', height: '1.5em'}}><span style={{fontSize: 40}}>&times;</span></span>}
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
