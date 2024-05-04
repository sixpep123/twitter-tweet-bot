import React from "react";
import runrates from "./MatchesData/runrates1.json";
import { organizeRunrates } from "./Functions.js";
import html2canvas from "html2canvas";
import { useRef } from "react";
import CandleChart from "./CandleChart.jsx";

const App = () => {
  const oraganizedData = organizeRunrates(runrates);

  const chartRef = useRef(null);

  const downloadChart = () => {
    const chartElement = chartRef.current;

    // Use html2canvas to capture the chart as an image
    html2canvas(chartElement).then((canvas) => {
      // Convert canvas to image data URL
      const imageData = canvas.toDataURL("image/png");

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "chart.png"; // Name of the downloaded file
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
    });
  };
  const state = {
    series: [
      {
        data: oraganizedData,
      },
    ],

    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
      },
      xaxis: {
        type: "",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  return (
    <div style={{ height: "40rem", maxWidth: "99%", maxHeight: "99vh" }}>
      <CandleChart />
    </div>
  );
};

export default App;
