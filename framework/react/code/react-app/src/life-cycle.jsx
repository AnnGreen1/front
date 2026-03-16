import React, { Component } from "react";

class LifeCycle extends Component {
  constructor(props) {
    console.log("constructor props", props);
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>现在是 {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

export default LifeCycle;
