class Bus {
  constructor() {
    this.events = new Map();
    // 保存是否是当前的独立事件栈
    this.isContinue = false;
    // 保存事件调用栈
    this.stack = [];
  }
  // 监听事件
  listen(type, func) {
    const value = this.events.has(type)
      ? this.events.get(type)
      : this.events.set(type, new Map()).get(type);
    const self = this;
    value.set(func, func.bind(self));
  }
  // 卸载监听
  off(type, func) {
    if (this.events.has(type)) {
      this.events.get(type).delete(func);
    }
    this.stack.forEach((item) => {
      if (type === item.type) {
        const index = item.callback.indexOf(`bound ${func.name}`);
        item.callback.splice(index, 1);
      }
    });
  }
  // 事件触发
  trigger(type, ...args) {
    if (!this.events.has(type)) {
      console.error(`未绑定${type}事件`);
    }
    // 设置当前事件调用栈的深度
    let depth;
    let callbakArrays = [];
    let flag = this.stack.some((item, index) => {
      callbakArrays = item.callback;
      depth = 2 * index;
      return item.type === type;
    });
    if (!flag) {
      callbakArrays = [];
      this.stack.push({ type, callback: callbakArrays });
      depth = 2 * (this.stack.length - 1);
    }
    const strEvent = Array.from({ length: depth * 2 }, () => "-").join("");
    console.log(`${strEvent}event:${type}`);
    // 打印event事件
    for (let value of this.events.get(type).values()) {
      if (callbakArrays.indexOf(value.name) === -1) {
        callbakArrays.push(value.name);
      }
      const strCallback = Array.from(
        { length: (depth + 1) * 2 },
        () => "-"
      ).join("");
      console.log(`${strCallback}callback:${value.name.slice(5)}`);
      value(...args);
    }
    this.depth++;
    console.log(this.stack);
  }
}
// 难度1
const bus = new Bus();
const fn1 = (...argv) => {
  console.log("event callback1", ...argv);
};
const fn2 = (...argv) => {
  console.log("event callback2", ...argv);
};
bus.listen("testEvent", fn1);
bus.listen("testEvent", fn2);
bus.trigger("testEvent", 1, 2);
// event callback1 1 2
// event callback2 1 2
bus.off("testEvent", fn1);
bus.trigger("testEvent", 3, 4);
// event callback2 3 4
// callbak once 3 4
bus.trigger("testEvent", 5, 6);
// event callback2 5 6

// 难度2
bus.listen("testEvent", function callback1() {
  // do something
  this.trigger("testEvent2");
});

bus.listen("testEvent2", function callback2() {
  // do something
});

bus.trigger("testEvent");
// event:testEvent
// --callback:callback1
// ----event:testEvent2
// ------callback:callback2
bus.trigger("testEvent");
// event:testEvent
// --callback:callback1
// ----event:testEvent2
// ------callback:callback2
