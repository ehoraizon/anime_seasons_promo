import * as React from "react";
import "../styles/anime_card.scss";

interface AnimeCardProps {
    name: string,
    url: string
}

class AnimeCard extends React.Component<AnimeCardProps> {
    render(): React.ReactNode {
        const {url, name} = this.props;
        return (
            <div className="column">
                {/* is-4by3 */}
                <img className="anime-card" src={url} alt={name}></img>
            </div>
        )
    }
}

export default AnimeCard;