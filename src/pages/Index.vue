<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="flat bordered">
      <q-card-section>
        <q-input
          @input="val => { files = val }"
          multiple
          filled
          type="file"
          hint="Upload multiple CSV files"
        />
      </q-card-section>

      <q-card-section>
        <ol>
          <li v-for="(file, i) in files" :key="i">
            {{ file.name }}
          </li>
        </ol>
      </q-card-section>

      <q-separator dark />

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="transform"
          label="Transform"
          @click="transform"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import CsvTransformer from '../components/CsvTransformer'

export default defineComponent({
  name: 'PageIndex',
  components: {},
  setup () {
    const files = ref([])
    // const fileReaders = ref([])

    const transform = () => {
      const fs: Array<File> = Array.from(files.value)

      fs.forEach(f => {
        new CsvTransformer(f).transform()
      })
    }

    return {
      files,
      // fileReaders,
      transform
    }
  }
})
</script>
