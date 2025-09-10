import redHeart from '../../../icons/redHeart.png'

const RedHeartIcon= ({onClick}) => {
  return (
    <div>
      <img src={redHeart} width={30} alt="RedHeartIcon" onClick={onClick} />
    </div>
  );
}
export default RedHeartIcon