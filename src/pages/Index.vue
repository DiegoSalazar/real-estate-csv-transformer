<template>
  <q-page class="">
    <div class="row">
      <div class="col">
        <q-card class="flat bordered">
          <q-card-section>
            <q-input
              @input="val => { file.f = val }"
              filled
              counter
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
      <div class="col"></div>
      <div class="col"></div>
    </div>
    <div class="row">
      <div class="col">
        {{ submittedCsv.transformedContent }}
      </div>
      <div class="col">
        <!-- {{ transformedCsv }} -->
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import CsvTransformer from '../components/CsvTransformer'

export default defineComponent({
  components: {},
  setup () {
    const file = reactive({ f: null, content: 'Loading...' })
    const submittedCsv = reactive({ transformedContent: 'Loading Content...' })

    const transform = () => {
      const f = file.f[0]
      new CsvTransformer(submittedCsv).transform(f)
    }

    return {
      file,
      transform,
      submittedCsv
    }
  }
})
</script>
