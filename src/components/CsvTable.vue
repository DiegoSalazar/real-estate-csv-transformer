<template>
  <q-table
    style="width: 100%"
    :title="title"
    :columns="columns"
    :data="data"
    :pagination="{ rowsPerPage: 4 }"
  >
    <template v-slot:top>
      <div class="col-2 q-table__title">{{ title }}</div>
      <q-btn
        v-if="showDownload"
        color="secondary"
        icon="download"
        label="Download"
        @click="download"
      />
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { CsvHeaders } from './models'

export default defineComponent({
  props: {
    showDownload: { type: Boolean },
    title: {
      type: String,
      required: true
    },
    csvHeaders: {
      type: Array,
      required: true
    },
    csvRows: {
      type: Array,
      required: true
    }
  },
  setup(props, context) {
    const headers = <string[]>props.csvHeaders
    const rows = <string[][]>props.csvRows

    const columns = headers.map(header => {
      return {
        name: header,
        label: header,
        required: true,
        sortable: true,
        align: 'left',
        field: (row: CsvHeaders) => row[header]
      }
    })
    const data = rows.reduce((arr: CsvHeaders[], row) => {
      const rowData = <CsvHeaders>{}
      const tableRow = headers.map((header: string, i) => {
        rowData[header] = (row[i] || '').replace(/"/g, '')
        return rowData
      })
      return arr.concat(tableRow)
    }, [])

    return {
      download: () => context.emit('download'),
      columns,
      data
    }
  }
})
</script>
