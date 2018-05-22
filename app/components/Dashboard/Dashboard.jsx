import React from "react";
import Translate from "react-translate-component";
import {RecentTransactions} from '../Account/RecentTransactions';
import DashboardList from './DashboardList';
import Immutable from 'immutable';
import Vivus from 'vivus';

var logoSlogan = require ('assets/images/login.jpg');
var rightBg = require ('assets/images/panel-bg.png');
var svg = require ("assets/images/d.svg");

class Dashboard extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    constructor () {
        super ();

        this.state = {
            width: null,
            showIgnored: false,
            newAssets: [],
            vivus: null
        };

        this._setDimensions = this._setDimensions.bind (this);
        // this._sortMarketsByVolume = this._sortMarketsByVolume.bind(this);
    }

    componentDidMount () {
        let self = this;
        this._setDimensions ();
        window.addEventListener ("resize", this._setDimensions, {capture: false, passive: true});
        document.querySelector ('#dashboard svg') && document.querySelector ('#dashboard svg').setAttribute ('id', 'svg-1');
        if (document.getElementById ('svg-1')) {
            this.vivus = new Vivus ('svg-1', {type: 'sync', duration: 200}, function (vivus) {
                vivus.el.classList.add ('done');
                if (self.refs.right) {
                    self.refs.right.style.width = '25%';
                    if (self.refs.right.clientWidth < 375) {
                        self.refs.right.style.width = '375px';
                    }
                }
            });
        }
        if(this.props.currentAccount){
            this.context.router.replace(`/account/${this.props.currentAccount}/overview`);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (
            nextProps.linkedAccounts !== this.props.linkedAccounts ||
            nextProps.ignoredAccounts !== this.props.ignoredAccounts ||
            nextState.width !== this.state.width ||
            nextProps.accountsReady !== this.props.accountsReady
        );
    }

    componentWillUnmount () {
        window.removeEventListener ("resize", this._setDimensions);

        // this.setState({
        //     vivus:new Vivus('svg-1',{type:'oneByOne',duration:150})
        // })
    }

    _setDimensions () {
        let width = window.innerWidth;

        if (width !== this.state.width) {
            this.setState ({width});
        }
    }

    _onToggleIgnored () {
        this.setState ({
            showIgnored: !this.state.showIgnored
        });
    }

    refreshSVG () {
        // this.vivus.el.classList.remove('done');
        // this.vivus&&this.vivus.reset().play();
    }

    render () {
        let {linkedAccounts, myIgnoredAccounts, accountsReady} = this.props;
        let names = linkedAccounts.toJS ().sort ();
        let ignored = myIgnoredAccounts.toArray ().sort ();

        let accountCount = linkedAccounts.size + myIgnoredAccounts.size;

        // if (!accountsReady) {
        //     return <LoadingIndicator />;
        // }

        if (!accountCount) {
            return (
                <div ref="wrapper" className="grid-block page-layout"
                     id="dashboard">  
                    <div className="grid-block left dashboard">
                        // <div className="grid-block" dangerouslySetInnerHTML={{__html: svg}}></div>
                        // <div onClick={this.refreshSVG.bind (this)} className="mask"></div>
                    </div>
                    <div className="right" ref='right' style={{backgroundColor:"transparent"}}>
                        <div className="right-wrapper">
                            <img src={logoSlogan} className="slogan"/>
                            <div className="buttons">
                                <button onClick={(() => {
                                    this.props.router.push ('/create-account');
                                }).bind (this)}
                                        className="button info float-left">
                                    <Translate content="dashboard.create_account"></Translate>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div ref="wrapper" className="grid-block page-layout vertical">
                <div className="grid-block vertical medium-6 medium-offset-3">
                    {<div className="generic-bordered-box" style={{marginBottom: 5}}>
                        <div className="block-content-header" style={{marginBottom: 15}}>
                            <Translate content="account.accounts"/>
                        </div>
                        <DashboardList
                            accounts={Immutable.List (names)}
                            ignoredAccounts={Immutable.List (ignored)}
                            width={this.state.width}
                            onToggleIgnored={this._onToggleIgnored.bind (this)}
                            showIgnored={this.state.showIgnored}
                        />
                    </div>}
                    {<RecentTransactions
                        style={{marginBottom: 20, marginTop: 20}}
                        accountsList={this.props.linkedAccounts}
                        limit={10}
                        compactView={false}
                        fullHeight={true}
                        showFilters={true}
                    />}
                </div>
            </div>
        );
    }

    // goMarket(type) {
    //     if (type == 'FREE') {
    //         SettingsActions.changeViewSetting({
    //             marketTabs: 0
    //         });
    //     }
    //     if (type == 'LEAGUE') {
    //         SettingsActions.changeViewSetting({
    //             marketTabs: 1
    //         });
    //     }
    //     this.props.router.push('/data-market');
    // }
}

export default Dashboard;
