import '../../App.css'

const FirstCard = ({ thumbnail, type, status, genre, rating }) => {
  return (
    <div className="cardMain">
      <img className="cardImg" src={thumbnail} alt="" />

      <div className="cardInfo">
        <div className="cardType">{type}</div>
        <div className="cardStatus">{status}</div>
        <div className="cardGenre">{genre}</div>
        <div className="cardRating">{rating}</div>
      </div>
    </div>
  )
}

export default FirstCard
