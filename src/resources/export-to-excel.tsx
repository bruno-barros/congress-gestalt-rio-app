
export function exportHTMLToExcel(tableId: string, html: any) {
  let el = document.createElement('div')
  el.innerHTML = html
  document.body.appendChild(el)
  exportToExcel(tableId)
}


export default function exportToExcel(tableId: string) {
  let tableData = document.getElementById(tableId).outerHTML;

  //enable this if u dont want images in your table
  tableData = tableData.replace(/<img[^>]*>/gi, "");
  //remove if u want links in your table
  tableData = tableData.replace(/<A[^>]*>|<\/A>/g, "");
  //remove input params
  tableData = tableData.replace(/<input[^>]*>|<\/input>/gi, "");


  //click a hidden link to which will prompt for download.
  let a = document.createElement('a')
  a.href = `data:application/vnd.ms-excel;base64, ${base64(tableData)}`
  a.download = `${tableId}_${datetime()}.xls`
  a.click()
}

function datetime() {
  let date = new Date()
  let month = `0${date.getMonth() + 1}`.substring(-1, 2);
  let day = `0${date.getDate()}`.substring(-1, 2);
  let dateTime = `${date.getFullYear()}-${month}-${day}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`

  return dateTime
}

function base64(s) {
  return window.btoa(unescape(encodeURIComponent(pre()+s+pos())))
}


function pre() {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`
}

function pos() {
  return `</body></html>`
}
