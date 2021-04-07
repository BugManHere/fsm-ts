const weightArr = [2, 2, 6, 5, 4];
const valArr = [6, 3, 5, 4, 6];

const backpack = (w, weightArr, valArr) => {
  // 物品数量，从0开始
  let n = weightArr.length;
  // 保存结果的二维数组
  let tmpArr = Array.from({ length: n }).map(() => new Array(w + 1));
  tmpArr[-1] = new Array(w + 1).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= w; j++) {
      if (j < weightArr[i]) {
        tmpArr[i][j] = tmpArr[i - 1][j];
      } else {
        tmpArr[i][j] = Math.max(tmpArr[i - 1][j], tmpArr[i - 1][j - weightArr[i]] + valArr[i]);
      }
    }
  }
  return tmpArr;
};

console.log(backpack(10, weightArr, valArr));
