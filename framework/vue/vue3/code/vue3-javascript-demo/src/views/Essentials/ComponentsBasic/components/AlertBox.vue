<template>
    <div>
        <div class="demo-item">
            <div class="alert-box">
                <strong>This is an Error for Demo Purposes</strong>
                <slot />
            </div>
        </div>
    </div>

</template>
  
<style scoped>
.alert-box {
    /* ... */
}
</style>