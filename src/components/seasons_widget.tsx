import * as React from "react";
import MaterialIcon from 'material-icons-react';

import "../styles/seasons_widget.scss";
import {AppService,Anime,Season} from "../services/app_service";
import AnimeCard from "./anime_card";

interface SeasonsWidgetProps {
    appService: AppService,
}

type SeasonsWidgetState = {
    animes : Array<Anime>,
    current_season: Season,
    current_year: number
}

class SeasonsWidget extends React.Component<SeasonsWidgetProps> {
    appService: AppService;
    updating: boolean;
    yearEventTarget: EventTarget & HTMLDivElement;
    seasonEventTarget: EventTarget & HTMLDivElement;
    state: SeasonsWidgetState = {
        animes: [],
        current_season: SeasonsWidget.getCurrentSeason(),
        current_year: (new Date()).getFullYear()
    };

    constructor(props: SeasonsWidgetProps) {
        super(props);
        this.appService = this.props.appService;
        this.updating = false;
    }

    private static getCurrentSeason() : Season{
        var month = (new Date()).getMonth();
        if (month >= 0 && month <= 3){
            return Season.winter;
        } else if (month > 3 && month <= 6) {
            return Season.spring;
        } else if (month > 6 && month <= 9) {
            return Season.summer;
        } else {
            return Season.fall;
        }
    }

    private fetchAnimes(year: number, season : Season){
        this.appService.getSeasonAnimes(season, year)
            .then(value => {
                this.updating = false;
                this.setState({
                    animes: value
                });
        });
    }

    private updateSeason(season:Season){
        this.updating = true;
        this.fetchAnimes(this.state.current_year, season);
        this.setState({current_season : season});
    }

    private updateYear(year:number){
        this.updating = true;
        this.fetchAnimes(year, this.state.current_season);
        this.setState({current_year : year});
    }

    componentDidMount(): void {
        this.updating = true;
        this.fetchAnimes(this.state.current_year, this.state.current_season);
    }

    render(): React.ReactNode {
        return (
            <div id="seasons-widget" className="box">
                <div id="year-selector">
                    {Array.from(Array(5).keys()).map(x => (new Date()).getFullYear()+1 - (1+x)).map(x => 
                        <div key={x} onClick={() => this.updateYear(x)} className={`year-b ${x == this.state.current_year && "active"}`}>{x}</div>
                    )}
                </div>
                <div className="columns is-mobile is-multiline main">
                    {this.state.animes.map(anime => <AnimeCard key={anime.mal_id} name={anime.title} url={anime.image_url}/>)}
                </div>
                <div id="season-selector">
                    <div onClick={() => this.updateSeason(Season.winter)} className={`round-b ${"winter" == this.state.current_season && "active"}`} title="Winter">
                        <MaterialIcon icon="ac_unit" />
                    </div>
                    <div onClick={() => this.updateSeason(Season.spring)} className={`round-b ${"spring" == this.state.current_season && "active"}`} title="Spring">
                        <MaterialIcon icon="emoji_nature" />
                    </div>
                    <div onClick={() => this.updateSeason(Season.summer)} className={`round-b ${"summer" == this.state.current_season && "active"}`} title="Summer">
                        <MaterialIcon icon="wb_sunny" />
                    </div>
                    <div onClick={() => this.updateSeason(Season.fall)} className={`round-b ${"fall" == this.state.current_season && "active"}`} title="Fall">
                        <MaterialIcon icon="air" />
                    </div>
                </div>
            </div>
        )
    }
}

export default SeasonsWidget;