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
import { LOCAL_STORAGE } from "../shared/config";
import Chips from "./Bank/Chips";

export default function App() {

    if (window?.ethereum != undefined) {
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    const systemStore = syncStore(SystemStore);

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

      const homeComponent = <>
        <div className="centre container">
            Welcome to DeVegas, a decetralised autonamous casino ran by governance chips.
        </div>
      </>
  
    return (
        <Router basename="/">
            <Header />
            <Routes>
                <Route path="/" element={homeComponent}/>
                <Route path="/chips" element={<Chips/>} />
                <Route path="/coinflip" element={<Coinflip/>} />
            </Routes>
        </Router>
    );
};
