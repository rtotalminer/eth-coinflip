import { useEffect, useState } from "react";
import { handleConnection } from "../utils/helpers";
import { ISystemStoreState, IUserStoreState, SystemStore, UserStore, defaultSystemStore, defaultUserStore, syncStore } from "../shared/store";
import Header from "./Header/Header";
import Coinflip from "./Coinflip/Coinflip";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "../assets/img/goldcoinv2_0.png";
import "../assets/img/goldcoinv2_1.png";
import "../assets/img/goldcoinv2_2.png";

import "../assets/img/gold_pile.png";


import "../assets/img/pixil-frame-0.png";

import './app.css';

import { getUserStoreState, handleAccountsChanged, handleChainChanged } from "../service/user";
import { BASE_URL, LOCAL_STORAGE } from "../shared/config";
import Chips from "./Bank/Chips/Chips";
import Vault from "./Bank/Vault/Vault";
import Footer from "./Footer";

export default function App() {

    if (window?.ethereum != undefined) {
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    const systemStore = syncStore(SystemStore);
    const userStore = syncStore(UserStore);

    const [connErrMsg, setConnErrMsg] = useState('');

    useEffect(() => {
        if (!systemStore.loading)  return;
        const load = async () => {
            let userStoreState: IUserStoreState = defaultUserStore;
            let systemStoreState: ISystemStoreState = defaultSystemStore;

            if (localStorage.getItem(LOCAL_STORAGE.CONNECTION) == `${true}`) {
                userStoreState = await getUserStoreState();
                console.log(userStoreState);
            }
            if (localStorage.getItem(LOCAL_STORAGE.DARK_MODE) == `${true}`) {
                systemStoreState.darkMode = true;
            }

            systemStoreState.loading = false;
            return {systemStoreState, userStoreState};
        }
        load().then((res) => {
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
            setConnErrMsg('Unable to connect to a provier or signer.')
        }
        load().then((res) => {
            })
            .catch(console.error);
    }, [userStore.connected])

      const homeComponent = <>
        <div className="centre container">
            Welcome to LostVegas, a decetralised autonamous casino ran by governance chips.
        </div>
      </>

      console.log(BASE_URL)
  
    return (
        <Router basename="/">
            {(!systemStore.loading && !userStore.connected) ?
                <div
                    style={{backgroundColor: 'red', textAlign: 'center', color: 'black'}}
                >
                    <b>{connErrMsg}</b>
                </div>
            : <></>}
            <Header />
            <Routes>
                <Route path={`${BASE_URL}/`} element={homeComponent}/>
                <Route path={`${BASE_URL}/chips`} element={<Chips/>} />
                <Route path={`${BASE_URL}/coinflip`} element={<Coinflip/>} />
                <Route path={`${BASE_URL}/vault`} element={<Vault/>} />
            </Routes>
            <Footer/>
        </Router>
    );
};
