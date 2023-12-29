import { useEffect, useState } from "react";
import { ISystemStoreState, IUserStoreState, SystemStore, UserStore, defaultSystemStore, defaultUserStore, syncStore } from "../shared/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "../assets/img/goldcoinv2_0.png";
import "../assets/img/goldcoinv2_1.png";
import "../assets/img/goldcoinv2_2.png";
import "../assets/img/gold_pile.png";
import "../assets/img/pixil-frame-0.png";
import './app.css';

import { getUserStoreState, handleAccountsChanged, handleChainChanged } from "../services/user";
import { BANK_ABI, BANK_ADDR, BASE_URL, CHIPS_ABI, COINFLIP_ABI, COINFLIP_ADDR, DEV, GANACHE_URL, IMG_FOLDER, LOCAL_STORAGE } from "../shared/config";

import Chips from "./bank/Chips/Chips";
import Vault from "./bank/Vault/Vault";
import Footer from "./main/Footer/Footer";
import Header from "./main/Header/Header";
import Coinflip from "./games/Coinflip/Coinflip";
import { getSystemStoreState } from "../services/system";
import { Contract, JsonRpcProvider } from "ethers";

// Render this using markdown?
const LostVegasIntro = () => {
    const containerStyle : any = {
        textAlign: 'center',
        maxWidth: '1200px',
        margin: 'auto',
        marginTop: '50px'
    };

    const h1Style = {
        fontSize: '32px',
        fontStyle: 'italic',
        color: 'white',
    };

    const h2Style = {
        fontSize: '24px',
        fontStyle: 'italic',
        color: 'white',

    };

    const imgStyle = {
        maxWidth: '100%',
        height: 'auto',
        margin: '20px 0',
    };

    const pStyle : any = {
        textAlign: 'left'
    }

    return (
        <div style={containerStyle}>
            <h1 style={h1Style}>Welcome to Lost Vegas - Unleash the Future of Decentralized Gaming!</h1>

            <h2 style={h2Style}>The Chips Token</h2>
            <p style={pStyle}>
                Introducing the <strong>Lost Vegas Chip</strong>, our exclusive ERC-20 token crafted for a seamless gaming experience.
                Minted by our decentralized bank, Chips open the door to a world where gaming meets innovation.
            </p>

            <h2 style={h2Style} id='investing'>Dynamic Trading Ecosystem</h2>
            <p style={pStyle}>
                Enjoy the thrill of high-stakes gaming with Chips, featuring a high transfer tax that fuels dynamic asset pricing.
                Witness the power of decentralized finance as you trade and engage with our vibrant community.
            </p>

            <h2 style={h2Style}>Innovative Tax System for Sustainable Play</h2>
            <p style={pStyle}>
                A percentage of each mint/redeem transaction contributes to our investor pool.
                Investors provide Ethereum as collateral, enhancing the security of bets during games.
                Receive your share of the mint/redeem tax and actively contribute to Lost Vegas's growth.
            </p>

            <h2 style={h2Style}>Balancing Act: Time-Locked Security Measures</h2>
            <p style={pStyle}>
                Experience fair play with our time-locked security measures on large bets and transactions.
                Protecting the integrity of the game ensures an exciting yet secure gaming environment.
            </p>

            <h2 style={h2Style}>Your Journey Begins Here</h2>
            <p style={pStyle}>
                Whether you're a seasoned player or new to decentralized gaming, Lost Vegas invites you to be part of the revolution.
                Unleash the potential of the Chip, explore diverse games, and embrace the future of decentralized entertainment.
            </p>

            <h2 style={h2Style}>Get Started Today!</h2>
            <p style={pStyle}>
                Connect your wallet at the top right of the page (currrently exclusivly Metamask) and dive into the extraordinary world of Lost Vegas.
                Let the games begin, where transparency, fairness, and innovation converge for an unparalleled gaming experience!
            </p>

            <p style={{paddingTop: '50px'}}>For more infomation read the whitepaper <a href='https://www.github.com/rtotalminer/eth-coinflip'>here.</a></p>

            <div style={{paddingBottom: '200px'}}></div>
            
        </div>
    );
};


export default function App() {

    if (window?.ethereum != undefined) {
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    const systemStore = syncStore(SystemStore);
    const userStore = syncStore(UserStore);

    useEffect(() => {
        if (!systemStore.loading)  return;
        const load = async () => {
            let userStoreState: IUserStoreState = defaultUserStore;
            let systemStoreState: ISystemStoreState = defaultSystemStore;

            if (localStorage.getItem(LOCAL_STORAGE.CONNECTION) == `${true}`) {
                userStoreState = await getUserStoreState();
            }
            if (localStorage.getItem(LOCAL_STORAGE.DARK_MODE) == `${true}`) {
                systemStoreState = await getSystemStoreState();
            }
            else if ( (!window?.ethereum || window?.ethereum == undefined) && DEV) {
                console.log('geting dataaaa')
                userStore.provider = new JsonRpcProvider(GANACHE_URL);
                userStore.contracts.Coinflip = new Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.provider);
                userStore.contracts.Bank = new Contract(BANK_ADDR, BANK_ABI, userStore.provider);
                userStore.contracts.Chips = new Contract(await userStore.contracts.Bank.CHIPS_TOKEN(), CHIPS_ABI, userStore.provider);
                systemStoreState.connectionErrMsg = 'Connection to provider only established!'
            }
            return {systemStoreState, userStoreState};
        }

        load().then((res) => {
                res.systemStoreState.loading = false;
                SystemStore.setState(res.systemStoreState);
                UserStore.setState(res.userStoreState);
            })
            .catch(console.error);
    }, [systemStore.loading])

    useEffect(() => {
        if (userStore.connected)  return;
        if (systemStore.loading) return;
        const load = async () => {
            // getNetwork
        }
        load().then((res) => {
            })
            .catch(console.error);
    }, [userStore.connected])
  
    return (
        <Router basename="/">
            {(!systemStore.loading && !userStore.connected) ?
                <div
                    className="banner"
                    style={{backgroundColor: 'red', textAlign: 'center', color: 'black'}}
                >
                    <b>{systemStore.connectionErrMsg}</b>
                </div>
            : <></>}
            <Header />
            <Routes>
                <Route path={`${BASE_URL}/`} element={<LostVegasIntro/>}/>
                <Route path={`${BASE_URL}/chips`} element={<Chips/>} />
                <Route path={`${BASE_URL}/coinflip`} element={<Coinflip/>} />
                <Route path={`${BASE_URL}/vault`} element={<Vault/>} />
            </Routes>
            <Footer/>
        </Router>
    );
};
