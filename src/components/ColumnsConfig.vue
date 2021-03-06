<template>
  <div class="columns-config">
    <base-button @click="onClickConfig">
      <custom-icon icon="cog" />
      Config
    </base-button>
    <div v-if="showConfig" class="filters">
      <div class="filters-options">
        <div class="option" v-for="column in columnsInfo" :key="column.key">
          <input type="checkbox" :name="column.name" :id="column.key" :value="column.key" v-model="column.checked" />
          <label :for="column.key">{{ column.name }}</label>
        </div>
      </div>
      <div class="filters-buttons">
        <base-button class="button" @click="onSave">Save</base-button>
        <base-button class="button" @click="onClickConfig">Cancel</base-button>
        <base-button class="button" @click="onReset">Reset</base-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import * as Utils from '../utils';

export default {
  props: ['columnsShown'],
  components: {
    BaseButton,
  },
  inject: ['columnsMap', 'persistedFields', 'onFilterChange', 'uniqueLocalStorageKey'],
  data() {
    return {
      showConfig: false,
      columnsInfo: [],
    };
  },
  watch: {
    columnsShown() {
      this.columnsInfo = this.updateColumnsInfo();
    },
  },
  methods: {
    updateColumnsInfo() {
      const columnsFromLocalStorage = Utils.getItemFromLocalStorage(`filters${this.uniqueLocalStorageKey}.columns`, []);
      return Object.keys(this.columnsMap).map((columnKey) => ({
        key: columnKey,
        name: this.columnsMap[columnKey],
        checked: Utils.shouldPersistedFieldBeIncluded.bind(this)(columnKey, columnsFromLocalStorage),
      }));
    },
    onReset() {
      this.columnsInfo = Object.keys(this.columnsMap).map((columnKey) => ({
        key: columnKey,
        name: this.columnsMap[columnKey],
        checked: true,
      }));
      this.onSave();
    },
    onClickConfig() {
      this.showConfig = !this.showConfig;
    },
    onSave() {
      const filteredColumns = this.columnsInfo.filter((column) => column.checked).map((column) => column.key);
      this.showConfig = false;
      this.onFilterChange('columns', filteredColumns);
    },
  },
};
</script>

<style lang="scss" scoped>
.columns-config {
  position: relative;
  display: inline-block;
}

.filters {
  background-color: white;
  border: 1px solid black;
  position: absolute;
  padding: 1rem;
  z-index: 2;
  right: 0;
}

.filters-options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filters-buttons {
  display: flex;
}

.option {
  padding: 4px 0;
}

.button {
  padding: 4px 16px;
  color: white;
  background-color: #5c99b7;
  border: none;
}
</style>
