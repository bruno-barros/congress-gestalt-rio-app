'use client';
import { useRouter } from "next/router";
import { dump } from "../../src/helpers";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import useActivity from "../../components/hooks/activities/useActivity";
import s from './qrcode.module.scss';

export default function QrCodePage() {
  const router = useRouter();
  const { id, uuid, context = "checkin" } = router.query;
  const {data: activity } = useActivity(Number(id));

  function buildUrl(){
    if(typeof window === 'undefined'){
      return '';
    }
    let url = []
    url.push(window.location.origin);
    url.push(`/checkin?`)
    url.push(`id=${uuid}`);

    return url.join("");
  }

  function QRCodeGenerator({ url, width = 600 }) {
    const qrRef = useRef(null!);

    const downloadQRCode = () => {
      const canvas = qrRef.current.querySelector("canvas");
      const url = canvas.toDataURL("image/jpeg", 1.0); // Alta qualidade
      const link = document.createElement("a");
      link.href = url;
      link.download = `${uuid}.jpeg`; // Nome do arquivo
      link.click();
    };

    return (
      <div style={{textAlign: 'center'}}>

        <div ref={qrRef}>
          <QRCodeCanvas
            value={url}
            size={width} // Tamanho do QR Code
            level={"H"} // Alta correção de erros
            className={s.canvas}
            marginSize={4} // Margem ao redor do QR Code
          />
        </div>
        <button onClick={downloadQRCode} className={`${s.noprint} btn btn-sm btn-outline-secondary`} >Baixar QR Code</button>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div style={{padding: '10px 40px'}}>
        
        <div className={s.label}>ATIVIDADE</div>
        <div>{activity?.title}</div>
        
        
        </div>
      <QRCodeGenerator width={1200} url={buildUrl()} />
      {/* {dump({ assa: buildUrl()})} */}
    </div>
  );
}
