class Bus {
  constructor() {
    this.events = new Map();
    // 当前事件栈的调用深度
    this.depth = 0;
    // 保存是否是当前的独立事件栈
    this.isContinue = false;
  }
  addEvent(type, func, isOnce) {
    const value = this.events.has(type)
      ? this.events.get(type)
      : this.events.set(type, new Map()).get(type);
    const self = this;
    function newFunc(...args) {
      // 当前不是独立的事件调用栈
      self.isContinue = true;
      func.call(self, ...args);
      // 如果是只监听一次，则取消监听
      if (isOnce) {
        self.off(type, func);
      }
    }
    newFunc.newName = func.name;
    value.set(func, newFunc);
  }
  // 监听事件
  listen(type, func) {
    this.addEvent(type, func, false);
  }
  // 监听一次
  once(type, func) {
    this.addEvent(type, func, true);
  }
  // 卸载监听
  off(type, func) {
    if (this.events.has(type)) {
      this.events.get(type).delete(func);
    }
  }
  // 事件触发
  trigger(type, ...args) {
    if (!this.events.has(type)) {
      console.error(`未绑定${type}事件`);
    }
    // 设置当前事件调用栈的深度
    if (!this.isContinue) {
      this.depth = 0;
    } else {
      this.depth += 2;
    }
    // 打印event事件
    const strEvent = Array.from({ length: this.depth * 2 }, () => "-").join("");
    console.log(`${strEvent}event:${type}`);
    for (let value of this.events.get(type).values()) {
      // 打印callback事件
      const strCallback = Array.from(
        { length: (this.depth + 1) * 2 },
        () => "-"
      ).join("");
      console.log(`${strCallback}callback:${value.newName}`);
      value(...args);
    }
    this.depth++;
    this.isContinue = false;
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
bus.once("testEvent", (...argv) => {
  console.log("callbak once", ...argv);
});
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
