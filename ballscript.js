const a0_0x40e09a=a0_0x2817;(function(_0x8d02dc,_0x851a11){const _0x50b302=a0_0x2817,_0x32cc6b=_0x8d02dc();while(!![]){try{const _0x325fdf=parseInt(_0x50b302(0x130))/0x1*(parseInt(_0x50b302(0x15b))/0x2)+-parseInt(_0x50b302(0xec))/0x3*(parseInt(_0x50b302(0x15d))/0x4)+-parseInt(_0x50b302(0x12b))/0x5*(parseInt(_0x50b302(0x149))/0x6)+-parseInt(_0x50b302(0x14c))/0x7+parseInt(_0x50b302(0x126))/0x8+-parseInt(_0x50b302(0x164))/0x9*(-parseInt(_0x50b302(0x129))/0xa)+parseInt(_0x50b302(0xef))/0xb;if(_0x325fdf===_0x851a11)break;else _0x32cc6b['push'](_0x32cc6b['shift']());}catch(_0x7595b8){_0x32cc6b['push'](_0x32cc6b['shift']());}}}(a0_0x27f9,0xd4f9a));window['innerHeight']>0x1f4&&window===window[a0_0x40e09a(0xf6)]&&(document['body'][a0_0x40e09a(0x128)][a0_0x40e09a(0x16c)]=a0_0x40e09a(0x102));window['location'][a0_0x40e09a(0x146)][a0_0x40e09a(0x122)](a0_0x40e09a(0x121))&&document['getElementById']('warn')[a0_0x40e09a(0x15f)]();const popSound=new Audio(a0_0x40e09a(0xf8)),canvas=document[a0_0x40e09a(0x168)](a0_0x40e09a(0x125));window['onresize']=()=>{const _0xca2c17=a0_0x40e09a;Object['assign'](canvas[_0xca2c17(0x128)],{...window[_0xca2c17(0x103)]*0x309/0x556>window[_0xca2c17(0xfe)]?{'height':_0xca2c17(0x100),'width':_0xca2c17(0x156)}:{'width':'100vw','height':'auto'}});},window['onresize']();const score=document[a0_0x40e09a(0x168)](a0_0x40e09a(0x16b));let CURRENT_MODE=a0_0x40e09a(0x13c),game=new CombineGame(canvas);game[a0_0x40e09a(0x16a)](0x1),updateNextDropIndicator();function loadFromStorage(){const _0x4e553a=a0_0x40e09a;let _0x56f06d=localStorage[_0x4e553a(0x11b)](_0x4e553a(0x150));_0x56f06d&&(_0x56f06d=JSON['parse'](_0x56f06d),CURRENT_MODE=_0x56f06d[_0x4e553a(0x127)]?_0x4e553a(0x13c):'ranked',rankedToggle['checked']=CURRENT_MODE===_0x4e553a(0xf5),game[_0x4e553a(0xfd)](_0x56f06d));}function writeToStorage(){const _0x734437=a0_0x40e09a,_0x1dcbd8=game[_0x734437(0x12c)]();console[_0x734437(0xf9)](_0x1dcbd8[_0x734437(0x127)]),localStorage['setItem'](_0x734437(0x150),JSON[_0x734437(0x134)](_0x1dcbd8));}const options={'onDrop':()=>{logFruitAdded(),writeToStorage(),updateNextDropIndicator();},'onMerge':_0x4c861b=>{const _0x5d80c2=a0_0x40e09a;popSound[_0x5d80c2(0xe4)]()[_0x5d80c2(0x16e)](),writeToStorage();},'onScoreChange':_0x514788=>{score['innerText']=_0x514788;},'onGameOver':_0x341668=>{const _0x217d12=a0_0x40e09a;sendLeaderboardScore(_0x341668,canvas[_0x217d12(0x114)]()),localStorage[_0x217d12(0x120)](_0x217d12(0x150)),score['innerText']='0',updateNextDropIndicator();},'onSyncFromState':()=>{updateNextDropIndicator();}};game[a0_0x40e09a(0x12d)](options),loadFromStorage(),game['loop'](),document[a0_0x40e09a(0x163)]=_0x2e99aa=>{const _0x35fece=a0_0x40e09a;if(!_0x2e99aa[_0x35fece(0xe5)])return;if(_0x2e99aa[_0x35fece(0x115)][_0x35fece(0x13b)][_0x35fece(0xed)](_0x35fece(0xf0)))return;game[_0x35fece(0x159)](_0x2e99aa);},document[a0_0x40e09a(0x11a)]=game[a0_0x40e09a(0x153)],document[a0_0x40e09a(0x137)]('visibilitychange',()=>{const _0x45e313=a0_0x40e09a;if(!document[_0x45e313(0x108)]){if('LgPrQ'===_0x45e313(0x155)){_0x36a653=_0x27d602[_0x45e313(0x123)]((_0x7cf0dc,_0x847c9e)=>_0x847c9e[0x1]-_0x7cf0dc[0x1]);let _0x4c6cdf=_0x4b25bc[_0x45e313(0x168)](_0x45e313(0x106));_0x4c6cdf[_0x45e313(0x11c)]='',_0x5f4691[_0x45e313(0x161)]((_0xc5c8f7,_0x57d388)=>{const _0x3e68fc=_0x45e313;let _0xe632bd=_0x1567db[_0x3e68fc(0x110)](_0x3e68fc(0x132));_0xe632bd[_0x3e68fc(0x13b)][_0x3e68fc(0x152)](_0x3e68fc(0x133)),_0xe632bd[_0x3e68fc(0x13b)]['add'](_0x3e68fc(0xf0)),_0xe632bd[_0x3e68fc(0x12e)]=_0x57d388+0x1+'.\x20\x20'+_0xc5c8f7[0x0]+_0x3e68fc(0xe7)+_0xc5c8f7[0x1],_0x4c6cdf[_0x3e68fc(0x14e)](_0xe632bd);let _0x996b25=_0x26de77[_0x3e68fc(0x110)](_0x3e68fc(0x132));_0xe632bd[_0x3e68fc(0x14e)](_0x996b25);let _0x1acc04=_0x2f23d1[_0x3e68fc(0x110)](_0x3e68fc(0x131));_0x1acc04[_0x3e68fc(0x13b)][_0x3e68fc(0x152)]('leaderboardImage'),_0x1acc04[_0x3e68fc(0x13b)][_0x3e68fc(0x152)](_0x3e68fc(0xf0)),_0x1acc04[_0x3e68fc(0x124)]=_0xc5c8f7[0x2],_0x1acc04[_0x3e68fc(0x128)][_0x3e68fc(0xe8)]='100px',_0x1acc04['style'][_0x3e68fc(0xfa)]=_0x3e68fc(0x109),_0x1acc04[_0x3e68fc(0x163)]=_0x27699a=>{_0x50aca4(_0xc5c8f7[0x2]);},_0x996b25[_0x3e68fc(0x14e)](_0x1acc04),_0x57d388==0x0&&(_0xe632bd['style'][_0x3e68fc(0x14f)]=_0x3e68fc(0x13e),_0x996b25['classList'][_0x3e68fc(0x152)]('leaderContainer'));});}else loadFromStorage();}}),score['onclick']=()=>{const _0x1c1088=a0_0x40e09a;confirm(_0x1c1088(0x144))&&(game[_0x1c1088(0x143)](),score['innerText']='0',writeToStorage(),loadFromStorage());};function updateNextDropIndicator(){const _0x129bee=a0_0x40e09a;score[_0x129bee(0x128)][_0x129bee(0x14a)]=_0x129bee(0x11f)+game['getNextDropColor']();}rankedToggle[a0_0x40e09a(0x107)]=_0x50e59e=>{const _0xb59c58=a0_0x40e09a;if(CURRENT_MODE==='ranked'){if(_0xb59c58(0xfb)!==_0xb59c58(0xff)){let _0x3166c1=confirm(_0xb59c58(0x11e));_0x3166c1?(game[_0xb59c58(0x140)](!![]),game['setSeed'](Math[_0xb59c58(0x141)]()*0x989680),game[_0xb59c58(0x143)](),writeToStorage(),loadFromStorage(),rankedToggle[_0xb59c58(0x160)]=![]):'SbmAt'===_0xb59c58(0xf1)?_0x53f7d5[_0xb59c58(0x13d)](_0x45ea81[_0xb59c58(0x128)],{..._0x536296[_0xb59c58(0x103)]*0x309/0x556>_0x261baa[_0xb59c58(0xfe)]?{'height':_0xb59c58(0x100),'width':_0xb59c58(0x156)}:{'width':_0xb59c58(0xf3),'height':_0xb59c58(0x156)}}):rankedToggle[_0xb59c58(0x160)]=!![];}else _0x1d9b9b[_0x3bbf32]['style']['border']=_0xb59c58(0x12a);}else{let _0x4f2dd8=confirm(_0xb59c58(0x14d));_0x4f2dd8?(game[_0xb59c58(0x140)](![]),game[_0xb59c58(0x16a)](0x1),game[_0xb59c58(0x143)](),writeToStorage(),loadFromStorage(),rankedToggle[_0xb59c58(0x160)]=!![]):rankedToggle[_0xb59c58(0x160)]=![];}};const LEADERBOARD_URL=a0_0x40e09a(0x136);document[a0_0x40e09a(0x168)](a0_0x40e09a(0x10a))[a0_0x40e09a(0x163)]=()=>{const _0x478b63=a0_0x40e09a;leaderboardPopup[_0x478b63(0x128)][_0x478b63(0x16c)]=_0x478b63(0x10e);},document[a0_0x40e09a(0x168)](a0_0x40e09a(0x117))['onclick']=_0x181e64=>{const _0x1c9f65=a0_0x40e09a;if(_0x181e64[_0x1c9f65(0x115)]['id']!='leaderboardPopup')return;leaderboardPopup[_0x1c9f65(0x128)][_0x1c9f65(0x16c)]=_0x1c9f65(0x12a);};let CASUAL_LEADERBOARD=[],RANKED_LEADERBOARD=[],leaderboardCasFocused=!![];leaderboardModeToggle[a0_0x40e09a(0x163)]=()=>{leaderboardCasFocused=!leaderboardCasFocused,updateLeaderboardStrings(),getLeaderboard();};function a0_0x2817(_0x522813,_0x54c56f){const _0x27f926=a0_0x27f9();return a0_0x2817=function(_0x28177e,_0x23b20b){_0x28177e=_0x28177e-0xe3;let _0x5abfb9=_0x27f926[_0x28177e];return _0x5abfb9;},a0_0x2817(_0x522813,_0x54c56f);}function updateLeaderboardStrings(){const _0x396381=a0_0x40e09a;leaderboardModeToggle[_0x396381(0x12e)]=leaderboardCasFocused?_0x396381(0xf2):_0x396381(0x147),leaderboardHeader[_0x396381(0x12e)]=leaderboardCasFocused?_0x396381(0x16f):_0x396381(0x13a),leaderboardSubtitle[_0x396381(0x12e)]=leaderboardCasFocused?'Balls\x20drop\x20in\x20a\x20random\x20order\x20in\x20casual\x20mode.':_0x396381(0x148);}function dataURLtoBlob(_0x42884a){const _0x36742b=a0_0x40e09a;let _0x38a4e9,_0x31f14b,_0x3824b6,_0x3d9f0e;_0x31f14b=atob(_0x42884a[_0x36742b(0x138)](',')[0x1]),_0x38a4e9=[],_0x3824b6=0x0,_0x3d9f0e=_0x31f14b[_0x36742b(0x166)];while(_0x3824b6<_0x3d9f0e){_0x38a4e9[_0x36742b(0xf7)](_0x31f14b[_0x36742b(0x165)](_0x3824b6)),_0x3824b6++;}return new Blob([new Uint8Array(_0x38a4e9)],{'type':_0x36742b(0x167)});};async function sendLeaderboardScore(_0x4e369d,_0x5228e9){const _0x4dba30=a0_0x40e09a;let _0x516265=prompt('Enter\x20your\x20name\x20if\x20you\x20would\x20like\x20to\x20submit\x20your\x20score\x20to\x20leaderboard.\x20Use\x20your\x20real\x20name\x20and\x20don\x27t\x20put\x20anything\x20bad\x20pls\x20🙏');if(_0x516265){if(_0x4dba30(0x12f)==='SHJch')_0x4826f3?_0x29a504=_0x361f9b:_0x3f29c1=_0x1127bd,_0x5abfdb(_0x34e652);else{let _0x17d715=await fetch('https://www.purgomalum.com/service/json?text='+_0x516265),_0x11a946=await _0x17d715[_0x4dba30(0xfc)]();_0x516265=_0x11a946['result'];}}else return;let _0x151cd3=dataURLtoBlob(_0x5228e9),_0x59626e=new FormData();_0x59626e[_0x4dba30(0x105)](_0x4dba30(0x10c),_0x151cd3);let _0x511056=await fetch(_0x4dba30(0x112),{'method':_0x4dba30(0x151),'headers':{'Authorization':_0x4dba30(0x15a)},'body':_0x59626e}),_0x3df479=await _0x511056[_0x4dba30(0xfc)](),_0x124252=_0x3df479[_0x4dba30(0x119)][_0x4dba30(0xeb)],_0x286365={'name':_0x516265,'score':_0x4e369d,'canvasString':_0x124252,'mode':CURRENT_MODE},_0x1e6f07=btoa(JSON[_0x4dba30(0x134)](_0x286365));_0x1e6f07=_0x1e6f07[_0x4dba30(0x138)]('')[_0x4dba30(0x118)]()['join']('');let _0x5dee40=await fetch(LEADERBOARD_URL+_0x4dba30(0xea)+encodeURIComponent(_0x1e6f07)),_0x81d103=await _0x5dee40[_0x4dba30(0xfc)]();leaderboardCasFocused=CURRENT_MODE===_0x4dba30(0x16d),updateLeaderboardStrings(),renderLeaderboard(_0x81d103),leaderboardPopup[_0x4dba30(0x128)]['display']=_0x4dba30(0x10e);let _0x48a898=document['getElementById']('leaderboardEntries'),_0x10963e=_0x48a898[_0x4dba30(0x145)](_0x4dba30(0xf4));for(let _0x2678d3=0x0;_0x2678d3<_0x10963e[_0x4dba30(0x166)];_0x2678d3++){if(_0x10963e[_0x2678d3][_0x4dba30(0x124)]==_0x124252){if(_0x4dba30(0x10d)!==_0x4dba30(0x10f)){_0x48a898['scrollTop']=_0x10963e[_0x2678d3]['offsetTop'],_0x10963e[_0x2678d3]['style']['border']='5px\x20solid\x20black',setTimeout(()=>{const _0x460669=_0x4dba30;_0x460669(0xe9)!=='aOldh'?_0x10963e[_0x2678d3]['style']['border']='none':(_0x11e27d[_0x460669(0x140)](![]),_0x14781f[_0x460669(0x16a)](0x1),_0x2afb8c[_0x460669(0x143)](),_0x215aae(),_0x32f2d5(),_0x12e3c3[_0x460669(0x160)]=!![]);},0x1388);break;}else _0x425cb5['resetToDefaultValues'](),_0x1ed070['innerText']='0',_0x5c9b91(),_0x5c35b5();}}}function getLeaderboard(){const _0x2a5d69=a0_0x40e09a;if(leaderboardCasFocused&&CASUAL_LEADERBOARD['length']>0x0||!leaderboardCasFocused&&RANKED_LEADERBOARD[_0x2a5d69(0x166)]>0x0){if(_0x2a5d69(0x11d)===_0x2a5d69(0x11d)){renderLeaderboard(leaderboardCasFocused?CASUAL_LEADERBOARD:RANKED_LEADERBOARD);return;}else{_0x1c71cc(_0x5fb59b?_0xb125eb:_0x15ec3c);return;}};let _0x28f6fc=document['getElementById'](_0x2a5d69(0x106));_0x28f6fc[_0x2a5d69(0x11c)]='',fetch(LEADERBOARD_URL+(_0x2a5d69(0x116)+(leaderboardCasFocused?'cas':'ranked')))[_0x2a5d69(0x15e)](_0x348de4=>_0x348de4[_0x2a5d69(0xfc)]())[_0x2a5d69(0x15e)](_0x44b96b=>{const _0xc4c7b2=_0x2a5d69;leaderboardCasFocused?_0xc4c7b2(0x113)===_0xc4c7b2(0xe6)?_0x1fae45[_0xc4c7b2(0x128)]['borderRight']=_0xc4c7b2(0x11f)+_0x293b41[_0xc4c7b2(0x139)]():CASUAL_LEADERBOARD=_0x44b96b:RANKED_LEADERBOARD=_0x44b96b,renderLeaderboard(_0x44b96b);});};function renderLeaderboard(_0x41a83a){const _0x141cd5=a0_0x40e09a;_0x41a83a=_0x41a83a[_0x141cd5(0x123)]((_0x4ac7fa,_0x341564)=>_0x341564[0x1]-_0x4ac7fa[0x1]);let _0x447354=document[_0x141cd5(0x168)](_0x141cd5(0x106));_0x447354[_0x141cd5(0x11c)]='',_0x41a83a[_0x141cd5(0x161)]((_0x2b2ae8,_0x27a508)=>{const _0x528825=_0x141cd5;let _0x5ddff8=document[_0x528825(0x110)](_0x528825(0x132));_0x5ddff8[_0x528825(0x13b)][_0x528825(0x152)](_0x528825(0x133)),_0x5ddff8[_0x528825(0x13b)]['add'](_0x528825(0xf0)),_0x5ddff8[_0x528825(0x12e)]=_0x27a508+0x1+_0x528825(0x14b)+_0x2b2ae8[0x0]+_0x528825(0xe7)+_0x2b2ae8[0x1],_0x447354['appendChild'](_0x5ddff8);let _0x103917=document[_0x528825(0x110)]('div');_0x5ddff8[_0x528825(0x14e)](_0x103917);let _0x4aac4f=document[_0x528825(0x110)](_0x528825(0x131));_0x4aac4f[_0x528825(0x13b)][_0x528825(0x152)](_0x528825(0xf4)),_0x4aac4f[_0x528825(0x13b)][_0x528825(0x152)](_0x528825(0xf0)),_0x4aac4f[_0x528825(0x124)]=_0x2b2ae8[0x2],_0x4aac4f[_0x528825(0x128)][_0x528825(0xe8)]=_0x528825(0x111),_0x4aac4f[_0x528825(0x128)]['objectFit']=_0x528825(0x109),_0x4aac4f[_0x528825(0x163)]=_0x2cf8ce=>{const _0x4fc333=_0x528825;if(_0x4fc333(0x104)!==_0x4fc333(0x142))openImage(_0x2b2ae8[0x2]);else{let _0xc6c1e5=_0x36e5b1(_0x4fc333(0x11e));_0xc6c1e5?(_0x303638[_0x4fc333(0x140)](!![]),_0x3a0a84[_0x4fc333(0x16a)](_0x39a16f[_0x4fc333(0x141)]()*0x989680),_0x471eb6[_0x4fc333(0x143)](),_0x4b88af(),_0x3a113f(),_0x51fa8c[_0x4fc333(0x160)]=![]):_0x1bf57f['checked']=!![];}},_0x103917[_0x528825(0x14e)](_0x4aac4f),_0x27a508==0x0&&(_0x5ddff8['style'][_0x528825(0x14f)]=_0x528825(0x13e),_0x103917[_0x528825(0x13b)]['add'](_0x528825(0x13f)));});}getLeaderboard();function openImage(_0x1d1092){const _0x107891=a0_0x40e09a;let _0x2c17bb=window[_0x107891(0x101)]();_0x2c17bb[_0x107891(0xee)][_0x107891(0x10b)](_0x107891(0xe3)+_0x1d1092+_0x107891(0x169)),setInterval(()=>{const _0x420342=_0x107891;_0x420342(0x15c)===_0x420342(0x15c)?(CASUAL_LEADERBOARD=[],RANKED_LEADERBOARD=[]):(_0x3a981d(_0x52aeeb+'?clicks='+_0x2c6de5),_0x1eddd4['setItem']('clicks',0x0));},0x3c*0x3e8);}function logFruitAdded(){const _0x312c36=a0_0x40e09a;if(location[_0x312c36(0x154)][_0x312c36(0x122)](_0x312c36(0x162)))return;let _0x10766c=Number(localStorage[_0x312c36(0x11b)](_0x312c36(0x158))||0x0);_0x10766c++,localStorage[_0x312c36(0x157)]('clicks',_0x10766c),_0x10766c==0xa&&(fetch(LEADERBOARD_URL+_0x312c36(0x135)+_0x10766c),localStorage[_0x312c36(0x157)](_0x312c36(0x158),0x0));}function a0_0x27f9(){const _0x3bac86=['score','display','cas','play','Casual\x20Leaderboard','<div\x20style=\x22\x0a\x20\x20\x20\x20thisisxssablelolbutidontcarecuzitwouldbekindafunnyifsomebodydidit:true;\x0a\x20\x20\x20\x20background-image:\x20url(','cloneNode','isTrusted','oyzVk','\x20-\x20','width','wGpIS','?data=','link','755976lROCwz','contains','document','8576392bYXeUc','nodrop','pKCOH','Ranked','100vw','leaderboardImage','ranked','top','push','pop.mp3','log','objectFit','xSnAt','json','loadFromState','innerHeight','aYCpn','100vh','open','unset','innerWidth','JEkzs','append','leaderboardEntries','oninput','hidden','cover','leaderboardButton','write','image','etMtZ','block','NsTmi','createElement','100px','https://api.imgur.com/3/image','eoWuA','toDataURL','target','?mode=','leaderboardPopup','reverse','data','onmousemove','getItem','innerHTML','thRXO','Ball\x20order\x20in\x20casual\x20is\x20completely\x20random.\x20\x0a\x0a\x20Switching\x20modes\x20mid\x20round\x20will\x20clear\x20all\x20balls,\x20continue?','5px\x20solid\x20','removeItem','noembed','includes','sort','src','gameCanvas','12377768iKDWdb','minimizeDuplicates','style','410lWcygc','none','8678525qHgxOe','getFullState','loadExtraOptions','innerText','cvewZ','1127ZagNdj','img','div','leaderboardEntry','stringify','?clicks=','https://script.google.com/macros/s/AKfycbw6iTqt_fyO5OtTZ9de3pZUEglgvTH9tlVxkiPmlpkjaRpoqz0vn8IK_CddqT3F3OLsTw/exec','addEventListener','split','getNextDropColor','Ranked\x20Leaderboard','classList','casual','assign','gold','leaderContainer','setMinimalDuplicates','random','gHWsF','resetToDefaultValues','Are\x20you\x20sure\x20you\x20want\x20to\x20restart?\x20Manually\x20restarting\x20means\x20your\x20score\x20won\x27t\x20have\x20a\x20chance\x20to\x20go\x20on\x20the\x20leaderboard','getElementsByClassName','hash','Casual','Balls\x20always\x20drop\x20in\x20the\x20same\x20order\x20in\x20ranked\x20mode.','6gfCdPi','borderRight','.\x20\x20','9592303tuDfGC','Ball\x20order\x20in\x20ranked\x20is\x20always\x20the\x20same.\x20\x0a\x0a\x20Switching\x20modes\x20mid\x20round\x20will\x20clear\x20all\x20balls,\x20continue?','appendChild','color','state','POST','add','handleMove','href','yKLDG','auto','setItem','clicks','handleClick','Client-ID\x20a23332bdafb3fb9','2254EuWwsM','KWbaG','16qIGvuy','then','remove','checked','forEach','file','onclick','304974veohZP','charCodeAt','length','image/png','getElementById',');\x0a\x20\x20\x20\x20width:\x20100vw;\x0a\x20\x20\x20\x20height:\x20100vh;\x0a\x20\x20\x20\x20background-size:\x20contain;\x0a\x20\x20\x20\x20background-repeat:\x20no-repeat;\x0a\x20\x20\x20\x20background-position:\x20center;\x0a\x20\x20\x20\x20position:\x20absolute;\x0a\x20\x20\x20\x20top:\x200px;\x0a\x20\x20\x20\x20left:\x200px;\x0a\x22>\x0a\x20\x20\x20\x20\x0a</div>','setSeed'];a0_0x27f9=function(){return _0x3bac86;};return a0_0x27f9();}