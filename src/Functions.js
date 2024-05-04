function organizeRunrates(runrates = []) {
  const result = [];

  runrates.forEach((data) => {
    let output = {
      x: "",
      y: [],
    };

    output.x = `over ${Math.ceil(data.openBall / 6)}`;
    output.y.push(data.openValue);
    output.y.push(data.highValue);
    output.y.push(data.lowValue);
    output.y.push(data.closeValue);

    result.push(output);
  });

  console.log(result);

  return result;
}

export { organizeRunrates };
