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

  async function getData(matchId) {
    const apiData = await axios.get(
      "http://127.0.0.1:3008/api/normalizedRunRates/" + matchId
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
    getData(window.location.pathname.split("/")[1]);
  }, []);

  function downloadImage() {
    const chartElement = chartRef.current;
    html2canvas(chartElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = imageData;
      link.download = "resChart.png";
      link.click();
    });
  }

  const downloadChart = async (matchDetails) => {
    const chartElement = chartRef.current;

    html2canvas(chartElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");

      let response = axios.post(
        "http://127.0.0.1:3008/api/normalizedRunRates/postTweet",
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
      stroke: {
        width: 2,
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
        <div className="infobar">
          <div>
            {`${matchHeaders.TeamA ? matchHeaders.TeamA : "TeamA"}${
              matchHeaders.TeamB ? matchHeaders.TeamB : "TeamB"
            }BALL`}
          </div>
          <div>{matchHeaders.date}</div>
          <div>UNIT LENGTH : 1 OVER</div>
        </div>
        <ReactApexChart
          height={"800px"}
          width={1500}
          series={state.series}
          options={state.options}
          type="candlestick"
        />
      </div>
      {/* <button onClick={downloadImage}>Download</button> */}
    </div>
  );
};

// 102400
// 123294
export default CandleChart;
