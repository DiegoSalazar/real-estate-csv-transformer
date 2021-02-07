import CsvFile from './CsvFile'

export interface CsvTransformation {
  input: CsvFile
  output: CsvFile
}

export type CsvHeaders = PropSharkHeaders | TransformedHeaders

interface PropSharkHeaders {
  [key: string]: string
  'Address': string
  'City': string
  'Owner Name for Mailing': string
  "Owner's Phones": string
  "Owner's Email": string
  'See property report': string
}

interface TransformedHeaders {
  [key: string]: string
  'First Name': string
  'Last Name': string
  'Email': string
  'Mobile': string
  'CS Lead Owner': string
  'Pulled By': string
  'Description': string
  'Topics to Insert': string
}
