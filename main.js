(()=>{"use strict";var e,t,i,r,o,a,n={},l={};function s(e){var t=l[e];if(void 0!==t)return t.exports;var i=l[e]={id:e,loaded:!1,exports:{}};return n[e](i,i.exports,s),i.loaded=!0,i.exports}s.m=n,e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",i="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},s.a=(o,a,n)=>{var l;n&&((l=[]).d=-1);var s,d,c,u=new Set,p=o.exports,y=new Promise(((e,t)=>{c=t,d=e}));y[t]=p,y[e]=e=>(l&&e(l),u.forEach(e),y.catch((e=>{}))),o.exports=y,a((o=>{var a;s=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var a=[];a.d=0,o.then((e=>{n[t]=e,r(a)}),(e=>{n[i]=e,r(a)}));var n={};return n[e]=e=>e(a),n}}var l={};return l[e]=e=>{},l[t]=o,l})))(o);var n=()=>s.map((e=>{if(e[i])throw e[i];return e[t]})),d=new Promise((t=>{(a=()=>t(n)).r=0;var i=e=>e!==l&&!u.has(e)&&(u.add(e),e&&!e.d&&(a.r++,e.push(a)));s.map((t=>t[e](i)))}));return a.r?d:n()}),(e=>(e?c(y[i]=e):d(p),r(l)))),l&&l.d<0&&(l.d=0)},s.d=(e,t)=>{for(var i in t)s.o(t,i)&&!s.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},s.f={},s.e=e=>Promise.all(Object.keys(s.f).reduce(((t,i)=>(s.f[i](e,t),t)),[])),s.u=e=>e+".main.js",s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o={},a="watermeloncombine:",s.l=(e,t,i,r)=>{if(o[e])o[e].push(t);else{var n,l;if(void 0!==i)for(var d=document.getElementsByTagName("script"),c=0;c<d.length;c++){var u=d[c];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==a+i){n=u;break}}n||(l=!0,(n=document.createElement("script")).charset="utf-8",n.timeout=120,s.nc&&n.setAttribute("nonce",s.nc),n.setAttribute("data-webpack",a+i),n.src=e),o[e]=[t];var p=(t,i)=>{n.onerror=n.onload=null,clearTimeout(y);var r=o[e];if(delete o[e],n.parentNode&&n.parentNode.removeChild(n),r&&r.forEach((e=>e(i))),t)return t(i)},y=setTimeout(p.bind(null,void 0,{type:"timeout",target:n}),12e4);n.onerror=p.bind(null,n.onerror),n.onload=p.bind(null,n.onload),l&&document.head.appendChild(n)}},s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.v=(e,t,i,r)=>{var o=fetch(s.p+""+i+".module.wasm"),a=()=>o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((t=>Object.assign(e,t.instance.exports)));return o.then((t=>"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(t,r).then((t=>Object.assign(e,t.instance.exports)),(e=>{if("application/wasm"!==t.headers.get("Content-Type"))return console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",e),a();throw e})):a()))},(()=>{var e;s.g.importScripts&&(e=s.g.location+"");var t=s.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var i=t.getElementsByTagName("script");if(i.length)for(var r=i.length-1;r>-1&&(!e||!/^http(s?):/.test(e));)e=i[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),s.p=e})(),(()=>{var e={792:0};s.f.j=(t,i)=>{var r=s.o(e,t)?e[t]:void 0;if(0!==r)if(r)i.push(r[2]);else{var o=new Promise(((i,o)=>r=e[t]=[i,o]));i.push(r[2]=o);var a=s.p+s.u(t),n=new Error;s.l(a,(i=>{if(s.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=i&&("load"===i.type?"missing":i.type),a=i&&i.target&&i.target.src;n.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",n.name="ChunkLoadError",n.type=o,n.request=a,r[1](n)}}),"chunk-"+t,t)}};var t=(t,i)=>{var r,o,[a,n,l]=i,d=0;if(a.some((t=>0!==e[t]))){for(r in n)s.o(n,r)&&(s.m[r]=n[r]);l&&l(s)}for(t&&t(i);d<a.length;d++)o=a[d],s.o(e,o)&&e[o]&&e[o][0](),e[o]=0},i=self.webpackChunkwatermeloncombine=self.webpackChunkwatermeloncombine||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();const d=function(e,t,i){if(!e)throw"gimme rapier yo";const r=window.setTimeout,o=window.setInterval,a=window.clearInterval,n={red:{fillStyle:"#FF0000",radius:12,type:"circle"},blue:{fillStyle:"#0000FF",radius:45,type:"circle"},aqua:{fillStyle:"#00FFFF",radius:75,type:"circle"},green:{fillStyle:"#008000",radius:100,type:"circle"},yellow:{fillStyle:"#FFFF00",radius:130,type:"circle"},purple:{fillStyle:"#800080",radius:155,type:"circle"},orange:{fillStyle:"#FFA500",radius:185,type:"circle"},pink:{fillStyle:"#FFC0CB",radius:200,type:"circle"},brown:{fillStyle:"#A52A2A",radius:215,type:"circle"},black:{fillStyle:"#000000",radius:260,shadowBlur:80,effect:"pulse",type:"circle",hasStroke:!0},r:{fillStyle:"r",radius:50,shadowBlur:200,effect:"dance",type:"circle"},t:{fillStyle:"#ffffff",strokeStyle:"#cccccc",hasStroke:!0,lineWidth:10,radius:80,type:"t"}},l=60;let s=0;const d=1366,c=777;let u,p,y=.5*l,h=683,f=388.5,g=1e7*Math.random(),m=0,b=!0,w=!0;const v=3*l,B=Math.random().toString(36).substring(7);let M=0,S=!1,T=0,k=0,x=[],E=[],C=-1,D=100;const F=.4,R=.3;let I=[],O=[];function A(e){var t=2**35-31,i=e%t;return function(){return(i=185852*i%t)/t}}this.loadExtraOptions=e=>{i=e};let N=A(g);function L(){return T++,N()}function P(){N=A(g),T=0}this.setSeed=e=>{g=e,P()},this.setMinimalDuplicates=e=>{S=e};const j=new e.EventQueue(!0),G=new e.World({x:0,y:9.81});G.integrationParameters.numSolverIterations=20;const _=t?.getContext("2d"),q=e=>{e.forEach((e=>{const t={};switch(e.position?(t.x=e.position.x,t.y=e.position.y):(t.x=e.rigidBody.translation().x*D,t.y=e.rigidBody.translation().y*D),_.save(),_.beginPath(),function(e){const t=`hsl(${s%360}, 100%, 50%)`;let i=e.render.fillStyle;if("r"===i&&(i=t),_.fillStyle=i,_.strokeStyle=e.render.strokeStyle,_.lineWidth=e.render.lineWidth||0,_.shadowColor=e.render.shadowColor||_.fillStyle,_.shadowBlur=e.render.shadowBlur,_.globalAlpha=e.render.opacity,"pulse"===e.render.effect){let t=e.render.shadowBlur;_.shadowBlur=t?t*(Math.abs(s/50%t-t/2)/t):0}if("dance"===e.render.effect){const e=50,t=Math.cos(s/500)*e,i=Math.sin(s/500)*e;_.shadowOffsetX=t,_.shadowOffsetY=i}}(e),e.type){case"text":_.font="30px Arial",_.fillText(e.text,t.x,t.y);break;case"circle":const i=e.circleRadius||e.colliderDesc.shape.radius*D;_.arc(t.x,t.y,i,0,2*Math.PI),_.fill(),e.render.hasStroke&&_.stroke();break;case"t":_.translate(t.x,t.y),_.rotate(e.rigidBody.rotation());const r=Array.from(e.colliderDesc.shape.vertices);_.beginPath(),_.moveTo(r[0]*D,r[1]*D);for(let e=0;e<r.length;e+=2){let t=r[e]*D,i=r[e+1]*D;_.lineTo(t,i)}_.lineTo(r[0]*D,r[1]*D),e.render.hasStroke&&_.stroke(),_.fill(),_.closePath(),_.rotate(-e.rigidBody.rotation()),_.translate(-t.x,-t.y)}if(e.hasFace){const i=e.circleRadius||e.colliderDesc.shape.radius*D,r=h-t.x,o=f-t.y,a=Math.sqrt(Math.pow(r,2)+Math.pow(o,2));let n,l=r/i*i*.05,s=o/i*i*.05,d=Math.atan2(o,r),c=Math.sqrt(Math.pow(l,2)+Math.pow(s,2));"#000000"===e.render.fillStyle?_.fillStyle="white":_.fillStyle="black",_.globalAlpha*=.5,_.translate(t.x,t.y),e.rigidBody&&(n=e.rigidBody.rotation(),_.rotate(n)),_.beginPath(),e.isSad?_.arc(0,.55*i,.65*i,1*Math.PI,0):_.arc(0,.05*i,.65*i,0,1*Math.PI),d-=n,l=Math.cos(d)*c,s=Math.sin(d)*c,l*=1.1,s*=.7,a>i&&(l=0,s=0),_.fill(),_.beginPath(),_.arc(.3*i+l,.3*-i+s,.16*i,0,2*Math.PI),_.arc(.3*-i+l,.3*-i+s,.16*i,0,2*Math.PI),_.fill(),_.closePath(),_.globalAlpha*=.2,_.beginPath(),_.arc(.3*i,.3*-i,.18*i,0,2*Math.PI),_.arc(.3*-i,.3*-i,.18*i,0,2*Math.PI),_.fill(),_.closePath()}_.closePath(),_.restore()}))};function $(e){x.forEach((t=>{t.rigidBody&&t.rigidBody.setGravityScale(e?1:0)}))}function V(){u="red",p="red",M=0,k=0,m=0,b=!0,w=!0,P(),E.forEach((e=>{K(e)})),E=[],W(),t&&Q(re,u)}function W(){u=p;let e=4,t=Math.max(Math.round(6-M/100),3);if(S)for(;e>0;){let i=L();p=Object.keys(n)[Math.floor(Math.pow(i,t)*Object.keys(n).length/2)],p===u?e--:e=0,p===Object.keys(n)[0]&&(e=0)}else{let e=L();p=Object.keys(n)[Math.floor(Math.pow(e,t)*Object.keys(n).length/2)]}te()}function H(e,t){let i="0000000000000000".split("");e.forEach((e=>{i[e]="1"})),i=i.reverse().join(""),i=parseInt(i,2).toString(16).toUpperCase(),i="0".repeat(4-i.length)+i;let r="0000000000000000".split("");return t.forEach((e=>{r[e]="1"})),r=r.reverse().join(""),r=parseInt(r,2).toString(16).toUpperCase(),r="0".repeat(4-r.length)+r,"0x"+i+r}function U(e){e||(e=0);var t=-1;$(!1),E.forEach((e=>{e.collider.setCollisionGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber])),e.collider.setSolverGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber]))})),b=!1,w=!1;let i=()=>{let t=!1;E=x.filter((e=>e.fruitType)),E.forEach((e=>{E.filter((t=>t.fruitTypeNumber==e.fruitTypeNumber)).length>1&&(t=!0)})),t&&e<5?U(e+1):(E.forEach((e=>{e.collider.setCollisionGroups(H([1],[1])),e.collider.setSolverGroups(H([1],[1])),e.passGravFilterTraits=!1})),$(!0),b=!0,w=!0)},r=()=>{x.forEach((e=>{e.rigidBody&&(e.rigidBody.setLinvel({x:0,y:0},!0),e.rigidBody.setAngvel(0,!0))}));let e=[];for(;e.length<=1;)if(t++,e=E.filter((e=>e.fruitTypeNumber==t)),t>9)return void i();Z(3*l,(()=>{r()}));for(var o=0;o<e.length-1;o+=2){var a=e[o],n=e[o+1];let t=Math.random();a.specialMergeGroup=t,n.specialMergeGroup=t;let i=a.rigidBody.translation(),r=n.rigidBody.translation();if(i.y>r.y){let e=a;a=n,n=e}i=a.rigidBody.translation(),r=n.rigidBody.translation();var s=5*Math.sqrt(Math.pow(r.x-i.x,2)+Math.pow(r.y-i.y,2))*a.rigidBody.mass();let l=Math.atan2(r.y-i.y,r.x-i.x);var d={x:Math.cos(l)*s,y:Math.sin(l)*s};a.rigidBody.addForce(d,!0);let c=(e,t)=>{(t[0].passGravFilterTraits||t[1].passGravFilterTraits)&&(e.collider.setCollisionGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber])),e.collider.setSolverGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber])),e.rigidBody.setGravityScale(0),e.passGravFilterTraits=!0,e.onMerge=c)};a.passGravFilterTraits=!0,n.passGravFilterTraits=!0,a.onMerge=c,n.onMerge=c}};r()}function z(t,i,r){let o=e.ColliderDesc.ball(r/D).setRestitution(F),a=e.RigidBodyDesc.dynamic().setTranslation(t/D,i/D).setCcdEnabled(!0),n=G.createRigidBody(a);o.setActiveEvents(e.ActiveEvents.COLLISION_EVENTS),o.setFriction(.2),o.setFrictionCombineRule(e.CoefficientCombineRule.Max),o.setMass(Math.log(r)/Math.log(1.1)+10);let l=G.createCollider(o,n),s={id:Math.random(),type:"circle",renderType:"circle",rigidBody:n,rigidBodyDesc:a,colliderDesc:o,collider:l};return x.push(s),s}function Y(t,i,r,o){let a=e.ColliderDesc.cuboid(r/D,o/D),n=e.RigidBodyDesc.fixed().setTranslation(t/D,i/D),l=G.createRigidBody(n);a.setFriction(.3);let s=G.createCollider(a,l);s.setCollisionGroups(H([1],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])),s.setSolverGroups(H([1],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]));let d={type:"rectangle",rigidBody:l,rigidBodyDesc:n,colliderDesc:a,render:{fillStyle:"black"},collider:s};return x.push(d),d}function K(e){G.removeRigidBody(e.rigidBody),x=x.filter((t=>t.id!=e.id)),E=E.filter((t=>t.id!=e.id)),function(e){I.forEach((t=>{t.bodyHandles.includes(e.rigidBody.handle)&&t.clear(!0,!1)}))}(e)}function J(e,i,r){if(!t)return;const o=n[r].fillStyle;let a=n[r].radius;for(let t=0;t<15;t++){const t=Math.random()*Math.PI*2,r=2*Math.random()+1,n=z(e+Math.cos(t)*a,i+Math.sin(t)*a,5);n.render={fillStyle:o},n.rigidBody.setLinvel({x:Math.cos(t)*r,y:Math.sin(t)*r},!0),n.collider.setCollisionGroups(H([15],[15])),n.collider.setSolverGroups(H([15],[15])),Z((2+1*Math.random())*l,(()=>{K(n)}),[n])}}function X(e,t,i){t>=3||(i||(i=[]),e.othersImpacted=e.othersImpacted||0,E=x.filter((e=>e.fruitType)),E.forEach((r=>{i.includes(r.id)||r.id!=e.id&&Math.sqrt(Math.pow(r.rigidBody.translation().x-e.rigidBody.translation().x,2)+Math.pow(r.rigidBody.translation().y-e.rigidBody.translation().y,2))<r.colliderDesc.shape.radius+e.colliderDesc.shape.radius&&(r.impactedByNew=w&&!0,i.push(r.id),e.othersImpacted++,Z(R*l,(()=>{r.impactedByNew=!1}),[r]),X(r,t?t+1:1,i))})))}function Z(e,t,i,r){let o=Math.random(),a=[];i&&(a=i.map((e=>e.rigidBody.handle)));const n=(e,t)=>{I=I.filter((e=>e.id!=o)),e&&r&&r(t)};return I.push({ticks:e,callback:t,bodyHandles:a,id:o,clear:n}),{clear:n}}function Q(e,t){e.render={...e.render,...n[t]},t&&"circle"==n[t].type&&(e.circleRadius=n[t].radius)}function ee(t,i,r,o){let a;return"circle"===n[t].type?a=z(i,r,n[t].radius):"t"===n[t].type&&(a=function(t,i,r){r/=D;const o=new Float32Array([0,-r,r*Math.sqrt(3)/2,r/2,-r*Math.sqrt(3)/2,r/2]);let a=e.ColliderDesc.convexHull(o),n=e.RigidBodyDesc.dynamic().setTranslation(t/D,i/D),l=G.createRigidBody(n);a.setRestitution(F),a.setFriction(.3),a.setFrictionCombineRule(e.CoefficientCombineRule.Max),a.setMass(r*D),a.shape.radius=.5*r,trigidBody.setLinearDamping(250);let s=G.createCollider(a,l);s.setRestitution(0);let d={id:Math.random(),type:"t",renderType:"t",rigidBody:l,colliderDesc:a,collider:s,rigidBodyDesc:n};return x.push(d),d}(i,r,n[t].radius)),0==t&&a.colliderDesc.setMass(18),a.collider.setCollisionGroups(H([1],[1])),a.collider.setSolverGroups(H([1],[1])),a.rigidBody.setLinearDamping(2),console.log("damping more"),o&&(o.forceRadius&&(K(a),a=z(i,r,o.forceRadius)),o.velocity&&a.rigidBody.setLinvel(o.velocity,!0),Object.assign(a,o)),n[t].spawnSpin&&a.rigidBody.setAngvel(n[t].spawnSpin),Q(a,t),o&&o.forceRadius&&(a.circleRadius=o.forceRadius),a.fruitType=t,a.fruitTypeNumber=Object.keys(n).indexOf(t),a.hitYet=!1,a.hasFace=!0,1e3*Math.random()==1?a.isSad=!0:a.isSad=!1,E.push(a),X(a),a}function te(e){let i=n[u].radius;h-i<0?h=i:h+i>t.width&&(h=t.width-i),e<t.getBoundingClientRect().left?h=i:e>t.getBoundingClientRect().width+t.getBoundingClientRect().left&&(h=t.width-i),re.position.x=h}this.tick=()=>{s++,I.forEach((e=>{e.ticks--,e.ticks<=0&&(e.callback&&e.callback(),e.clear(!0,!0))})),E=x.filter((e=>e.fruitType)),window.FRUITS=E,E.forEach((e=>{const t=e.rigidBody.translation().y,i=e.colliderDesc.shape.radius;if(t*D>877&&(e.rigidBody.setTranslation({x:d/D/2,y:c/D/2}),e.rigidBody.setLinvel({x:0,y:0},!0)),t+i+10>c&&e.rigidBody.setTranslation({x:e.rigidBody.translation().x,y:0}),e.hitYet){if(!e.overrideDamping){const t=e.rigidBody.linvel().y,i=e.rigidBody.linvel().x;t<0&&e.rigidBody.setLinvel({x:i,y:.8*t},!0)}const i=e.rigidBody.linvel(),r=Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2));let o=5;const a=e.colliderDesc.shape.radius;if((Math.abs(t-ie.y)<a||t>ie.y)&&(o*=.5),r>o){e.velocityCapped=!0;let t=Math.atan2(i.y,i.x);e.rigidBody.setLinvel({x:Math.cos(t)*o,y:Math.sin(t)*o},!0)}else e.velocityCapped=!1}if(!e.overrideDamping)if(e.impactedByNew){e.collider.setRestitution(0),e.rigidBody.setLinearDamping(.6);const t=e.rigidBody.linvel();if(t.y<0&&e.rigidBody.setLinearDamping(25),e.lastVelocity){let i={x:Math.abs(e.lastVelocity.x-t.x),y:Math.abs(e.lastVelocity.y-t.y)};Math.sqrt(Math.pow(i.x,2)+Math.pow(i.y,2))>1&&(e.accelLimited=!0,e.rigidBody.setLinearDamping(250),Z(R*l,(()=>{e.merged||(e.accelLimited=!1,e.rigidBody.setLinearDamping(.5))}),[e]))}e.lastVelocity=t}else e.rigidBody.setLinearDamping(.5),e.rigidBody.setAngularDamping(2),e.collider.setRestitution(F)})),G.step(j),O=[],j.drainCollisionEvents(((e,r,s)=>{let d,u;O.push([e,r,s]),x.filter((t=>{t.rigidBody&&(t.rigidBody.handle==e?d=t:t.rigidBody.handle==r&&(u=t))})),function(e,r,s){if(e.fruitType&&r.fruitType&&(e.hitYet=!0,r.hitYet=!0),s&&e.fruitType&&r.fruitType&&e.fruitType===r.fruitType){if(e.merged||r.merged)return;e.merged=!0,r.merged=!0;const s=e.rigidBody.translation(),d=r.rigidBody.translation(),u=(s.x+d.x)/2*D,p=(s.y+d.y)/2*D,y=(e.rigidBody.rotation()+r.rigidBody.rotation())/2,h=function(e){const t=Object.keys(n),i=t.indexOf(e);return t[i+1]}(e.fruitType),f=Math.pow(Object.keys(n).indexOf(e.fruitType)+1,2);k+=f,i?.onScoreChange?.(k),i?.onMerge?.({bodies:[e,r],newType:h,score:k});let g=ee(h,u+1,p);g.impactedByNew=w&&!0,g.rigidBody.setRotation(y);let m=p+g.colliderDesc.shape.radius*D>c;if(m&&(console.log("all wall, extra dampening"),g.overrideDamping=!0,g.rigidBody.setLinearDamping(300),g.rigidBody.setAngularDamping(300)),(e.isSad||r.isSad)&&(g.isSad=!0),Z((m?2:g.othersImpacted>1?1:.1)*R*l,(()=>{m&&(g.overrideDamping=!1),g.impactedByNew=!1}),[g]),e.onMerge&&e.onMerge(g,[e,r]),r.onMerge&&r.onMerge(g,[e,r]),K(e),K(r),t){if("r"==h){let e=o((()=>{J(Math.random()*window.innerWidth,Math.random()*window.innerHeight,"r")}),150);Z(3*l,(()=>{a(e)}))}"t"==h&&(g.rigidBody.setAngvel(10,!0),g.rigidBody.setAngularDamping(.7),function(e,i,r){if(!t)return;const n={id:Math.random(),type:"circle",position:{x:e,y:i},circleRadius:5,renderFirst:!0,render:{strokeStyle:"black",lineWidth:4,opacity:1}};x.push(n);let l=1,s=o((()=>{l<0&&(a(s),x=x.filter((e=>e.id!=n.id))),n.circleRadius+=l,l+=-.002,n.render.opacity=l/1+1e-4}),1)}(u,p),E.forEach((e=>{e.collider.setCollisionGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber])),e.collider.setSolverGroups(H([e.fruitTypeNumber],[1,e.fruitTypeNumber]))})),$(!1),Z(5*l,(()=>{console.log("MERGING"),U()}))),function(e,i,r){if(!t)return;const o=Math.random();Z(2*l,(()=>{x=x.filter((e=>e.id!=o))}))}(),J(u,p,h)}}}(d,u,s)})),b&&0==E.filter((e=>{if(!e.hitYet)return!1;const r=e.rigidBody.linvel().y,n=e.rigidBody.linvel().x,l=e.colliderDesc.shape.radius,d=e.rigidBody.translation();if(Math.sqrt(Math.pow(r,2)+Math.pow(n),2)>3)return!1;if(Math.abs(r)+Math.abs(n)>3)return!1;let c=(d.y+l)*D<ie.y;if(c)if(-1!=C){let e=s-C;if(t&&(ie.fill=`rgb(${e/v*255},0,0)`),e>v&&b)return i?.onGameOver?.(k),void function(e){$(!1),C=Number.MAX_VALUE,b=!1;let t=o((()=>{if(0==E.length)$(!0),C=-1,b=!0,a(t),e&&e();else{let e=Math.floor(Math.random()*E.length);K(E[e])}}),15)}((()=>{V()}))}else C=s;return c})).length&&(C=-1,ie.fill="rgb(0,0,0)")},this.loop=()=>{this.tick(),t&&(()=>{_.clearRect(0,0,d,c),_.save(),_.fillStyle=ie.fill,_.fillRect(0,ie.y,d,10),_.restore();const e=x.filter((e=>e.renderFirst)),t=x.filter((e=>!e.renderFirst));q(e),q(t)})(),r(this.loop,1e3/l)},this.resetToDefaultValues=V,this.mergeAllFruitsEffect=U,this.addFruit=ee,this.loadFromState=e=>{u=e.currentType,p=e.nextType,t&&(Q(re,u),i?.onSyncFromState?.()),S=e.minimizeDuplicates,M=e.drops,T=e.randsGenerated,k=e.score,i?.onScoreChange?.(k),E.forEach((e=>{K(e)})),e.fruits.forEach((function(e){null==e.sad&&(localStorage.clear(),Z(1*l,(()=>{window.location.reload()})));let t=ee(e.fruitType,e.position.x*D,e.position.y*D,{velocity:e.velocity});t.rigidBody.setRotation(e.angle),t.isSad=e.sad})),N=A(g);for(let e=0;e<T;e++)N()},this.getFullState=()=>({fruits:E.map((e=>{const t=e.rigidBody.translation(),i=e.rigidBody.linvel(),r=e.rigidBody.rotation();return{position:t,velocity:i,fruitType:e.fruitType,angle:r,sad:e.isSad}})),currentType:u,nextType:p,drops:M,randsGenerated:T,score:k,minimizeDuplicates:S}),this.getNextDropColor=()=>n[p].fillStyle,this.handleClick=e=>{t&&b&&(s-m<y||(m=s,localStorage.setItem("lastInteract",B),M++,ee(u,h,40),W(),Q(re,u),x.forEach((e=>{e.id==re.id&&(e.position.y=-9999)})),Z(y,(()=>{x.forEach((e=>{e.id==re.id&&(e.position.y=40)}))})),i?.onDrop?.()))},this.handleMove=e=>{if(!t)return;const i=e.clientX,r=e.clientY;h=(i-t.getBoundingClientRect().left)/t.getBoundingClientRect().width*t.width,f=(r-t.getBoundingClientRect().top)/t.getBoundingClientRect().height*t.height,te(i)},Y(0,787,d,10),Y(1376,388.5,10,c),Y(-10,388.5,10,c);const ie={fill:"#000",y:80};let re={renderType:"circle",type:"circle",renderFirst:!0,position:{x:683,y:40},render:{fillStyle:"red"},circleRadius:5,hasFace:!0,id:"displayFruit"};t&&(x.push(re),Q(re,u)),this.resetToDefaultValues()};document.addEventListener("keydown",(e=>{e.ctrlKey&&e.altKey&&e.shiftKey&&"G"===e.key&&(console.log("close ball"),parent.postMessage("closeBall","*"))})),s.e(727).then(s.bind(s,727)).then((e=>{(window.innerHeight>500||window===window.top)&&(document.body.style.display="unset");const t=new Audio("pop.mp3"),i=document.getElementById("gameCanvas");window.onresize=()=>{Object.assign(i.style,{...777*window.innerWidth/1366>window.innerHeight?{height:"100vh",width:"auto"}:{width:"100vw",height:"auto"}})},window.onresize();const r=document.getElementById("score");let o="casual",a=new d(e,i);function n(){let e=localStorage.getItem("state");e&&(e=JSON.parse(e),o=e.minimizeDuplicates?"casual":"ranked",rankedToggle.checked="ranked"===o,a.loadFromState(e))}function l(){const e=a.getFullState();localStorage.setItem("state",JSON.stringify(e))}a.setSeed(1),c();const s={onDrop:()=>{!function(){if(location.href.includes("file"))return;if(location.href.includes("localhost"))return;let e=Number(localStorage.getItem("clicks")||0);e++,localStorage.setItem("clicks",e),10==e&&(fetch(u+"?clicks="+e),localStorage.setItem("clicks",0))}(),l(),c()},onMerge:e=>{t.cloneNode().play(),l()},onScoreChange:e=>{r.innerText=e},onGameOver:e=>{!async function(e,t){let i=prompt("Enter your name if you would like to submit your score to leaderboard. Use your real name and don't put anything bad pls 🙏");if(!i)return;{let e=await fetch(`https://www.purgomalum.com/service/json?text=${i}`);i=(await e.json()).result}let r=function(e){let t,i,r,o;for(i=atob(e.split(",")[1]),t=[],r=0,o=i.length;r<o;)t.push(i.charCodeAt(r)),r++;return new Blob([new Uint8Array(t)],{type:"image/png"})}(t),a=new FormData;a.append("image",r);let n=await fetch("https://api.imgur.com/3/image",{method:"POST",headers:{Authorization:"Client-ID a23332bdafb3fb9"},body:a}),l=(await n.json()).data.link,s={name:i,score:e,canvasString:l,mode:o},d=btoa(JSON.stringify(s));d=d.split("").reverse().join("");let c=await fetch(`${u}?data=${encodeURIComponent(d)}`),p=await c.json();h="casual"===o,f(),m(p),leaderboardPopup.style.display="block";let y=document.getElementById("leaderboardEntries"),g=y.getElementsByClassName("leaderboardImage");for(let e=0;e<g.length;e++)if(g[e].src==l){y.scrollTop=g[e].offsetTop,g[e].style.border="5px solid black",setTimeout((()=>{g[e].style.border="none"}),5e3);break}}(e,i.toDataURL()),localStorage.removeItem("state"),r.innerText="0",c()},onSyncFromState:()=>{c()}};function c(){r.style.borderRight=`5px solid ${a.getNextDropColor()}`}a.loadExtraOptions(s),n(),a.loop(),document.onclick=e=>{e.isTrusted&&(e.target.classList.contains("nodrop")||a.handleClick(e))},document.onmousemove=a.handleMove,document.addEventListener("visibilitychange",(()=>{document.hidden||n()})),r.onclick=()=>{confirm("Are you sure you want to restart? Manually restarting means your score won't have a chance to go on the leaderboard")&&(a.resetToDefaultValues(),r.innerText="0",l(),n())},rankedToggle.oninput=e=>{"ranked"===o?confirm("Ball order in casual is completely random. \n\n Switching modes mid round will clear all balls, continue?")?(a.setMinimalDuplicates(!0),a.setSeed(1e7*Math.random()),a.resetToDefaultValues(),l(),n(),rankedToggle.checked=!1):rankedToggle.checked=!0:confirm("Ball order in ranked is always the same. \n\n Switching modes mid round will clear all balls, continue?")?(a.setMinimalDuplicates(!1),a.setSeed(1),a.resetToDefaultValues(),l(),n(),rankedToggle.checked=!0):rankedToggle.checked=!1};const u="https://script.google.com/macros/s/AKfycbw6iTqt_fyO5OtTZ9de3pZUEglgvTH9tlVxkiPmlpkjaRpoqz0vn8IK_CddqT3F3OLsTw/exec";document.getElementById("leaderboardButton").onclick=()=>{leaderboardPopup.style.display="block"},document.getElementById("leaderboardPopup").onclick=e=>{"leaderboardPopup"==e.target.id&&(leaderboardPopup.style.display="none")};let p=[],y=[],h=!0;function f(){leaderboardModeToggle.innerText=h?"Ranked":"Casual",leaderboardHeader.innerText=h?"Casual Leaderboard":"Ranked Leaderboard",leaderboardSubtitle.innerText=h?"Balls drop in a random order in casual mode.":"Balls always drop in the same order in ranked mode."}function g(){h&&p.length>0||!h&&y.length>0?m(h?p:y):(document.getElementById("leaderboardEntries").innerHTML="",fetch(u+"?mode="+(h?"casual":"ranked")).then((e=>e.json())).then((e=>{h?p=e:y=e,m(e)})))}function m(e){e=e.sort(((e,t)=>t[1]-e[1]));let t=document.getElementById("leaderboardEntries");t.innerHTML="",e.forEach(((e,i)=>{let r=document.createElement("div");r.classList.add("leaderboardEntry"),r.classList.add("nodrop"),r.innerText=`${i+1}.  ${e[0]} - ${e[1]}`,t.appendChild(r);let o=document.createElement("div");r.appendChild(o);let a=document.createElement("img");a.classList.add("leaderboardImage"),a.classList.add("nodrop"),a.src=e[2],a.style.width="100px",a.style.objectFit="cover",a.onclick=t=>{var i;i=e[2],window.open().document.write(`<div style="\n    thisisxssablelolbutidontcarecuzitwouldbekindafunnyifsomebodydidit:true;\n    background-image: url(${i});\n    width: 100vw;\n    height: 100vh;\n    background-size: contain;\n    background-repeat: no-repeat;\n    background-position: center;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n">\n    \n</div>`),setInterval((()=>{p=[],y=[]}),6e4)},o.appendChild(a),0==i&&(r.style.color="gold",o.classList.add("leaderContainer"))}))}leaderboardModeToggle.onclick=()=>{h=!h,f(),g()},g()}))})();