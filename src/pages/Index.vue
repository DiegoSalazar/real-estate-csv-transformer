<template>
  <q-page class="">
    <div class="row">
      <div class="col">
        <q-card class="flat bordered">
          <q-card-section>
            <q-input
              @input="val => { file.f = val; ready = false }"
              filled
              type="file"
              hint="Only PropertyShark CSV files are currently supported."
            />
          </q-card-section>

          <q-card-section>
            {{ file && file.name }}
          </q-card-section>

          <q-separator dark />

          <q-card-actions align="right">
            <q-btn
              @click="transform" color="primary" icon="transform" label="Transform"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row">
      <CsvTable
        v-if="ready"
        title="Transformed"
        :csvHeaders="transformation.output.headers"
        :csvRows="transformation.output.rows"
        :show-download="true"
        @download="download"
      />
    </div>
    <div class="row">
      <CsvTable
        v-if="ready"
        title="Original"
        :csvHeaders="transformation.input.headers"
        :csvRows="transformation.input.rows"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api'
import CsvTransformer from '../components/CsvTransformer'
import CsvTable from '../components/CsvTable.vue'
import { CsvTransformation } from '../components/models'
import CsvFile from '../components/CsvFile'

export default defineComponent({
  components: { CsvTable },
  setup () {
    const file = reactive({ f: [], content: 'Loading...' })
    const ready = ref(false)
    const transformation = reactive(<CsvTransformation>{
      input: new CsvFile(''),
      output: new CsvFile('')
    })
    let transformer: CsvTransformer

    const transform = async () => {
      ready.value = false
      const f = file.f[0]
      transformer = new CsvTransformer(transformation)
      await transformer.transform(f)
      ready.value = true
    }

    return {
      file,
      ready,
      transform,
      transformation,
      download: () => transformer.triggerDownload(file.f[0])
    }
  }
})
</script>
