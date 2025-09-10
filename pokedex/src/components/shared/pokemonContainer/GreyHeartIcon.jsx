import greyHeart from '../../../icons/greyHeart.png'

const GreyHeartIcon= ({onClick}) => {
  return (
    <div>
      <img src={greyHeart} width={30} alt="GreyHeartIcon" onClick ={onClick} />
    </div>
  );
}
export default GreyHeartIcon