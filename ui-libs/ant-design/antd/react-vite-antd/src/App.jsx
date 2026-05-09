import { useState } from 'react'
import { Button, Card, Input, List, Avatar, Badge, Space, Switch, Slider, Progress } from 'antd'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [checked, setChecked] = useState(true)
  const [value, setValue] = useState(30)

  const data = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Ant Design Demo</h1>

      {/* 按钮示例 */}
      <Card title="按钮组件" style={{ marginBottom: '20px' }}>
        <Space wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文字按钮</Button>
          <Button danger>危险按钮</Button>
          <Button type="primary" onClick={() => setCount(c => c + 1)}>
            点击次数: {count}
          </Button>
        </Space>
      </Card>

      {/* 输入框示例 */}
      <Card title="输入框组件" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Input placeholder="请输入内容" />
          <Input placeholder="请输入邮箱" />
          <Input disabled placeholder="禁用状态" />
        </Space>
      </Card>

      {/* 列表示例 */}
      <Card title="列表组件" style={{ marginBottom: '20px' }}>
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar>{item.name[0]}</Avatar>}
                title={item.name}
                description={item.email}
              />
              <Badge status="success" />
            </List.Item>
          )}
        />
      </Card>

      {/* 其他组件 */}
      <Card title="其他组件">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <span style={{ marginRight: '10px' }}>开关: </span>
            <Switch checked={checked} onChange={setChecked} />
            <span style={{ marginLeft: '10px' }}>{checked ? '开启' : '关闭'}</span>
          </div>
          
          <div>
            <span style={{ marginRight: '10px' }}>滑块: {value}</span>
            <Slider value={value} onChange={setValue} />
          </div>

          <div>
            <span style={{ marginRight: '10px' }}>进度条:</span>
            <Progress percent={75} status="active" />
          </div>

          <Space>
            <Badge count={5}>
              <Button>通知</Button>
            </Badge>
            <Badge dot>
              <Button>消息</Button>
            </Badge>
          </Space>
        </Space>
      </Card>
    </div>
  )
}

export default App
