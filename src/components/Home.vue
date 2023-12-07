<template>
  <div class="homebody">
    <header>
      <img src="../../public/icons/Logo.svg" alt="Logo" id="logo" />
      <h1>生存战争中文社区</h1>
    </header>

    <div id="main-content">
      <p>描述描述描述描述描述描述描述描述描述描述描述描述</p>

      <router-link to="/cate/0" class="enter-btn">进入页面</router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>

<style scoped>
.homebody {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom right, #ace6fc, #2c82c9);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

header {
  background-color: #ace6fc88;
  color: #000000dd;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 3px solid #0a3c5f66;
  margin-bottom: 20px;
}

img {
  opacity: 0.8;
}

#logo {
  width: 100px; /* 适应你的logo尺寸 */
  height: 100px;
  margin-bottom: 20px;
}

#main-content {
  margin: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.enter-btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}
</style>
