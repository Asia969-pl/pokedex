import { Link } from 'react-router-dom'
import logo from '../../../../src/assets/pokemon.logo.png'

const PokemonLogo = () => {
    return (
        <Link to="/">
            <img src={logo} alt='pokemonLogo' width={200} height={100}/>
        </Link>
    )
}

export default PokemonLogo