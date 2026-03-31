<script>
export default {
    render: function (createElement) {
        return createElement(
            'h1',
            {
                style: {
                    color: 'hotpink'
                },
                domProps:{
                    innerHTML:'render function 与 template 在一个单文件组件中不能同时使用！'
                }
            }
        )
    }
}
</script>

<style lang="scss" scoped></style>