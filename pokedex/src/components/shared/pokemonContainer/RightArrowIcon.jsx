import rightArrow from "../../../icons/arrow-right.png"

const RightArrowIcon= ({onClick}) => {
  return (
    <div>
      <img src={rightArrow } width={50} alt="RightArrowIcon" onClick={onClick} />
    </div>
  );
}
export default RightArrowIcon