(this["webpackJsonpchroma-chat-tutorial"]=this["webpackJsonpchroma-chat-tutorial"]||[]).push([[0],{15:function(e,t,n){"use strict";(function(e){var a=n(14),r=n.n(a),o=n(29),i=n(46),s=n.n(i),c=function(){var t;return{init:function(){var n=Object(o.a)(r.a.mark((function n(a){var o,i;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,console.log(a),o=s.a.restClient.createRestClient(a,"78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3",5),t=s.a.gtxClient.createClient(o,e.from("78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3","hex"),[]),n.next=6,t.query("ping",{});case 6:return i=n.sent,console.log("Postchain client initialized."),n.abrupt("return",i);case 11:n.prev=11,n.t0=n.catch(0),console.error(n.t0);case 14:case"end":return n.stop()}}),n,null,[[0,11]])})));return function(e){return n.apply(this,arguments)}}(),getGtx:function(){return t}}}();t.a=c}).call(this,n(7).Buffer)},154:function(e,t,n){e.exports=n(273)},159:function(e,t,n){},161:function(e,t,n){},178:function(e,t){},180:function(e,t){},214:function(e,t){},215:function(e,t){},273:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(66),i=n.n(o),s=(n(159),n(20)),c=n(21),l=n(24),u=n(22),m=n(25),g=(n(160),n(161),n(28)),p=n(69),d=n(35),f=n(45),y=n(8),b=n(23),h=n(14),v=n.n(h),O=n(29),E=n(274),j=n(275),w=n(276),k=n(277),x=n(278),L=n(279),S=n(280),G=n(281),C=n(282),P=n(54),N=function(e){function t(){var e,n;Object(s.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={username:"",privKey:"",loginPrivKey:"",updating:!1},n.register=function(){var e=Object(O.a)(v.a.mark((function e(t){var a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n.state.username){e.next=3;break}return e.abrupt("return");case 3:return n.setState({updating:!0}),e.next=6,y.a.register(n.state.username);case 6:a=e.sent,Object(P.isEmpty)(a)&&alert("Operation failed! Please try again."),n.setState({privKey:a.privKey,updating:!1});case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.login=function(){var e=Object(O.a)(v.a.mark((function e(t){var a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n.state.loginPrivKey){e.next=3;break}return e.abrupt("return");case 3:return n.setState({updating:!0}),e.next=6,y.a.login(n.state.loginPrivKey);case 6:a=e.sent,Object(P.isEmpty)(a)?(alert("Unable to login! Invalid privKey or user does not exist."),n.setState({updating:!1})):n.props.history.push("/lobby");case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),n.onFieldChanged=function(e){return n.setState(Object(b.a)({},e.target.name,e.target.value))},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.state,t=e.privKey,n=e.username,a=e.updating,o=e.loginPrivKey;return r.a.createElement(E.a,{className:"justify-content-center align-items-center",style:{height:"100vh"}},r.a.createElement(j.a,{className:"m-auto",style:{paddingBottom:"20vh"},sm:"10",md:"6",lg:"5",xl:"4"},t?r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,null,r.a.createElement(G.a,null,r.a.createElement(k.a,null,r.a.createElement(C.a,null,"Username:"),r.a.createElement(x.a,{type:"text",readOnly:!0,name:"username",placeholder:"Username...",value:n})),t&&r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a,null,r.a.createElement(C.a,null,"Private Key (Save this to login):"),r.a.createElement(x.a,{type:"textarea",name:"privKey",row:"3",value:t,readOnly:!0}))))),r.a.createElement("div",{className:"d-flex justify-content-center mt-3"},r.a.createElement(L.a,{color:"primary",tag:f.b,to:"/lobby"},"Let's Play!"))):r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",{className:"mb-3"},"Welcome!"),r.a.createElement(w.a,{onSubmit:this.login,className:"row"},r.a.createElement(k.a,{className:"col mb-0 flex-grow-1"},r.a.createElement(x.a,{type:"password",name:"loginPrivKey",required:!0,placeholder:"Private Key...",value:o,onChange:this.onFieldChanged})),r.a.createElement("div",{className:"col flex-grow-0",style:{minWidth:"8em"}},r.a.createElement(L.a,{className:"btn-block",color:"primary",type:"submit",disabled:a},"Login"))),r.a.createElement("div",{className:"text-muted text-center my-3"},"-- or --"),r.a.createElement(w.a,{onSubmit:this.register,className:"row"},r.a.createElement(k.a,{className:"col mb-0 flex-grow-1"},r.a.createElement(x.a,{type:"text",readOnly:t,required:!0,name:"username",placeholder:"Username...",value:n,onChange:this.onFieldChanged})),r.a.createElement("div",{className:"col flex-grow-0",style:{minWidth:"8em"}},r.a.createElement(L.a,{className:"btn-block",color:"primary",type:"submit",disabled:a},"Register"))))))}}]),t}(r.a.Component),_=Object(d.g)(N),F=n(283),K=n(15),D=n(47),M=n.n(D),T=function(){if(!y.a.isLoggedIn())return!1;var e=y.a.getCurrentUser(),t=e.id,n=e.privKey,a=e.pubKey,r=K.a.getGtx().newTransaction([a]);return r.addOperation("look_for_game",t,M.a.randomBytes(32)),r.sign(n,a),r.postAndWaitConfirmation()},U=function(){if(!y.a.isLoggedIn())return!1;var e=y.a.getCurrentUser(),t=e.id,n=e.privKey,a=e.pubKey,r=K.a.getGtx().newTransaction([a]);return r.addOperation("stop_looking_for_game",t,M.a.randomBytes(32)),r.sign(n,a),r.postAndWaitConfirmation()},A=function(e){if(!y.a.isLoggedIn())return!1;var t=y.a.getCurrentUser(),n=t.id,a=t.privKey,r=t.pubKey,o=K.a.getGtx().newTransaction([r]);return o.addOperation("join_game",n,e,M.a.randomBytes(32)),o.sign(a,r),o.postAndWaitConfirmation()},I=function(e,t){var n=y.a.getCurrentUser(),a=n.id,r=n.privKey,o=n.pubKey,i=K.a.getGtx().newTransaction([o]);return i.addOperation("post_message",e,a,t,M.a.randomBytes(32)),i.sign(r,o),i.postAndWaitConfirmation()},W=function(e){return K.a.getGtx().query("get_game_status",{game:e})},B=function(e){return"".concat(e,"_PENDING")},R=function(e){return"".concat(e,"_REJECTED")},H=function(e){return"".concat(e,"_FULFILLED")};function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?q(n,!0).forEach((function(t){Object(b.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var J="lobby/FETCH_STATUS",$="lobby/LOOK_FOR_GAME",Q="lobby/STOP_LOOKING_FOR_GAME",V="lobby/JOIN_GAME",X={loading:!1,waitList:[],gameList:[],sending:!1,isLookingForGame:!1,error:null},Y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:X,t=arguments.length>1?arguments[1]:void 0,n=t.type,a=t.payload;switch(n){case B(J):return z({},e,{loading:!0,error:null});case H(J):var r=a.wait_list,o=a.game_list;return z({},e,{loading:!1,waitList:r,gameList:o,isLookingForGame:e.sending?e.isLookingForGame:r.some((function(e){return e.id===y.a.getCurrentUser().id}))});case R(J):return z({},e,{loading:!1,error:a});case B($):return z({},e,{sending:!0,isLookingForGame:!0,error:null});case B(Q):return z({},e,{sending:!0,isLookingForGame:!1,error:null});case H($):case H(Q):return z({},e,{sending:!1});case R($):case R(Q):return z({},e,{sending:!1,isLookingForGame:e.waitList.some((function(e){return e.id===y.a.getCurrentUser().id})),error:a});case B(V):return z({},e,{sending:!0,error:null});case R(V):return z({},e,{sending:!1,error:a});default:return e}},Z=n(55),ee=n.n(Z),te=n(68),ne=n.n(te),ae=function(e){function t(){var e,n;Object(s.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={initialized:!1},n.logout=function(){y.a.logout(),n.props.history.push("/")},n.composeRedirectToGameHandler=function(e){return function(){return n.props.history.push("/game/".concat(e))}},n.findGame=function(){return n.props.lookForGame()},n.quitFindGame=function(){return n.props.stopLookingForGame()},n.composeJoinHandler=function(e){return function(){return n.props.joinGame(e)}},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.getLobbyStatus=ne()(this.props.getLobbyStatus,1e3),this.getLobbyStatus()}},{key:"componentWillUnmount",value:function(){this.props.isLookingForGame&&this.props.stopLookingForGame()}},{key:"componentDidUpdate",value:function(e,t){e.loading&&!this.props.loading&&(this.state.initialized||this.setState({initialized:!0}),this.getLobbyStatus());var n=this.props,a=n.currentUser,r=n.gameList;if(e.gameList!==r){var o=r.find((function(e){return e.player_1===a.id||e.player_2===a.id}));o&&this.props.history.push("/game/".concat(o.id))}}},{key:"render",value:function(){var e=this,t=this.props,n=t.waitList,a=t.gameList,o=t.currentUser,i=t.isLookingForGame,s=t.sending;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"d-flex justify-content-between align-items-end py-4"},r.a.createElement("div",null,this.state.initialized&&(i?r.a.createElement(L.a,{color:"outline-danger",onClick:this.quitFindGame,disabled:s},"Stop Finding"):r.a.createElement(L.a,{color:"primary",onClick:this.findGame,disabled:s},"Find Game"))),r.a.createElement("div",{className:"d-flex align-items-baseline"},r.a.createElement("div",null,"Welcome, ",o.username,"!"),r.a.createElement(L.a,{color:"outline-danger",className:"ml-3",onClick:this.logout},"Logout"))),r.a.createElement(E.a,null,r.a.createElement(j.a,{lg:"6",className:"mb-3 mb-lg-0"},r.a.createElement(S.a,{style:{height:"100%"}},r.a.createElement(G.a,null,r.a.createElement("h4",null,"Wait List"),r.a.createElement("hr",null),r.a.createElement(F.a,{responsive:!0,borderless:!0,striped:!0,hover:!0},r.a.createElement("tbody",null,n.map((function(t){return r.a.createElement("tr",{key:t.id},r.a.createElement("td",null,ee()(t.timestamp).fromNow()),r.a.createElement("td",{valign:"middle"},t.username),r.a.createElement("td",{className:"text-right"},t.id!==o.id&&r.a.createElement(L.a,{color:"outline-primary",onClick:e.composeJoinHandler(t.id)},"Join")," "))}))))))),r.a.createElement(j.a,{lg:"6"},r.a.createElement(S.a,{style:{height:"100%"}},r.a.createElement(G.a,null,r.a.createElement("h4",null,"Active Games"),r.a.createElement("hr",null),r.a.createElement(F.a,{responsive:!0,borderless:!0,striped:!0,hover:!0},r.a.createElement("tbody",null,a.map((function(t){return r.a.createElement("tr",{key:t.id},r.a.createElement("td",null,ee()(t.timestamp).fromNow()),r.a.createElement("td",null,t.player_1_name),r.a.createElement("td",{valign:"middle"},t.player_2_name),r.a.createElement("td",{className:"text-right"},t.player_1!==o.id&&t.player_2!==o.id?r.a.createElement(L.a,{color:"outline-primary",onClick:e.composeRedirectToGameHandler(t.id)},"Spectate"):r.a.createElement(L.a,{color:"primary",onClick:e.composeRedirectToGameHandler(t.id)},"Play")," "))})))))))))}}]),t}(r.a.Component),re={getLobbyStatus:function(){return{type:J,payload:K.a.getGtx().query("get_lobby_status",{})}},lookForGame:function(){return{type:$,payload:T()}},stopLookingForGame:function(){return{type:Q,payload:U()}},joinGame:function(e){return{type:V,payload:A(e)}}},oe=Object(d.g)(Object(g.b)((function(e){var t=e.lobby,n=t.loading,a=t.waitList,r=t.gameList,o=t.sending,i=t.isLookingForGame;return{loading:n,sending:o,waitList:a,gameList:r,isWaitingForGameStart:t.isWaitingForGameStart,isLookingForGame:i,error:t.error,currentUser:y.a.getCurrentUser()}}),re)(ae)),ie=n(39);function se(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function ce(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?se(n,!0).forEach((function(t){Object(b.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):se(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var le="game/FETCH_STATUS",ue="game/POST_MESSAGE",me={loading:!1,messages:[],game:{},pendingMessages:[],fulfilledMessages:[],sending:!1,error:null},ge=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:me,t=arguments.length>1?arguments[1]:void 0,n=t.type,a=t.payload,r=t.meta;switch(n){case B(le):return ce({},e,{loading:!0,error:null});case H(le):return ce({},e,{loading:!1,game:a.game,messages:a.messages,fulfilledMessages:[]});case R(le):return ce({},e,{loading:!1,error:a});case B(ue):return ce({},e,{sending:!0,error:null,pendingMessages:[].concat(Object(ie.a)(e.pendingMessages),[r.msg])});case H(ue):return ce({},e,{sending:!1,pendingMessages:e.pendingMessages.filter((function(e){return e.message!==r.msg.message})),fulfilledMessages:[].concat(Object(ie.a)(e.fulfilledMessages),[r.msg])});case R(ue):return ce({},e,{sending:!1,pendingMessages:e.pendingMessages.filter((function(e){return e.message!==r.msg.message})),error:a});default:return e}},pe=function(e){function t(){var e,n;Object(s.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={message:""},n.onMessageChanged=function(e){return n.setState({message:e.target.value})},n.postMessage=function(e){e.preventDefault(),n.props.postMessage(Number(n.props.match.params.gameId),n.state.message),n.setState({message:""})},n.leaveGame=function(){return n.props.history.push("/lobby")},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=Number(this.props.match.params.gameId);this.getGameStatus=ne()((function(){return e.props.getGameStatus(t)}),500),this.getGameStatus()}},{key:"componentDidUpdate",value:function(e,t){e.loading&&!this.props.loading&&(this.getGameStatus(),0===e.messages.length&&(this.refs.messages.scrollTop=this.refs.messages.scrollHeight))}},{key:"render",value:function(){var e=this.props,t=e.messages,n=e.fulfilledMessages,a=e.pendingMessages,o=e.game,i=[].concat(Object(ie.a)(t),Object(ie.a)(n),Object(ie.a)(a)),s=y.a.getCurrentUser();return r.a.createElement(E.a,{style:{height:"100vh"}},r.a.createElement(j.a,{lg:"9",className:"py-3"}),r.a.createElement(j.a,{lg:"3",className:"d-flex flex-column justify-content-end py-3 col-lg-3",style:{maxHeight:"100%",background:"rgba(0,0,0,0.2)"}},r.a.createElement("div",{className:"flex-grow-0 d-flex justify-content-between mb-3"},!Object(P.isEmpty)(o)&&(o.player_1!==s.id&&o.player_2!==s.id?r.a.createElement(L.a,{color:"outline-danger",onClick:this.leaveGame},"Leave Game"):r.a.createElement(L.a,{color:"outline-danger"},"Resign"))),r.a.createElement("div",{className:"flex-grow-1 d-flex flex-column justify-content-end",style:{overflow:"hidden"}},r.a.createElement("div",{style:{overflow:"auto"},ref:"messages"},i.length>0?i.map((function(e){return r.a.createElement("p",{style:{wordBreak:"break-word"},key:e.timestamp},r.a.createElement("b",{className:e.author_name===s.username?"text-primary":"text-secondary"},"[",ee()(e.timestamp).fromNow(),"] ",e.author_name),":",r.a.createElement("br",null),e.message)})):r.a.createElement("div",{className:"text-muted"},'Say something nice e.g. "Good game, have fun!"'))),r.a.createElement(w.a,{className:"flex-grow-0 mt-3",onSubmit:this.postMessage},r.a.createElement(x.a,{type:"text",autoComplete:"message",value:this.state.message,onChange:this.onMessageChanged}))))}}]),t}(r.a.Component),de={getGameStatus:function(e){return{type:le,payload:W(e)}},postMessage:function(e,t){return{type:ue,payload:I(e,t),meta:{msg:{author_name:y.a.getCurrentUser().username,message:t,timestamp:(new Date).getTime()}}}}},fe=Object(d.g)(Object(g.b)((function(e){var t=e.game,n=t.loading,a=t.messages,r=t.pendingMessages,o=t.fulfilledMessages;return{loading:n,game:t.game,messages:a,fulfilledMessages:o,pendingMessages:r}}),de)(pe));function ye(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function be(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ye(n,!0).forEach((function(t){Object(b.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ye(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var he="config/SET_NODE_LOCATION",ve=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,n=t.type,a=t.payload;Object(p.a)(t,["type","payload"]);switch(n){case he:return window.localStorage.setItem("nodeLocation",a),be({},e,{nodeLocation:a});default:return e}},Oe=function(e){function t(){var e,n;Object(s.a)(this,t);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={location:"",loading:!1,success:!0},n.registerLocation=function(e){e.preventDefault(),n.state.location&&n.initializeNodeLocation()},n.onFieldChanged=function(e){return n.setState(Object(b.a)({},e.target.name,e.target.value))},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=window.localStorage.getItem("nodeLocation","");e&&this.setState({location:e},this.initializeNodeLocation)}},{key:"initializeNodeLocation",value:function(){var e=Object(O.a)(v.a.mark((function e(){return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0,success:!0}),e.next=3,K.a.init(this.state.location);case 3:"pong"===e.sent?this.props.setNodeLocation(this.state.location):this.setState({loading:!1,success:!1});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.location;return r.a.createElement(E.a,{className:"justify-content-center align-items-center",style:{height:"100vh"}},r.a.createElement(j.a,{className:"m-auto",style:{paddingBottom:"20vh"},sm:"10",md:"6",lg:"5",xl:"4"},r.a.createElement(S.a,null,r.a.createElement(G.a,null,this.state.loading?r.a.createElement("div",null,"Testing connection, please wait..."):r.a.createElement(w.a,{onSubmit:this.registerLocation},r.a.createElement(k.a,null,!this.state.success&&r.a.createElement("div",{className:"color-danger"},"Cannot connect to server!"),r.a.createElement(C.a,null,"Please enter node location:"),r.a.createElement(x.a,{type:"text",name:"location",placeholder:"https://try.chromia.dev/node/#####/",value:e,onChange:this.onFieldChanged})),r.a.createElement("div",{className:"d-flex justify-content-end"},r.a.createElement(L.a,{color:"primary",type:"submit"},"Connect")))))))}}]),t}(r.a.Component),Ee={setNodeLocation:function(e){return{type:he,payload:e}}},je=Object(g.b)(null,Ee)(Oe),we=function(e){var t=e.component,n=Object(p.a)(e,["component"]);return r.a.createElement(d.b,Object.assign({},n,{render:function(){return y.a.isLoggedIn()?r.a.createElement(t,n):r.a.createElement(d.a,{to:"/"})}}))},ke=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement(f.a,null,this.props.nodeLocation?r.a.createElement(d.d,null,r.a.createElement(we,{path:"/lobby",component:oe}),r.a.createElement(we,{path:"/game/:gameId",component:fe}),r.a.createElement(d.b,{path:"/"},r.a.createElement(_,null))):r.a.createElement(je,null))}}]),t}(r.a.Component),xe=Object(g.b)((function(e){return{nodeLocation:e.config.nodeLocation}}))(ke),Le=n(151),Se=n(152),Ge=n(153),Ce=n(33),Pe=Object(Ce.combineReducers)({config:ve,lobby:Y,game:ge}),Ne=Object(Ce.createStore)(Pe,{},Object(Le.composeWithDevTools)(Object(Ce.applyMiddleware)(Se.a,Ge.a))),_e=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"container-fluid"},r.a.createElement(g.a,{store:Ne},r.a.createElement(xe,null)))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(_e,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},8:function(e,t,n){"use strict";(function(e){var a=n(23),r=n(14),o=n.n(r),i=n(29),s=n(46),c=n.n(s),l=n(15);function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}var m=function(){var t={},n=function(){var e=Object(i.a)(o.a.mark((function e(t){var n,a,i,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=c.a.util.makeKeyPair(),a=n.pubKey,i=n.privKey,(s=l.a.getGtx().newTransaction([a])).addOperation("register",a,t),s.sign(i,a),e.next=8,s.postAndWaitConfirmation();case 8:return e.next=10,r(i.toString("hex"));case 10:return e.abrupt("return",e.sent);case 13:return e.prev=13,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",{});case 17:case"end":return e.stop()}}),e,null,[[0,13]])})));return function(t){return e.apply(this,arguments)}}(),r=function(){var n=Object(i.a)(o.a.mark((function n(a){var r,i,s,u,m,g;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,r=e.from(a,"hex"),i=c.a.util.createPublicKey(r),s=i.toString("hex"),n.next=6,l.a.getGtx().query("get_user",{user_pubkey:s});case 6:return u=n.sent,m=u.id,g=u.username,t={id:m,username:g,pubKey:i,privKey:r},n.abrupt("return",{username:g,pubKey:s,privKey:a});case 13:return n.prev=13,n.t0=n.catch(0),console.error(n.t0),n.abrupt("return",{});case 17:case"end":return n.stop()}}),n,null,[[0,13]])})));return function(e){return n.apply(this,arguments)}}();return{register:n,login:r,logout:function(){t={}},isLoggedIn:function(){return!!t.privKey},getCurrentUser:function(){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(n,!0).forEach((function(t){Object(a.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},t)}}}();t.a=m}).call(this,n(7).Buffer)}},[[154,1,2]]]);
//# sourceMappingURL=main.43366d84.chunk.js.map