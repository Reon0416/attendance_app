import { HeaderOwner } from "../components/HeaderOwner";
import { OwnerAlertDash } from "../components/OwnerAlertDash";
import { OwnerHealthDash } from "../components/OwnerHealthDash";
import "./style/OwnerDash.css";

type Props = {
  onLogout: () => void;
};

function OwnerDash({ onLogout }: Props) {
  return (
    <div className="owner-wapper">
      <HeaderOwner onLogout={onLogout} />
      <div className="ownerDash-container">
        <OwnerAlertDash />
        <OwnerHealthDash />
      </div>
    </div>
  );
}

export default OwnerDash;
