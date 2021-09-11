function toTree(arr) {
  const res = [];
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    map.set(arr[i].id, arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].parentId) {
      res.push(arr[i]);
    } else {
      pid = arr[i].parentId;
      if (!map.has(pid)) {
        throw new Error('错误输入:父节点不存在')
      }
      children = map.get(pid).children ? map.get(pid).children : [];
      children.push(arr[i]);
      map.get(pid).children = children;
    }
  }
  return res;
}
toTree([
  { id: 1, name: "i1" },
  { id: 2, name: "i2", parentId: 1 },
  { id: 4, name: "i4", parentId: 3 },
  { id: 3, name: "i3", parentId: 2 },
  { id: 8, name: "i8", parentId: 2 },
]);
