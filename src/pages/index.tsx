import * as React from "react";
import "../components/seasons_widget";
import "../styles/index.scss";
import SeasonsWidget from "../components/seasons_widget";
import SearchWidget from "../components/search_widget";
import { AppService } from "../services/app_service";
import MainIcon from "../images/main_icon.svg";
import MaterialIcon from 'material-icons-react';
import { useState } from "react";

const Index = () => {
    const appService = new AppService();
    const [nav, setNav] = useState("");
    const [iconName, setIconName] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    React.useEffect(() => {
        if (typeof window !== "undefined"){
            if (navigator.userAgent.includes("Windows")) {
                setIconName("desktop_windows");
                appService.getInstallable("Windows")
                            .then(value => setDownloadUrl(value));
            } else if (navigator.userAgent.includes("Android")) {
                setIconName("android");
                appService.getInstallable("Android")
                            .then(value => setDownloadUrl(value));
            }
        } else {
            setIconName("desktop_windows");
            appService.getInstallable("Windows")
                            .then(value => setDownloadUrl(value));
        }
    }, []);

    return (
        <main className="container">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        <MainIcon className="main-icon" width="72" height="56"/>
                        <h1>Anime Seasons</h1>
                    </div>
                    <a onClick={() => {nav.length == 0 ? setNav("is-active") : setNav("")}}
                        role="button" className={`navbar-burger ${nav}`} aria-label="menu" aria-expanded="false">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="nav-menu" className={`navbar-menu ${nav}`}>
                    <div className="navbar-start">
                        <a className="navbar-item" href="#seasons-widget">
                            Seasons Widget
                        </a>
                        <a className="navbar-item" href="#search-widget">
                            Search Widget
                        </a>
                    </div>
                </div>
            </nav>
            <section>
                <article id="first-article" 
                    className="is-flex is-flex-direction-column is-flex-wrap-nowrap">
                    {iconName && <a className="button" id="download-button" href={downloadUrl}>
                        <MaterialIcon id="download-icon" icon={iconName} />
                        <div>
                            <h5>Download from</h5>
                            <h3>GitHub</h3>
                        </div>
                    </a>}
                    <p id="description">
                        An anime watching app available for Android and Windows that 
                        you can use to watch anime by year and season. 
                        You can also search for any anime that you would like to watch.
                        It is <b>completely free</b> and <b>without ads</b>.
                        Subs in English and Español.
                    </p>
                    <SeasonsWidget appService={appService}/>
                </article>
                <SearchWidget appService={appService}/>
            </section>
            <footer>
                <span>made by</span>
                <a href="https://github.com/ehoraizon"> Erich Garcia</a>
            </footer>
        </main>
    );
}

export default Index;