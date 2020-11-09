<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    console.log(window.location.pathname)
    const pathname = window.location.pathname
    if (pathname === '/' || pathname === '') {
      window.location.href = '/app-common'
    }
  }
}
</script>
