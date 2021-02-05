export default class CsvFile {
  data: string
  headers: Array<string>
  rows: Array<Array<string>>

  constructor (data: string) {
    this.data = data
    this.headers = []
    this.rows = []
    this.parse()
  }

  parse () {
    this.rows = this.parseRows()
    this.headers = this.rows.shift() || []
  }

  parseRows () {
    const rows = this.data.split(/\n\r?/)
    return rows.map(row => this.parseRow(row))
  }

  parseRow (row: string) {
    const cells = row.split(',')
    return cells.map(cell => cell.trim())
  }
}
