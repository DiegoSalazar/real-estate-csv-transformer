import CsvFile from './CsvFile'
import ColumnMap from './ColumnMap'

export default class CsvTransformer {
  file: File
  reader: FileReader
  result: string

  constructor (file: File) {
    this.file = file
    this.reader = new FileReader()
    this.result = ''
  }

  transform () {
    this.reader.readAsText(this.file)

    this.reader.onload = () => {
      this.result = this.reader.result?.toString() || ''
      if (!this.result) throw new Error('Failed to transform file')

      this.triggerDownload()
    }
  }

  triggerDownload () {
    const csv = new CsvFile(this.result)
    console.log({ csv })
  }
}
