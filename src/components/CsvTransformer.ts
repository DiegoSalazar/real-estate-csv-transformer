import CsvFile from './CsvFile'
import { ColumnMap } from './ColumnMap'
import { TransformedCsv } from './models'

export default class CsvTransformer {
  output: TransformedCsv
  reader: FileReader
  fileContent: string
  transformedContent: string
  targetHeaders: Array<string>
  maxCols: number

  constructor (output: TransformedCsv) {
    this.output = output
    this.reader = new FileReader()
    this.fileContent = ''
    this.transformedContent = ''
    this.targetHeaders = [
      'First Name',
      'Last Name',
      'Email',
      'Mobile',
      'CS Lead Owner',
      'Pulled By',
      'Description',
      'Topics to Insert'
    ]
    this.maxCols = this.targetHeaders.length
  }

  transform (file: File) {
    if (!file) return
    this.reader.readAsText(file)

    this.reader.onload = () => {
      this.fileContent = this.reader.result?.toString() || ''
      if (!this.fileContent) throw new Error('Failed to transform file')

      this.transformCsvFile()
      this.output.transformedContent = this.transformedContent
    }
  }

  display () {
    this.output.transformedContent = this.transformedContent
  }

  transformCsvFile () {
    const csv = new CsvFile(this.fileContent)
    this.transformedContent += `${this.targetHeaders.join(',')}\n`

    csv.rows.forEach(row => {
      const transformedRow = this.transformRow(row)
      this.transformedContent += `${transformedRow.join(',')}\n`
    })
  }

  triggerDownload (file: File) {
    const baseFileName = file.name.replace('.csv', '')
    const tempEl = document.createElement('a')
    const csvContent = encodeURI(this.transformedContent)

    tempEl.href = `data:text/csv;charset=utf-8,${csvContent}`
    tempEl.download = `${baseFileName}-transformed.csv`
    tempEl.click()
  }

  transformRow (row: Array<string>) {
    const address = row[ColumnMap.A]
    const city = row[ColumnMap.B]
    const ownerName = row[ColumnMap.C]
    const ownersPhones = row[ColumnMap.D].toString().split(';')
    const emails = row[ColumnMap.E].toString().split(';')
    const propShark = row[ColumnMap.F]

    const email = emails[0]
    let ownersPhone = ownersPhones[0]
    let nameParts = ownerName.split(',')

    let firstName = ''
    let lastName = ''
    let description = ''
    let extraPhones: Array<string> = []
    let extraEmails: Array<string> = []

    if (ownerName.includes(',')) {
      firstName = nameParts[1]
      lastName = nameParts[0]
    } else {
      nameParts = nameParts[0].split(' ')
      firstName = nameParts[0]
      lastName = nameParts[1]
    }

    if (ownersPhones.length > 1) {
      ownersPhone = ownersPhones[0]
      extraPhones = ownersPhones
        .slice(1, ownersPhones.length)
        .map(p => p.trim())
    }

    if (emails.length) {
      extraEmails = emails
        .slice(1, emails.length)
        .map(e => e.trim())
    }

    description += address
    description += `\n${city}`
    if (extraPhones.length) description += `\n${extraPhones.join('\n')}`
    if (extraEmails.length) description += `\n${extraEmails.join('\n')}`
    description += `\n${propShark}`

    const transformedRow = []
    transformedRow[ColumnMap.A] = `"${firstName}"`
    transformedRow[ColumnMap.B] = `"${lastName}"`
    transformedRow[ColumnMap.C] = `"${email}"`
    transformedRow[ColumnMap.D] = `"${ownersPhone}"`
    transformedRow[ColumnMap.G] = `"${description}"`
    transformedRow[ColumnMap.H] = `"${city}\nLandlord list"`

    return transformedRow
  }
}
