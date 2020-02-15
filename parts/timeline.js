import $ from "jquery";
import React, { Component } from "react";

import { BarButton } from "./global.js";
import { ThumbsGrid } from "./thumbs.js";

import addSnap from "./addSnap.js";

import "./timeline.css";
import "./global.css";

class Timeline extends React.Component {
    /** @props : openPage, param, preview, setBar
     ** 
     **/
    constructor(props) {
        super(props);
        this.state = { count: null, sections: [], thumbSize: 11, showCount: 0 };
    }
    componentDidMount = () => {
        this.props.setBar(
            <div id="tl_bar">
                <div></div>
                <div className="center">
                    <BarButton
                        icon="font_minus"
                        onClick={() => {
                            //decrease size
                            var state = this.state;
                            if (state.thumbSize > 3) {
                                state.thumbSize -= 1;
                                this.setState(state);
                            }

                        }} />
                    <BarButton icon="font_plus" onClick={() => {
                        //increase size
                        var state = this.state;
                        if (state.thumbSize < 20) {
                            state.thumbSize += 1;
                            this.setState(state);
                        }
                    }} />
                </div>
                <div className="center tl_bar_opts">
                    <BarButton
                        icon="QuickActions_Add"
                        onClick={() => {
                            addSnap((c) => {
                                console.log('new snaps', c)
                                this.getSnaps();
                            });
                        }} />
                    <BarButton icon="Navigation_Trash" />
                    <BarButton icon="QuickActions_Share" />
                </div>
            </div>)
        recs.count({}, (err, count) => {
            var state = this.state;
            state.count = count;
            console.log(state);
            this.setState(state);
        })
        this.getSnaps();
    }
    getSnaps = () => {
        this.sortByDays();
    }
    sortByDays = () => {
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        recs.find({}).sort({ taken_on: -1 }).exec((err, data) => {
            var sections = [];
            var todate = new Date();
            var today = { day: todate.getUTCDate(), month: todate.getUTCMonth(), year: todate.getUTCFullYear() };
            var counter = JSON.stringify(today);
            var section = { title: "Today", location: "Somewhere on Earth", date: today, snaps: [] }
            data.forEach(snap => {
                var dt = new Date(snap.taken_on);
                var takenOn = { day: dt.getUTCDate(), month: dt.getUTCMonth(), year: dt.getUTCFullYear() };
                if (counter == JSON.stringify(takenOn)) {
                    //it belongs to the current section
                    console.log("same sec", takenOn);
                    section.snaps.push({ url: snap.url, id: snap.id })
                }
                else {
                    //create a new section and flush the old one
                    //New day!
                    if (section.snaps.length) {
                        sections.push(section);
                        console.log(section)
                    }
                    counter = JSON.stringify(takenOn);
                    var title = takenOn.day + " " + months[takenOn.month];
                    if(section.date.year!=takenOn.year){
                        //Date from seperate year
                        title=title+" "+takenOn.year;
                    }
                    section = {
                        title, location: "Somewhere on Earth", snaps: [
                            { url: snap.url, id: snap.id }
                        ], date: takenOn
                    }
                }
            })
            //flush the last sec
            if (section.snaps.length) {
                console.log(section)
                sections.push(section);
            }
            var state = this.state;
            state.sections = sections;
            this.setState(state);
        })
    }
    getSections = () => {
        var html = []
        this.state.sections.forEach((sec, key) => {
            html.push(<ThumbsGrid snaps={sec.snaps} key={key} thumbSize={this.state.thumbSize + 'rem'} title={sec.title} location={sec.location} />)
        })
        return (html)
    }
    render() {
        if (this.state.count == null) {
            return (
                <div id="welcome" className="center-col">
                    LOADING..
         </div>
            )
        }
        else {
            if (this.state.count) {

                return (
                    <div id="tl">
                        <div id="tl_sidebar"></div>
                        <div style={{ overflow: 'auto', padding: '1rem', paddingTop: '7rem' }}>
                            {this.getSections()}
                        </div>
                    </div>
                )

            }
            else {
                return (
                    <div id="welcome" className="center-col">
                        <div className="ink-black base-light size-xl">Its lonely here</div>
                        <div className="ink-dark base-semilight size-xs">Add some photos and videos</div>
                        <br />
                        <div className="ink-blue base-regular size-s" onClick={() => {
                            addSnap((c) => {
                                console.log('new snaps', c)
                                this.componentDidMount();
                            });
                        }}>Add</div>
                    </div>
                )

            }
        }

    }
}

export default Timeline