let str1 = "(2, 1), (2, 3), (1, 3)";
let str2 =
  "(1, 2), (5, 3), (3, 1), (1, 2), (2, 4), (1, 6), (2, 3), (3, 4), (5, 6)";
let str3 = "(4, 1), (1, 2), (2, 3)";

function dominoes(str) {
  const arr = toArray(str);
  const flagArr = Array.from({ length: arr.length }, () => false);
  flagArr[0] = true;
  const res = [];
  backtack(arr, [{ num: arr[0], index: 0 }], flagArr, res);
  const data = res.pop();
  const source = [];
  for (let value of data) {
    source.push(value.num);
  }
  // 判断多米诺骨牌首项和最后一项是否能链接起来，如果不可以，则返回false
  if(source[0][0]!==source[source.length-1][1]){
      return false
  }
  return source;
}
// 回溯算法
function backtack(arr, ans, flagArr, res) {
  // 路径选择和数组长度一致时，说明满足要求，放入结果中
  if (ans.length === arr.length) {
    res.push([...ans]);
    return;
  }
  // 查找数组中没有被选择的值
  const filterArr = arr.filter((item, index) => flagArr[index] == false).flat();
  // 如果没有被选择的值中，没有最后一项的末尾数字，证明该路径无解，则返回
  if (!filterArr.includes(ans[ans.length - 1].num[1])) {
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    // 如果已经被选择，则跳过
    if (flagArr[i]) {
      continue;
    }
    const last = ans[ans.length - 1].num;
    const cur = arr[i];
    // 判断当前选项是否能够放在该路径后面，进行选择
    if (cur[0] === last[1]) {
      ans.push({ num: cur, index: i });
      flagArr[i] = true;
    } else if (cur[1] === last[1]) {
      ans.push({ num: [cur[1], cur[0]], index: i });
      flagArr[i] = true;
    } else {
      continue;
    }
    backtack(arr, ans, flagArr, res);
    if (ans.length === 1) {
      continue;
    }
    // 撤回选择
    const popItem = ans.pop();
    flagArr[popItem.index] = false;
  }
}

function toArray(str) {
  const res = [];
  const arr = str.match(/[0-9]/g);
  for (let index in arr) {
    if (index % 2 !== 0) {
      res.push([parseInt(arr[index - 1]), parseInt(arr[index])]);
    }
  }
  return res;
}
console.log(dominoes(str1))
console.log(dominoes(str2))
console.log(dominoes(str3))
