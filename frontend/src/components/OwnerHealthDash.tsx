import React, { useState, useEffect } from "react";
import { HealthChart } from "./HealthChart";
import { getEmployeeList } from "../api/healthCheck";
import type { Employee } from "../types";
import "./style/OwnerHealthDash.css";

export function OwnerHealthDash() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [listLoading, setListLoading] = useState(true);

  // 1. 全従業員リストの取得
  useEffect(() => {
    const loadEmployees = async () => {
      setListLoading(true);

      const list = await getEmployeeList();
      setEmployees(list);
      if (list.length > 0) {
        setSelectedId(list[0].id);
      }

      setListLoading(false);
    };

    loadEmployees();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(Number(e.target.value));
  };

  // --- レンダリング ---

  if (listLoading) {
    return (
      <div className="owner-dashboard-loading">従業員リストを読み込み中...</div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="owner-dashboard-no-data">
        表示できる従業員がいません。
      </div>
    );
  }

  return (
    <div className="owner-health-dashboard-container">
      <h2>健康推移オーナーダッシュボード</h2>

      <div className="employee-select-form">
        <label htmlFor="employee-select">従業員を選択:</label>
        <select
          id="employee-select"
          onChange={handleSelectChange}
          value={selectedId}
          className="employee-select-dropdown"
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <div className="health-chart-display">
          <HealthChart employeeId={selectedId} />
        </div>
      )}
    </div>
  );
}
