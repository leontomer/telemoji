import React, { useEffect, useState } from 'react'
import { Typography, Button } from "@material-ui/core";
import { PieChart, Pie, Tooltip } from 'recharts';
import happySvg from '../../../../gifs/happy.gif';
import angrySvg from '../../../../gifs/angry.gif';
import disgustSvg from '../../../../gifs/disgust.gif';
import fearSvg from '../../../../gifs/fear.gif';
import neutralSvg from '../../../../gifs/neutral.gif';
import sadSvg from '../../../../gifs/sad.gif';
import supriseSvg from '../../../../gifs/suprise.gif';
import { useSpring, animated } from 'react-spring'
import { getCallStats, clearSelectedCallStats } from '../../../../actions/friendActions';
import { useSelector, useDispatch } from 'react-redux';
import { Loading } from './Loading/Loading';


const Statistics = ({ goback, callId, callerStatsName }) => {
    const [isLoading, setIsLoading] = useState(true);
    //@ts-ignore
    const selectedCallHistoryStats = useSelector(state => state.friendReducer.selectedCallHistoryStats)
    const [noData, setNoData] = useState(false);
    const [statsData, setStatsData] = useState([]);
    const [maxEmotionEmoji, setMaxEmotionEmoji] = useState('')
    const [callDuration, setCallDuration] = useState('')

    const moveFromLeft = useSpring({
        delay: 1100,
        from: { x: -100, opacity: 0 },
        to: { x: 0, opacity: 1 },
    })
    const moveFromRight = useSpring({
        delay: 1300,
        from: { x: 100, opacity: 0 },
        to: { x: 0, opacity: 1 },
    })
    const dispatch = useDispatch();

    useEffect(() => {
        if (callId) {
            dispatch(getCallStats(callId))
        }
    }, [callId])

    const handleGoBack = () => {
        setIsLoading(true);
        setNoData(false);
        dispatch(clearSelectedCallStats());
        goback();
    }

    function msToTime(duration) {
        var milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        //@ts-ignore
        hours = (hours < 10) ? "0" + hours : hours;
        //@ts-ignore
        minutes = (minutes < 10) ? "0" + minutes : minutes;

        //@ts-ignore
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }


    useEffect(() => {
        if (!selectedCallHistoryStats) {
            return;
        }
        if (selectedCallHistoryStats && Object.keys(selectedCallHistoryStats).length === 0) {
            setNoData(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 300)
        }
        else {
            const GeneratedDataFromStats = generateDataFromStats(selectedCallHistoryStats)
            const selectedEmotionSvg = getTheDominantEmotionSvg();
            //@ts-ignore
            setMaxEmotionEmoji(selectedEmotionSvg);
            const endTimeDate = new Date(selectedCallHistoryStats.endCall)
            const startTimeDate = new Date(selectedCallHistoryStats.startCall)
            //@ts-ignore
            const callDurationInMs = Math.abs(endTimeDate - startTimeDate)
            const timeString = msToTime(callDurationInMs);
            setCallDuration(timeString);
            //@ts-ignore
            setStatsData(GeneratedDataFromStats);
            setTimeout(() => {
                setIsLoading(false);
            }, 300)

        }
    }, [selectedCallHistoryStats])

    if (isLoading) {
        return <Loading />
    }
    if (noData) {
        return (
            <div>
                <Typography>
                    No data available
                </Typography>
                <Button size="small" color="primary" onClick={handleGoBack}>
                    Go back
                </Button>
            </div>

        )
    }
    return (
        <div>
            <Typography variant="h5" component="h5" style={{ textAlign: "center" }}>
                Call Statistics
            </Typography>

            <Typography variant="subtitle1" component="h6" style={{ textAlign: "center", color: '#566573 ' }}>
                Your call with {callerStatsName}
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            isAnimationActive={true}
                            data={statsData}
                            cx="50%"
                            cy="50%"
                            outerRadius={160}
                            fill="#53317e"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </div>
                <div style={{ minWidth: '250px' }}>
                    <animated.div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ...moveFromLeft }}>
                        <Typography>
                            Top emotion was:
                       </Typography>
                        <img src={maxEmotionEmoji} alt="loading..." style={{ height: 64, width: 64 }} />
                    </animated.div>
                    <animated.div style={{ ...moveFromRight }}>
                        <Typography>
                            Call duration was : {callDuration}
                        </Typography>
                    </animated.div>

                </div>
            </div>


            <Button size="small" color="primary" onClick={handleGoBack}>
                Go back
            </Button>
        </div>
    )
}

const maxEmotionValue = { val: 0, emotion: "" };

function generateDataFromStats(selectedCallHistoryStats) {
    return (Object.keys(selectedCallHistoryStats)).map((key, i) => {
        if (key === "angry") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😡", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "happy") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😄", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "sad") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😕", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "disgust") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "🤢", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "suprise") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😱", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "fear") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😰", value: selectedCallHistoryStats[key]
            }
        }
        if (key === "neutral") {
            if (selectedCallHistoryStats[key] > maxEmotionValue.val) {
                maxEmotionValue.emotion = key;
                maxEmotionValue.val = selectedCallHistoryStats[key]
            }
            return {
                name: "😐", value: selectedCallHistoryStats[key]
            }
        }
    })
}
function getTheDominantEmotionSvg() {
    if (maxEmotionValue.emotion === "angry") {
        return angrySvg
    }
    if (maxEmotionValue.emotion === "happy") {
        return happySvg
    }
    if (maxEmotionValue.emotion === "sad") {
        return sadSvg
    }
    if (maxEmotionValue.emotion === "disgust") {
        return disgustSvg
    }
    if (maxEmotionValue.emotion === "suprise") {
        return supriseSvg
    }
    if (maxEmotionValue.emotion === "fear") {
        return fearSvg
    }
    if (maxEmotionValue.emotion === "neutral") {
        return neutralSvg
    }
}

export default Statistics
