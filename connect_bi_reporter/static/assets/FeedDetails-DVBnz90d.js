import{s as $,V as M}from"./connect-DBSWfLqd.js";import{o as c,b as v,g as j,n as q,m as V,u as z,r as H,x as R,z as O,k as d,j as o,K as W,s as X,c as F,a as N,h as t,F as K,d as n,e as C,l as P,t as E,p as J,q as Q}from"./vendor-D5PxE7d-.js";import{D as Y,_ as Z,v as U,F as ee,C as h,a as te,b as w,S as ae,L as se}from"./main-BaF1DAEK.js";import{_ as G,u as A,D as f}from"./DetailItem-CcqWq6Tw.js";const oe={__name:"DetailItemGroup",props:{separated:{type:Boolean,default:!1}},setup(i){return(_,u)=>(c(),v("div",{class:q(["detail-item-group",{"detail-item-group_separated":i.separated}])},[j(_.$slots,"default",{},void 0,!0)],2))}},B=G(oe,[["__scopeId","data-v-98561949"]]),de={__name:"EditFeedDialog",props:V({feed:{type:Object,required:!0}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:V(["updated"],["update:modelValue"]),setup(i,{emit:_}){const u=z(i,"modelValue"),r=i,x=_,D=$(),{request:a}=A(D,!0),e=H({credentialId:"",fileName:"",description:""}),p={credentialId:[U.required()],fileName:[U.required()]},I=[{key:"destination",label:"Destination",includes:["credentialId","fileName"]}],b=async()=>{await a(`/api/feeds/${r.feed.id}`,"PUT",{credential:{id:e.credentialId},file_name:e.fileName,description:e.description}),x("updated")};return R([()=>r.feed,u],()=>{var m;e.credentialId=((m=r.feed.credential)==null?void 0:m.id)||"",e.fileName=r.feed.file_name||"",e.description=r.feed.description||""},{immediate:!0}),(m,s)=>(c(),O(Z,{modelValue:u.value,"onUpdate:modelValue":s[3]||(s[3]=l=>u.value=l),form:e,"on-submit":b,rules:p,tabs:I,title:"Edit Feed",mode:"edit"},{destination:d(()=>[o(Y,{"credential-id":e.credentialId,"onUpdate:credentialId":s[0]||(s[0]=l=>e.credentialId=l),"file-name":e.fileName,"onUpdate:fileName":s[1]||(s[1]=l=>e.fileName=l),description:e.description,"onUpdate:description":s[2]||(s[2]=l=>e.description=l)},null,8,["credential-id","file-name","description"])]),_:1},8,["modelValue","form"]))}},ie=i=>(J("data-v-874f08f2"),i=i(),Q(),i),le=["title"],ne={slot:"actions",class:"header-actions"},re=["background-color","color"],ce=ie(()=>n("span",null,"Edit",-1)),ue=[ce],pe=["background-color"],me=["color"],fe={class:"header"},_e=["icon-name","icon-color","text"],be=["current-tab"],ve={key:0,slot:"general",class:"general-tab"},ge={__name:"FeedDetails",setup(i){const _=W(),u=X(),r=$(),{loading:x,request:D,result:a}=A(r),e=F(()=>_.params.id),p=F(()=>ae[a.status]),I=[{value:"general",label:"General"},{value:"uploads",label:"Uploads"}],b=N("general"),m=()=>{u.replace({name:"feeds"})},s=()=>D(`/api/feeds/${e.value}`),l=({detail:y})=>{b.value=y},k=N(!1),L=()=>{k.value=!0};return R(e,s,{immediate:!0}),(y,T)=>(c(),v("ui-view",{title:e.value,"assistive-title":"Feed Details",style:{height:"inherit"},"show-back-button":"",onGoBack:m},[t(x)?(c(),O(se,{key:0})):(c(),v(K,{key:1},[n("div",ne,[n("ui-button",{class:"header-button","background-color":t(h).WHITE,color:t(h).TEXT,height:"36px",onClicked:L},ue,40,re),o(ee,{feed:t(a),onEnabled:s,onDisabled:s,onUploaded:s,onDeleted:m},{default:d(()=>[n("ui-button",{class:"header-button","background-color":t(h).WHITE,height:"36px",width:"36px"},[n("ui-icon",{class:"actions-menu__trigger-icon",color:t(h).TEXT,"icon-name":"googleArrowDropDownBaseline"},null,8,me)],8,pe)]),_:1},8,["feed"])]),n("div",fe,[o(B,null,{default:d(()=>[o(f,{title:"Report Schedule"},{"body-text":d(()=>{var g;return[o(te,{to:t(M).reportsScheduleDetails,params:(g=t(a).schedule)==null?void 0:g.id},{default:d(()=>{var S;return[P(E((S=t(a).schedule)==null?void 0:S.id),1)]}),_:1},8,["to","params"])]}),_:1}),o(f,{title:"Status"},{content:d(()=>[p.value?(c(),v("ui-status",{key:0,"icon-name":p.value.icon,"icon-color":p.value.color,text:p.value.text},null,8,_e)):C("",!0)]),_:1})]),_:1})]),n("ui-tabs",{"current-tab":b.value,tabs:I,onClickTab:l},[b.value==="general"?(c(),v("div",ve,[o(f,{title:"Credentials","body-text":t(a).credential.id},null,8,["body-text"]),o(f,{title:"Description"},{"body-text":d(()=>[n("span",{class:q({"assistive-color":!t(a).description})},E(t(a).description||"—"),3)]),_:1}),o(B,{separated:""},{default:d(()=>[o(f,{title:"Created","assistive-text":t(a).events.created.by.id},{"body-text":d(()=>[o(w,{date:t(a).events.created.at},null,8,["date"])]),_:1},8,["assistive-text"]),o(f,{title:"Updated","assistive-text":t(a).events.updated.by.id},{"body-text":d(()=>[o(w,{date:t(a).events.updated.at},null,8,["date"])]),_:1},8,["assistive-text"])]),_:1})])):C("",!0)],40,be)],64)),o(de,{modelValue:k.value,"onUpdate:modelValue":T[0]||(T[0]=g=>k.value=g),feed:t(a),onUpdated:s},null,8,["modelValue","feed"])],40,le))}},ke=G(ge,[["__scopeId","data-v-874f08f2"]]);export{ke as default};