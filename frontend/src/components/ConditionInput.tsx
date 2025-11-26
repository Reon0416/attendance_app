import type { ConditionData } from "../types";
import "./style/ConditionInput.css";

type ConditionInputProps = {
  data: ConditionData;
  onDataChange: (name: keyof ConditionData, value: number) => void;
};

export function ConditionInput({ data, onDataChange }: ConditionInputProps) {
  return (
    <div className="condition-input-container">
      <h3>今日のコンディションを入力してください (0: 良好, -10: 不良)</h3>

      <div className="slider-group">
        <label htmlFor="health">体調: {data.health}</label>
        <div className="range-with-labels">
          <span className="slider-label-min">不調</span>
          <input
            id="health"
            type="range"
            min="-10"
            max="0"
            step="1"
            value={data.health}
            onChange={(e) => onDataChange("health", Number(e.target.value))}
            className="condition-slider"
          />
          <span className="slider-label-max">問題なし</span>
        </div>
      </div>

      <div className="slider-group">
        <label htmlFor="motivation">モチベーション: {data.motivation}</label>
        <div className="range-with-labels">
          <span className="slider-label-min">不調</span>
          <input
            id="motivation"
            type="range"
            min="-10"
            max="0"
            step="1"
            value={data.motivation}
            onChange={(e) => onDataChange("motivation", Number(e.target.value))}
            className="condition-slider"
          />
          <span className="slider-label-max">問題なし</span>
        </div>
      </div>
    </div>
  );
}
