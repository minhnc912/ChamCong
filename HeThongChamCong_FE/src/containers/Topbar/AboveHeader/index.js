import React from "react";
import {Layout } from 'antd';
import {useDispatch, useSelector} from "react-redux";

import UserInfo from "src/components/UserInfo";
import {toggleCollapsedSideNav} from "src/appRedux/actions/Setting";

import {TAB_SIZE} from "src/constants/ThemeSetting";
import HorizontalNav from "../HorizontalNav";
import {Link} from "react-router-dom";

const {Header} = Layout;

const AboveHeader = () => {

  const dispatch = useDispatch();
  const { navCollapsed, width} = useSelector(({common}) => common).toJS();

  return (
    <div className="gx-header-horizontal gx-header-horizontal-dark gx-above-header-horizontal">

      <div className="gx-header-horizontal-nav gx-header-horizontal-nav-curve gx-d-none gx-d-lg-block">
        <div className="gx-container">
          <div className="gx-header-horizontal-nav-flex">
            <HorizontalNav/>
          </div>
        </div>
      </div>

      <Header
        className="gx-header-horizontal-main">
        <div className="gx-container">
          <div className="gx-header-horizontal-main-flex">

            <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
              <i className="gx-icon-btn icon icon-menu"
                 onClick={() => {
                   if (width <= TAB_SIZE) {
                     dispatch(toggleCollapsedSideNav(!navCollapsed));
                   }
                 }}
              />
            </div>
            <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer gx-mr-xs-3 gx-pt-xs-1 gx-w-logo">
              <img alt="" src={require("assets/images/w-logo.png")}/></Link>
            <Link to="/" className="gx-d-none gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo">
              <img height={18} width={120} alt="" src={require("assets/images/logo.png")}/></Link>

            <ul className="gx-header-notifications gx-ml-auto">
              <li className="gx-user-nav"><UserInfo color="white"/></li>
            </ul>
          </div>
        </div>
      </Header>
    </div>
  );
};


export default AboveHeader;
