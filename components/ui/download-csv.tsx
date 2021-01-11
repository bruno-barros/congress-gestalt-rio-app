import {CSVLink} from "react-csv";
import moment from "moment";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";

interface DownloadProps {
  data: any
  fileBaseName: string
  loading: boolean
}

export default function DownloadCsv(props: DownloadProps) {

  const {data, fileBaseName, loading} = props
  const [downloaded, setDownloaded] = useState(false)
  const [name, setName] = useState('')

  let id = `export-${fileBaseName}-button`

  useEffect(() => {

    if (loading) {
      setName(`${fileBaseName}_${moment().format('DD-MM-YYYY_H-mm-ss')}.csv`)
      setDownloaded(false)
      showLoading()
    }
    if (!loading && !downloaded) {
      if (!data || data.length === 0) {
        showError()
      } else {
        showDownload()
      }
    }

  }, [loading])

  function showLoading() {
    Swal.fire({
      icon: 'warning',
      title: 'Gerando planilha...',
      confirmButtonText: '...',
    })
  }

  function showError() {
    Swal.fire({
      icon: 'error',
      title: 'Houve um erro ao gerar dados',
      confirmButtonText: 'Fechar',
    })
  }

  function showDownload() {
    Swal.update({
      icon: 'success',
      title: 'Pronto!',
      showConfirmButton: true,
      confirmButtonText: 'BAIXAR',
      didClose(): void {
        let ele: HTMLElement = document.querySelector(`#${id}`)
        if(ele) ele.click()
        setDownloaded(true)
      }
    })
  }


  return (<>
    <CSVLink id={id} data={data} filename={name} target="_blank" className="d-none" separator={";"}/>
  </>)
}
