<template>
  <v-card data-cy="c-properties">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Properties</h2>
        </v-col>
      </v-row>
      <v-row v-for="row in entries" :key="row.index">
        <v-col cols="6" md="4">
          <v-text-field
            label="Name"
            placeholder="Name"
            v-model="row.name"
            v-on:input="entriesChanged"
            :dense="true"
            :rules="[required,validCharacters]"
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="8">
          <v-text-field
            label="Value"
            placeholder="Vaue"
            v-model="row.value"
            v-on:input="entriesChanged"
            :dense="true"
          >
            <template v-slot:append-outer>
              <v-icon color="#E53935" @click.prevent="deleteRow(row)">fas fa-times-circle</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-right">
          <v-icon color="#66BB6A" @click.prevent="addRow">fas fa-plus-circle</v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { productPropertyRegex } from '../types/product';

export type NameValue = {
  name: string;
  value: string;
  index: number;
}

export type PropertiesData = {
  entries: NameValue[];
}

export default Vue.extend({

  data() {
    return {
      entries: []
    } as PropertiesData;
  },

  props: {
    value: {
      type: Object,
      required: true
    },
    valid: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    this.computeEntries(this.value);
  },

  watch: {

    value: {
      handler(newVal: Record<string, string>) {
        this.computeEntries(newVal);
      },
      deep: true
    }

  },

  methods: {

    computeEntries(val: Record<string, string>) {
      this.entries = Object.entries(val || {}).map((e, i) => {
        const row: NameValue = {
          name: e[0],
          value: e[1],
          index: i
        };
        return row;
      });
    },

    computeValue() {
      // map NameValue to Object entries
      const entries = this.entries.map(r => [r.name, r.value || '']);
      // map back to object
      return Object.fromEntries(entries);
    },

    computeValid() {
      const invalidRows = this.entries.filter(row => {
        // returns true or string message, so compare to true
        const required = this.required(row.name) === true;
        const validChars = this.validCharacters(row.name) === true;
        return !required || !validChars;
      });
      return invalidRows.length === 0;
    },

    deleteRow(row: NameValue) {
      this.entries = this.entries.filter(r => r.index !== row.index);
      this.entriesChanged();
    },

    addRow() {
      const maxIndex = Math.max(...this.entries.map(r => r.index), 0);
      const addRow: NameValue = {
        name: '',
        value: '',
        index: maxIndex + 1
      };
      this.entries.push(addRow);
      // don't tell parent value changed yet -- it would delete the row
      this.$emit('update:valid', false);
    },

    entriesChanged() {
      this.$emit('input', this.computeValue());
      this.$emit('update:valid', this.computeValid());
    },

    required(val: string): boolean | string {
      return !!val || 'Required';
    },

    validCharacters(val: string): boolean | string {
      return productPropertyRegex.test(val || '') || 'Use only a-z, 0-9, -, and space';
    }

  }

});
</script>
