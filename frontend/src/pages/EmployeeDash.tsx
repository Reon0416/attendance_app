import { useEffect, useMemo, useState } from "react";
import type { User } from "../types";
import "./EmployeeDash.css";


type Props = {
  user: User;
  onLogout: () => void;
};

type TodayState = {
  workDate: string;
  clockInAt?: string | null;
  clockOutAt?: string | null;
  hasOpenBreak: boolean;
};

type TodayResponse = { ok: boolean; state: TodayState };

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function postJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function EmployeeDash({ user, onLogout }: Props) {
  const [now, setNow] = useState(new Date());
  const [today, setToday] = useState<TodayState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const reloadToday = async () => {
    setError("");
    const data = await getJSON<TodayResponse>("/api/attendance/today");
    setToday(data.state);
  };

  useEffect(() => {
    reloadToday().catch((e) => setError(String(e)));
  }, []);

  const status = useMemo<"未出勤" | "勤務中" | "休憩中" | "退勤済み">(() => {
    if (!today) return "未出勤";
    if (today.clockOutAt) return "退勤済み";
    if (today.hasOpenBreak) return "休憩中";
    if (today.clockInAt && !today.clockOutAt) return "勤務中";
    return "未出勤";
  }, [today]);

  const btnState = {
    canClockIn: status === "未出勤",
    canBreakStart: status === "勤務中",
    canBreakEnd: status === "休憩中",
    canClockOut: status === "勤務中",
  };

  const doAction = async (path: string) => {
    setLoading(true);
    setError("");
    try {
      await postJSON(`/api/attendance/${path}`);
      await reloadToday();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const dateText = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeText = now.toLocaleTimeString("ja-JP", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const statusClass =
    status === "未出勤"
      ? "blue"
      : status === "勤務中"
      ? "green"
      : status === "休憩中"
      ? "orange"
      : "gray";

  return (
    <div className="card">
      <h2 className="title">タイムレコーダー</h2>

      <div className="date">{dateText}</div>
      <div className="clock">{timeText}</div>
      <div className={`status ${statusClass}`}>{status}</div>

      {error && <div className="error">{error}</div>}

      <div className="btn-row">
        <button
          className={`btn ${btnState.canClockIn ? "btn-primary" : "btn-disabled"}`}
          disabled={!btnState.canClockIn || loading}
          onClick={() => doAction("clock-in")}
        >
          出勤
        </button>

        <button
          className={`btn ${btnState.canBreakStart ? "btn-normal" : "btn-disabled"}`}
          disabled={!btnState.canBreakStart || loading}
          onClick={() => doAction("break-start")}
        >
          休憩開始
        </button>

        <button
          className={`btn ${btnState.canBreakEnd ? "btn-normal" : "btn-disabled"}`}
          disabled={!btnState.canBreakEnd || loading}
          onClick={() => doAction("break-end")}
        >
          休憩終了
        </button>

        <button
          className={`btn ${btnState.canClockOut ? "btn-normal" : "btn-disabled"}`}
          disabled={!btnState.canClockOut || loading}
          onClick={() => doAction("clock-out")}
        >
          退勤
        </button>
      </div>

      <div className="back-btn-wrapper">
        <button className="link-btn" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
}