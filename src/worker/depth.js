function setDepth(update, depthData, depthName) {
  update.forEach((element) => {
    let newElem = [+element[0], +element[1]];

    let start = 0;
    let end = depthData[depthName].length - 1;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);

      if (newElem[0] === +depthData[depthName][mid][0]) {
        if (!newElem[1]) {
          depthData[depthName].splice(mid, 1);
        } else {
          depthData[depthName][mid] = newElem;
        }

        break;
      }

      if (newElem[1]) {
        // const priceDiff = depthName === "bids" ? 10 : 5;
        if (mid === 0 && newElem[0] < +depthData[depthName][mid][0]) {
          // console.log("*", depthName, newElem[0], +depthData[depthName][mid][0] + priceDiff);
          depthData[depthName].unshift(newElem);
          break;
        } else if (mid === depthData[depthName].length - 1 && newElem[0] > +depthData[depthName][mid][0]) {
          // console.log("**", depthName, newElem[0], +depthData[depthName][mid][0] - priceDiff);
          depthData[depthName].push(newElem);
          break;
        }
      } else {
        break;
      }

      const diff = +depthData[depthName][mid][0] < newElem[0];
      if (diff) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
  });

  return depthData;
}

function setQuantity(depthData, depthName) {
  depthData[depthName] = depthData[depthName].map((item, indx) => {
    item[3] = +item[0] * +item[1];

    if (indx === 0) {
      item[2] = +item[1];
      return item;
    }

    item[2] = +item[1] + depthData[depthName][indx - 1][2];
    return item;
  });

  if ("asks" === depthName) depthData.asks.reverse();
  return depthData;
}

onmessage = (depth) => {
  const depthUpdate = JSON.parse(depth.data[1]);
  let depthData = depth.data[0];

  setDepth(depthUpdate.a, depthData, "asks");
  setDepth(depthUpdate.b, depthData, "bids");
  setQuantity(depthData, "asks");
  setQuantity(depthData, "bids");

  postMessage(depthData);
};
