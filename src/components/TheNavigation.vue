<template>
  <div id="nav">
    <router-link to="/deals">Deals</router-link> |
    <router-link to="/documents">Documents</router-link>
  </div>
</template>

<style lang="scss" scoped>
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    cursor: pointer;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #5c99b7;
    }
  }
}
</style>
