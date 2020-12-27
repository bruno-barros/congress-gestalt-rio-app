import MainLayout from "../components/layout";

interface DashboardProps {

}

function MeuComponente (){
  return (<div className="">
    <div style={{width: 200, height: 200, backgroundColor: 'blue', margin: '2rem auto'}}/>
    <ul className="list-group">
      <li className="list-group-item dismiss">Cras justo odio</li>
      <li className="list-group-item dismiss">Dapibus ac facilisis in</li>
      <li className="list-group-item dismiss">Morbi leo risus</li>
      <li className="list-group-item dismiss">Porta ac consectetur ac</li>
      <li className="list-group-item dismiss">Vestibulum at eros</li>
      <li className="list-group-item dismiss">Cras justo odio</li>
      <li className="list-group-item dismiss">Dapibus ac facilisis in</li>
    </ul>
  </div>)
}

const Dashboard = (props: DashboardProps) => {
  return (<MainLayout sidebar={{
    title: 'Dashboard ou nome so evento grande', component: <MeuComponente/>, sidebarCompact: false
  }}>
    <div className="row">
      <div className="col-12">
        <h1 className="page-title">Hummm</h1>

        <div style={{width: 300, height: 1200, backgroundColor: 'blue', margin: '2rem auto'}}/>
      </div>
    </div>
  </MainLayout>)
}


export default Dashboard
