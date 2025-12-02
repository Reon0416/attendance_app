import { PayrollDisplay } from "../components/PayrollDisplay";
import { HeaderEmp } from "../components/HeaderEmp";

type Props = {
  onLogout: () => void;
};

function PayrollEmp({ onLogout }: Props) {
  return (
    <div>
      <HeaderEmp onLogout={onLogout} />
      <PayrollDisplay />
    </div>
  );
}

export default PayrollEmp;