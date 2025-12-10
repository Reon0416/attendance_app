import Rolling from "../assets/Rolling@1x-1.0s-20px-20px.gif";
import "./style/LodingImage.css";

export const LoadingImage = () => {
  return (
    <div className="loading-image-container">
      <img className="load-image" src={Rolling} alt="ローディング中" />
    </div>
  );
};
