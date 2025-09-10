import backgroundImg from '../../../assets/pokemon-Card.png'

const BattleCard= ({onClick}) => {
  return (
    <div>
      <img src={backgroundImg } width={220} alt="backgroundImg" onClick={onClick} />
    </div>
  );
}
export default BattleCard