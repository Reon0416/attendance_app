import { HeaderEmp } from "../components/HeaderEmp";
import { useState } from "react";
import { PasswordSetting } from "../components/PasswordSetting";
import { UserIdSetting } from "../components/UserIdSetting";
import "./style/SettingEmp.css";

type Props = {
  onLogout: () => void;
};

type ActiveTab = "password" | "userid";

function SettingEmp({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("password");

  const renderContent = () => {
    switch (activeTab) {
      case "password":
        return <PasswordSetting />;
      case "userid":
        return <UserIdSetting />;
      default:
        return null;
    }
  };

  return (
    <div>
      <HeaderEmp onLogout={onLogout} />
      <div className="settings-container">
        <h1>従業員設定</h1>
        <div className="tab-buttons">
          <div
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            パスワード
          </div>

          <div
            className={`tab-button ${activeTab === "userid" ? "active" : ""}`}
            onClick={() => setActiveTab("userid")}
          >
            メールアドレス
          </div>
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default SettingEmp;
