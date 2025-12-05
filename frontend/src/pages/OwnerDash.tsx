import { HeaderOwner } from "../components/HeaderOwner";

type Props = {
  onLogout: () => void;
};

function OwnerDash({ onLogout }: Props) {
  return (
    <div className="owner-wapper">
      <HeaderOwner onLogout={onLogout} />
    </div>
  );
}

export default OwnerDash;