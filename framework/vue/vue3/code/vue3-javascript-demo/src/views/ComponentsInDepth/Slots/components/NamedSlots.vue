<template>
    <div class="container">
        <header>
            <!-- 标题内容放这里 -->
            <slot name="header" />
        </header>
        <main>
            <!-- 主要内容放这里 -->
            <!-- 隐式的默认插槽 -->
            <p>A paragraph for the main content.</p>
            <p>And another one.</p>
        </main>
        <footer>
            <!-- 底部内容放这里 -->
            <slot name="footer" />
        </footer>
    </div>
</template>