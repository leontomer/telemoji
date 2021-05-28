import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import happySvg from "../../../../gifs/happy.gif";
import angrySvg from "../../../../gifs/angry.gif";
import disgustSvg from "../../../../gifs/disgust.gif";
import fearSvg from "../../../../gifs/fear.gif";
import neutralSvg from "../../../../gifs/neutral.gif";
import sadSvg from "../../../../gifs/sad.gif";
import supriseSvg from "../../../../gifs/suprise.gif";
import { useSpring, animated } from "react-spring";
import {
  getCallStats,
  clearSelectedCallStats,
} from "../../../../actions/friendActions";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "./Loading/Loading";
import lan from "../../../../Languages/Languages.json";

const Statistics = ({ goback, callId, callerStatsName }) => {
  const [isLoading, setIsLoading] = useState(true);
  //@ts-ignore
  const selectedCallHistoryStats = useSelector(
    //@ts-ignore

    (state) => state.friendReducer.selectedCallHistoryStats
  );
  const [noData, setNoData] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [maxEmotionEmoji, setMaxEmotionEmoji] = useState("");
  const [callDuration, setCallDuration] = useState("");
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);

  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const COLORS = ['#8E44AD', '#E74C3C', '#99A3A4', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const appear = useSpring({
    delay: 1100,
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const appearLater = useSpring({
    delay: 1300,
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  const moveFromLeft = useSpring({
    delay: 1100,
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1 },
  });
  const moveFromRight = useSpring({
    delay: 1300,
    from: { x: 100, opacity: 0 },
    to: { x: 0, opacity: 1 },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (callId) {
      dispatch(getCallStats(callId));
    }
  }, [callId]);

  const handleGoBack = () => {
    setIsLoading(true);
    setNoData(false);
    dispatch(clearSelectedCallStats());
    goback();
  };

  function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    //@ts-ignore
    hours = hours < 10 ? "0" + hours : hours;
    //@ts-ignore
    minutes = minutes < 10 ? "0" + minutes : minutes;

    //@ts-ignore
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  const chartWidth = window.innerWidth < 580 ? window.innerWidth - 150 : 400;

  useEffect(() => {
    if (!selectedCallHistoryStats) {
      return;
    }
    console.log('Object.values(selectedCallHistoryStats)', Object.values(selectedCallHistoryStats));
    //@ts-ignore
    console.log('Object.values(selectedCallHistoryStats).slice(7).findIndex(value => value > 0)', Object.values(selectedCallHistoryStats).slice(0, 7).findIndex(value => value > 0))
    console.log('Object.values(selectedCallHistoryStats).slice(7)', Object.values(selectedCallHistoryStats).slice(0, 7))
    if (
      selectedCallHistoryStats && (
        Object.keys(selectedCallHistoryStats).length === 0 ||
        //@ts-ignore
        Object.values(selectedCallHistoryStats).slice(0, 7).findIndex(value => value > 0) === -1)
    ) {
      setNoData(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } else {
      const GeneratedDataFromStats = generateDataFromStats(
        selectedCallHistoryStats
      );
      const selectedEmotionSvg = getTheDominantEmotionSvg();
      //@ts-ignore
      setMaxEmotionEmoji(selectedEmotionSvg);
      const endTimeDate = new Date(selectedCallHistoryStats.endCall);
      const startTimeDate = new Date(selectedCallHistoryStats.startCall);
      //@ts-ignore
      const callDurationInMs = Math.abs(endTimeDate - startTimeDate);
      const timeString = msToTime(callDurationInMs);
      setCallDuration(timeString);
      //@ts-ignore
      setStatsData(GeneratedDataFromStats);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [selectedCallHistoryStats]);

  if (isLoading) {
    return <Loading />;
  }
  if (noData) {
    return (
      <div>
        <Typography>No data available</Typography>
        <Button size="small" color="primary" onClick={handleGoBack}>
          {lan[language].go_back}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <animated.div style={{ ...appear }}>
        <Typography variant="h5" component="h5" style={{ textAlign: "center" }}>
          {lan[language].call_stat}
        </Typography>
      </animated.div>
      <animated.div style={{ ...appearLater }}>
        <Typography
          variant="subtitle1"
          component="h6"
          style={{ textAlign: "center", color: "#566573 " }}
        >
          {lan[language].your_call} {callerStatsName}
        </Typography>
      </animated.div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <PieChart width={chartWidth} height={chartWidth}>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={statsData}
              cx="50%"
              cy="50%"
              outerRadius={chartWidth / 2}
              fill="#53317e"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {statsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div style={{ minWidth: "250px" }}>
          <animated.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ...moveFromLeft,
            }}
          >
            <Typography>{lan[language].top_emotion}</Typography>
            <img
              src={maxEmotionEmoji}
              alt="loading..."
              style={{ height: 64, width: 64 }}
            />
          </animated.div>
          <animated.div style={{ ...moveFromRight }}>
            <Typography>
              {lan[language].call_duration} {callDuration}
            </Typography>
          </animated.div>
        </div>
      </div>

      <Button size="small" color="primary" onClick={handleGoBack}>
        {lan[language].go_back}
      </Button>
    </div>
  );
};

const maxEmotionValue = { val: 0, emotion: "" };

function generateDataFromStats(selectedCallHistoryStats) {
  return Object.keys(selectedCallHistoryStats).map((key, i) => {
    if (key === "angry") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😡",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "happy") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😄",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "sad") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😕",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "disgust") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "🤢",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "suprise") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😱",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "fear") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😰",
        value: selectedCallHistoryStats[key],
      };
    }
    if (key === "neutral") {
      if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
        maxEmotionValue.emotion = key;
        maxEmotionValue.val = selectedCallHistoryStats[key];
      }
      return {
        name: "😐",
        value: selectedCallHistoryStats[key],
      };
    }
  });
}
function getTheDominantEmotionSvg() {
  if (maxEmotionValue.emotion === "angry") {
    return angrySvg;
  }
  if (maxEmotionValue.emotion === "happy") {
    return happySvg;
  }
  if (maxEmotionValue.emotion === "sad") {
    return sadSvg;
  }
  if (maxEmotionValue.emotion === "disgust") {
    return disgustSvg;
  }
  if (maxEmotionValue.emotion === "suprise") {
    return supriseSvg;
  }
  if (maxEmotionValue.emotion === "fear") {
    return fearSvg;
  }
  if (maxEmotionValue.emotion === "neutral") {
    return neutralSvg;
  }
}


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (parseInt((percent * 100).toFixed(0), 10) > 0) {
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }
  else { return '' }

};

export default Statistics;
