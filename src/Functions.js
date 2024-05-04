function organizeRunrates(runrates) {
  const oversDict = {};

  runrates.forEach((data) => {
    const runrate = data.normalizedRunrate;
    const normalizedRunrate = runrate.toFixed(4);
    const balls = data.balls;

    const over = Math.floor(balls / 6) + 1;

    if (!oversDict[over]) {
      oversDict[over] = {
        runrates: [],
        first: null,
        highest: -Infinity,
        lowest: Infinity,
        last: null,
      };
    }

    const overData = oversDict[over];
    overData.runrates.push(normalizedRunrate);

    if (overData.runrates.length === 1) {
      overData.first = normalizedRunrate;
    }

    if (normalizedRunrate > overData.highest) {
      overData.highest = normalizedRunrate;
    }
    if (normalizedRunrate < overData.lowest) {
      overData.lowest = normalizedRunrate;
    }

    overData.last = normalizedRunrate;
  });

  const oversArray = [];
  for (const [over, data] of Object.entries(oversDict)) {
    const y = [data.first, data.highest, data.lowest, data.last];
    oversArray.push({ x: `${parseInt(over)}th Over`, y });
  }

  return oversArray;
}

export { organizeRunrates };
