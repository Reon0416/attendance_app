import { HeaderOwner } from "../components/HeaderOwner";
import { useState } from "react";
import { PasswordSetting } from "../components/PasswordSetting";
import { UserIdSetting } from "../components/UserIdSetting";
import { RateSetting } from "../components/RateSetting";
import "./style/Setting.css";

type Props = {
  onLogout: () => void;
};

type ActiveTab = "password" | "userid" | "rate";

function SettingOwner({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("password");

  const renderContent = () => {
    switch (activeTab) {
      case "password":
        return <PasswordSetting />;
      case "userid":
        return <UserIdSetting />;
      case "rate":
        return <RateSetting />;
      default:
        return null;
    }
  };

  return (
    <div>
      <HeaderOwner onLogout={onLogout} />
      <div className="settings-container">
        <h1>オーナー設定</h1>
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

          <div
            className={`tab-button ${activeTab === "rate" ? "active" : ""}`}
            onClick={() => setActiveTab("rate")}
          >
            時給
          </div>
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default SettingOwner;
