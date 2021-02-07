export default class CsvFile {
  data: string
  headers: string[]
  rows: string[][]

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
    const cells = this.splitQuotedRow(row)
    return cells.map(cell => cell.trim().replace(/"/g, ''))
  }

  splitQuotedRow (line: string) {
    if (line.indexOf('"') < 0) return line.split(',')

    const result = []
    let cell = ''
    let quote = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"' && line[i + 1] === '"') {
        cell += char; i++
      } else if (char === '"') {
        quote = !quote
      } else if (!quote && char === ',') {
        result.push(cell)
        cell = ''
      } else {
        cell += char
      }

      if (i === line.length - 1 && cell) result.push(cell)
    }
    return result
  }
}
