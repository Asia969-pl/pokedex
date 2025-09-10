import sword from '../../../icons/sword.png'

const SwordIcon= ({onClick}) => {
  return (
    <div>
      <img src={sword} width={30} alt="SwordIcon" onClick={onClick} />
    </div>
  );
}
export default SwordIcon