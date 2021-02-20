import CsvFile from './CsvFile'
import { ColumnMap } from './ColumnMap'
import { CsvTransformation } from './models'

export default class CsvTransformer {
  transformation: CsvTransformation
  reader: FileReader
  fileContent: string
  csvFile: CsvFile
  targetHeaders: Array<string>
  maxCols: number

  constructor (transformation: CsvTransformation) {
    this.transformation = transformation
    this.reader = new FileReader()
    this.fileContent = ''
    this.csvFile = new CsvFile('')
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
    return new Promise((resolve, reject) => {
      if (!file) return reject()

      this.reader.onload = () => {
        this.fileContent = this.reader.result?.toString() || ''
        if (!this.fileContent) throw new Error('Failed to transform file')

        this.csvFile = new CsvFile(this.fileContent)
        this.transformation.input = this.csvFile
        this.transformCsvFile()

        resolve(this.transformation)
      }
      this.reader.readAsText(file)
    })
  }

  transformCsvFile () {
    // this.transformation.output += `${this.targetHeaders.join(',')}\n`
    this.transformation.output.headers = this.targetHeaders

    this.csvFile.rows.forEach((row, i) => {
      const transformedRow = this.transformRow(row)
      // this.transformation.output += `${transformedRow.join(',')}\n`
      this.transformation.output.rows[i] = transformedRow
    })
  }

  triggerDownload (file: File) {
    const baseFileName = file.name.replace('.csv', '')
    const tempEl = document.createElement('a')
    const csvContent = this.outputCsvContent()
    const encoded = encodeURI(csvContent)

    tempEl.href = `data:text/csv;charset=utf-8,${encoded}`
    tempEl.download = `${baseFileName}-transformed.csv`
    tempEl.click()
  }

  outputCsvContent() {
    const output = this.transformation.output
    const rows = [output.headers, ...output.rows]

    return rows.map((row) => row.join(',')).join('\n')
  }

  transformRow (row: string[]) {
    const address = row[ColumnMap.A]
    const city = row[ColumnMap.B]
    const ownersPhones = (row[ColumnMap.D] || '').split(';')
    const emails = (row[ColumnMap.E] || '').split(';')
    const email = emails[0]
    const propShark = row[ColumnMap.F]
    const ownerName = row[ColumnMap.C] || ''
    let ownersPhone = ownersPhones[0]

    let firstName = ''
    let lastName = ''
    let description = ''
    let extraPhones: Array<string> = []
    let extraEmails: Array<string> = []

    if (ownerName.includes(',')) {
      let nameParts = ownerName.split(/,\s?/g)
      lastName = nameParts.shift() || ''
      firstName = nameParts.join(' ')
    } else {
      const nameParts = ownerName.split(' ')
      lastName = nameParts.pop() || ''
      firstName = nameParts.join(' ')
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
