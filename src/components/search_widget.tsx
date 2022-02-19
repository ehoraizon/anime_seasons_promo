import * as React from "react";
import MaterialIcon from 'material-icons-react';

import "../styles/search_widget.scss";
import {AppService,Anime,Season} from "../services/app_service";
import AnimeCard from "./anime_card";

interface SearchWidgetProps {
    appService: AppService,
}

type SearchWidgetState = {
    animes : Array<Anime>,
    current_keywords: string
}

class SearchWidget extends React.Component<SearchWidgetProps> {
    appService: AppService;
    state: SearchWidgetState = {
        animes: [],
        current_keywords: ""
    };

    constructor(props: SearchWidgetProps) {
        super(props);
        this.appService = this.props.appService;
        this.appService.getTopAnimes().then(value => this.setState({animes: value}));
    }

    private onChageInput(e: React.FormEvent<HTMLInputElement>){
        this.setState({current_keywords:e.currentTarget.value});
    }

    private searchAnime(){
        if (this.state.current_keywords.length > 3){
            this.appService.searchForAnime(this.state.current_keywords)
                .then(value => this.setState({animes: value}));
        }
    }

    render(): React.ReactNode {
        return (
            <article id="search-widget">
                <div id="search-bar">
                    <input className="input" onKeyDown={e => {if (e.code == "Enter") this.searchAnime()}} onChange={this.onChageInput.bind(this)}/>
                    <div className="button" onClick={() => this.searchAnime()}>
                        <MaterialIcon icon="search" />
                    </div>
                </div>
                <div id="search-results" className="columns is-mobile is-multiline">
                    {this.state.animes.map(anime => <AnimeCard key={anime.mal_id} name={anime.title} url={anime.image_url}/>)}
                </div>
            </article>
        )
    }
}

export default SearchWidget;