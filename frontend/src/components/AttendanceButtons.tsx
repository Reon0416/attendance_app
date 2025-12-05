import { useState, useEffect } from "react";
import {
  resisterAttendance,
  getLatestAttendanceRecord,
} from "../api/attendance";
import type {
  AttendanceActionType,
  ConditionData,
  LatestAttendanceRecord,
  HealthRecordResponse,
} from "../types";
import { ConditionInput } from "./ConditionInput";
import { resisterHealthRecord } from "../api/healthCheck";
import "./style/AttendanceButtons.css";

type AttendanceStatus =
  | "INITIAL"
  | "AFTER_CLOCK_IN"
  | "BREAKING"
  | "AFTER_BREAK";

const determineStatus = (
  records: LatestAttendanceRecord[]
): AttendanceStatus => {
  if (records.length === 0) {
    return "INITIAL";
  }

  const latestAction = records[0].action;

  switch (latestAction) {
    case "CLOCK_IN":
      return "AFTER_CLOCK_IN";
    case "BREAK_START":
      return "BREAKING";
    case "BREAK_END":
      return "AFTER_BREAK";
    case "CLOCK_OUT":
      return "INITIAL";
    default:
      return "INITIAL";
  }
};

export function AttendanceButtons() {
  // ボタン押下からAPIのreturnまでのボタンの制御
  const [loading, setLoading] = useState<AttendanceActionType | "">("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("INITIAL");
  const [condition, setCondition] = useState<ConditionData>({
    health: 0,
    motivation: 0,
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      const records = await getLatestAttendanceRecord();
      const newStatus = determineStatus(records);
      setStatus(newStatus);
      setIsInitialLoading(false);
    };
    loadStatus();
  }, []);

  // conditonステートを更新する関数
  const handleConditionChange = (name: keyof ConditionData, value: number) => {
    setCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async (action: AttendanceActionType) => {
    setLoading(action);

    try {
      const attendance = await resisterAttendance(action);

      const date = new Date(attendance.occurredAt);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      let alertMsgSuffix = "";

      switch (action) {
        case "CLOCK_IN":
          const healthResponse: HealthRecordResponse =
            await resisterHealthRecord(condition);

          if (healthResponse.isAlert && healthResponse.alertMessage) {
            alertMsgSuffix = `${healthResponse.alertMessage}`;
          }
          setAlert(`${alertMsgSuffix}`);
          setStatus("AFTER_CLOCK_IN");
          setMessage(`出勤を記録しました (${hours}:${minutes})`);
          break;
        case "BREAK_START":
          setStatus("BREAKING");
          setMessage(`休憩開始を記録しました (${hours}:${minutes})`);
          break;
        case "BREAK_END":
          setStatus("AFTER_BREAK");
          setMessage(`休憩終了を記録しました (${hours}:${minutes})`);
          break;
        case "CLOCK_OUT":
          setStatus("INITIAL");
          setMessage(`退勤を記録しました (${hours}:${minutes})`);
          break;
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading("");
    }
  };

  const isClockInDisabled =
    loading !== "" || status !== "INITIAL" || isInitialLoading;
  const isBreakStartDisabled =
    loading !== "" ||
    (status !== "AFTER_BREAK" && status !== "AFTER_CLOCK_IN") ||
    isInitialLoading;
  const isBreakEndDisabled =
    loading !== "" || status !== "BREAKING" || isInitialLoading;
  const isClockOutDisabled =
    loading !== "" ||
    (status !== "AFTER_CLOCK_IN" && status !== "AFTER_BREAK") ||
    isInitialLoading;

  let statusLabel = "";

  switch (status) {
    case "INITIAL":
      statusLabel = "未出勤";
      break;
    case "AFTER_CLOCK_IN":
      statusLabel = "出勤中";
      break;
    case "BREAKING":
      statusLabel = "休憩中";
      break;
    case "AFTER_BREAK":
      statusLabel = "出勤中";
      break;
    default:
      statusLabel = "";
  }

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <div className="status-header">
          <h2 className="status-title">{statusLabel}</h2>
          {status === "INITIAL" && (
            <ConditionInput
              data={condition}
              onDataChange={handleConditionChange}
            />
          )}
          <p className="status-message">{message}</p>
          <p className="alert-message">{alert}</p>
        </div>

        <div className="button-grid">
          <button
            className={`btn btn-clock-in ${
              isClockInDisabled ? "disabled" : ""
            }`}
            onClick={() => handleClick("CLOCK_IN")}
            disabled={isClockInDisabled}
          >
            出勤
          </button>

          <button
            className={`btn btn-break-start ${
              isBreakStartDisabled ? "disabled" : ""
            }`}
            onClick={() => handleClick("BREAK_START")}
            disabled={isBreakStartDisabled}
          >
            休憩開始
          </button>

          <button
            className={`btn btn-break-end ${
              isBreakEndDisabled ? "disabled" : ""
            }`}
            onClick={() => handleClick("BREAK_END")}
            disabled={isBreakEndDisabled}
          >
            休憩終了
          </button>

          <button
            className={`btn btn-clock-out ${
              isClockOutDisabled ? "disabled" : ""
            }`}
            onClick={() => handleClick("CLOCK_OUT")}
            disabled={isClockOutDisabled}
          >
            退勤
          </button>
        </div>
      </div>
    </div>
  );
}
