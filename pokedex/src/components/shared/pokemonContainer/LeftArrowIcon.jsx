import leftArrow from '../../../icons/arrow-left.png'

const LeftArrowIcon= ({onClick}) => {
  return (
    <div>
      <img src={leftArrow} width={50} alt="LeftArrowIcon" onClick={onClick} />
    </div>
  );
}
export default LeftArrowIcon