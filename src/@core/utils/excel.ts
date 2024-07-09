import ExcelJS from 'exceljs'
import toast from "react-hot-toast";

export const utDownloadExcelFile = async (data: any = [], fileName: string, fieldsToRemove: string[] = []) => {
  if (data.length === 0) {
    return  toast.error('No data to export')
  }

  const filterData = data.map((item: any) => {
    fieldsToRemove.forEach((field: string) => {
      delete item[field]
    })

    return item
  })
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')
  const headerRow = worksheet.addRow(Object?.keys(filterData[0]))
  headerRow.eachCell(cell => {
    cell.font = { bold: true }
  })
  worksheet.columns.forEach(column => {
    column.width = 16
  })
  filterData.forEach((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
    const values = Object.values(row)
    worksheet.addRow(values)
  })
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.xlsx`
  a.click()
}
