import React, { lazy, useEffect, useRef, useState } from "react";
import "./CandleChart.css";
import { organizeRunrates } from "./Functions";
import html2canvas from "html2canvas";
import ReactApexChart from "react-apexcharts";
import runrates from "./MatchesData/runrates2.json";
import axios from "axios";

const CandleChart = () => {
  const [matchData, setMatchData] = useState([]);
  const [organizedData, setOrganizedData] = useState([]);
  const [matchHeaders, setMatchHeaders] = useState("");
  const chartRef = useRef(null);

  // (async () => {})();

  async function getData(matchId) {
    const apiData = await axios.get(
      "http://192.168.29.135:3008/api/normalizedRunRates/" + matchId
    );
    console.log("data received");
    setMatchData(apiData?.data?.candelData);
    setMatchHeaders(apiData?.data?.matchHeaders);
    setOrganizedData(organizeRunrates(apiData?.data?.candelData || []));
    console.log("Completed setorg");

    setTimeout(async () => {
      await downloadChart(apiData?.data?.matchHeaders);
    }, 10 * 1000);
  }

  useEffect(() => {
    getData("91569");
  }, []);

  const downloadChart = async (matchDetails) => {
    const chartElement = chartRef.current;

    html2canvas(chartElement).then((canvas) => {
      const imageData = canvas.toDataURL("");
      let response = axios.post(
        "http://192.168.29.135:3008/api/normalizedRunRates/postTweet",
        {
          buffer: imageData,
          seriesName: matchDetails.seriesName,
          teamA: matchDetails.TeamA,
          teamB: matchDetails.TeamB,
          manOfTheMatch: matchDetails.manOfTheMatch,
          date: matchDetails.date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });
  };

  const state = {
    series: [
      {
        data: organizedData,
      },
    ],
    options: {
      chart: {
        type: "candlestick",
        height: 350,
        zoom: {
          enabled: false,
        },
        background: "#000000",
      },
      title: {
        text: "Y - Runs per Ball, X - Overs",
        align: "left",
        style: {
          color: "#FFFFFF",
        },
      },
      xaxis: {
        type: "category",

        axisBorder: {
          show: true,
          color: "#FFFFFF",
        },
        axisTicks: {
          show: true,
          color: "#FFFFFF",
        },
        labels: {
          style: {
            colors: "#FFFFFF",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          },
          style: {
            colors: "#FFFFFF",
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      annotations: {
        xaxis: [
          {
            x: 0,
            borderColor: "#FFFFFF",
            borderWidth: 2,
            label: {
              borderColor: "#00E396",
              style: {
                fontSize: "12px",
                color: "#fff",
                background: "#00E396",
              },
            },
          },
        ],
      },
    },
  };

  return (
    <div className="chart">
      <div ref={chartRef}>
        <ReactApexChart
          height={"900px"}
          series={state.series}
          options={state.options}
          type="candlestick"
        />
      </div>
    </div>
  );
};

export default CandleChart;
