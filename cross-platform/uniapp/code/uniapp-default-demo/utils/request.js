export default {
	http(params) {
		// 准备参数
		let url = params.url,
				method = params.method,
				data = params.data || {},
				header = params.header || {},
				hideLoading = params.hideLoading || false;
				
		// 请求方式：GET或POST（如果是POST则需要进行配置）
		if (method) {
			method = method.toUpperCase()
			if(method == 'POST') {
				header = {
					"content-type": "application/x-www-form-urlencoded"
				}
			}
		}
		// 请求动画
		if (!hideLoading) {
			// 显示加载的动画
			uni.showLoading({
				title: '加载中...',
			});
		}
		return new Promise((resolve, reject) => {
			// 发起请求
			uni.request({
				url: url,
				method: method || 'GET',
				data: data,
				header: header,
				success: res => {
					// 判断请求的api格式是否正确
					if(res.statusCode && res.statusCode != 200) {
						// 弹窗提示出错
						uni.showModal({
							content: 'api错误,' + res.errMsg,
							showCancel: false,
						});
						return
					}
					resolve(res.data)
				},
				fail: error => {
					uni.showModal({
						content: '请求失败,' + error.errMsg,
						showCancel: false,
					});
					reject(error.errMsg)
				},
				complete: () => {
					// 请求完成
					uni.hideLoading()
					resolve()
					return
				}
			});
		})
	}
}