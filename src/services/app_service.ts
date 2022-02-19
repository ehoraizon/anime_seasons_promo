import axios from "axios";

enum Season {summer = "summer", spring = "spring", fall = "fall", winter = "winter"}

interface Anime {
    title: string,
    score: number,
    image_url: string,
    mal_id: number
}

interface Asset {
    content_type: string,
    browser_download_url: string
}

interface RepoData {
    assets : Array<Asset>,
    tag_name : string
}

class AppService {
    static jikanApi: string = "https://api.jikan.moe/v3";
    static appReleases: string = "https://api.github.com/repos/ehoraizon/anime_seasons/releases/latest";
    static androidType: string = "application/vnd.android.package-archive";
    static windowsType: string = "application/x-msdownload";
    lastCall : Date = new Date();
    numCalls : number = 0;

    private getDiffMin(date : Date) : number{
        return Math.round((((date.getTime() - this.lastCall.getTime()) % 86400000) % 3600000) / 60000);
    }
    private async makeCall(url: string): Promise<any>{
        return await axios.get(url);
    }
    private async executeCall(url: string){
        if (this.getDiffMin(new Date()) == 0) {
            if (this.numCalls == 30){
                this.numCalls = 0;
                this.lastCall = new Date();
                return await new Promise(() => setTimeout(() => this.makeCall(url), (60 - (new Date()).getSeconds()) * 1000));
            } else {
                this.numCalls++;
                return await this.makeCall(url);
            }
        } else {
            this.numCalls = 0;
            this.lastCall = new Date();
            return await this.makeCall(url);
        }
    }
    private saveInLocalStorage(keyname : string, animes : Array<Anime>){
        if (typeof window !== "undefined")
            localStorage.setItem(keyname, JSON.stringify(animes));
    }
    private getFromLocalStorage(keyname : string) : any{
        if (typeof window !== "undefined")
            return localStorage.getItem(keyname);
        return "[]";
    }
    private async fetchAnimes(url: string, dbName: string, animeVar: string) : Promise<Array<Anime>>{
        var animes : Array<Anime>;
        var seasonCache = this.getFromLocalStorage(dbName);
        if (seasonCache !== null) {
            animes = JSON.parse(seasonCache);
        } else {
            try {
                const resp = await this.executeCall(url);
                animes = resp.data[animeVar].sort((animeA, animeB) => {
                    if (animeA.score > animeB.score) return -1;
                    else if (animeA.score < animeB.score) return 1;
                    else return 0;
                });
                this.saveInLocalStorage(dbName, animes);
            } catch (error) {
                console.log(error);
                animes = [];
            }
        }
        return animes;
    }
    public async getSeasonAnimes(season : Season, year : number) : Promise<Array<Anime>> {
        return await this.fetchAnimes(
            `${AppService.jikanApi}/season/${year}/${season.valueOf()}`,
            `${season.valueOf()}-${year}`, "anime"
        );
    }
    public async getTopAnimes() : Promise<Array<Anime>> {
        return await this.fetchAnimes(
            `${AppService.jikanApi}/top/anime/1`,
            "top", "top"
        );
    }
    public async searchForAnime(anime_title : string) : Promise<Array<Anime>>{
        return await this.fetchAnimes(
            `${AppService.jikanApi}/search/anime?q=${encodeURIComponent(anime_title)}&page=1`,
            `${encodeURIComponent(anime_title)}&page=1`, "results"
        );
    }
    public async getInstallable(device : string) : Promise<string>{
        const checkType = device == "Windows" ? AppService.windowsType : AppService.androidType;
        const resp = await axios.get(AppService.appReleases);
        if (resp.status == 200){
            const data : RepoData = resp.data;
            for(let i = 0; i < data.assets.length; i++){
                if (data.assets[i].content_type === checkType) return data.assets[i].browser_download_url;
            }
        }
        return "";
    }
}

export {AppService, Anime, Season};