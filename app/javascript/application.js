(()=>{"use strict";const e=class{constructor(e,t="notice",s){if(this.type=t,this.parent=e,this.balloon=document.createElement("div"),this.balloon.style.position="relative",this.balloon.classList.add("balloon"),this.balloon.classList.add("error"===this.type?"text-danger":"text-info"),this.balloon.classList.add(t),this.balloon.innerText=s,"error"===this.type){const e=document.createElement("span");e.innerHTML=`<a href="/bug-report?${new URLSearchParams({error:s})}">Report</a>`,e.style.position="absolute",e.style.right="7px",e.style.bottom="4px",this.balloon.appendChild(e)}this.closeButton=document.createElement("span"),this.balloon.appendChild(this.closeButton),this.closeButton.classList.add("close-button"),this.close=this.close.bind(this),this.closeButton.addEventListener("click",this.close),this.opacity=1,this.parent.appendChild(this.balloon)}close(e){this.interval=setInterval((()=>{this.opacity>0?(this.opacity-=.1,this.balloon.style.opacity=this.opacity):(this.balloon.remove(),clearInterval(this.interval))}),20)}};class t{constructor(e,t,s={},a,i){this.bar=document.createElement("progress"),this.status=document.createElement("span"),this.statusBox=document.createElement("p"),this.loadingImage=new Image,this.loadingImage.src=["https://cl-helper-development.s3.amazonaws.com/loading-box.gif","https://cl-helper-development.s3.amazonaws.com/loading-ball.gif"][Math.floor(2*Math.random())],this.loadingImage.id="loading-gif",this.container=e.parentElement,this.originalForm=e,e.remove(),this.popUp=document.createElement("dialog"),this.action=a,this.complete=0,this.timeElapsed=0,this.resourceId,this.progressMessages=["Dipping pen...","Mixing Ink...","Ruffling paper..."],this.defaultMessage="Writing... This can take a few minutes.",this.completionCallback||=i;const n=document.createElement("button");n.innerText="x",n.addEventListener("click",(()=>{this.popUp.remove(),this.popUp.close()})),this.popUp.append(n),this.popUp.append(document.createElement("br")),this.popUp.append(this.bar),this.statusBox.append(this.status),this.statusBox.append(this.loadingImage),this.popUp.append(this.statusBox),this.container.append(this.popUp),this.popUp.showModal(),this.bar.innerText=0,this.bar.max=100,this.status.innerHTML="Getting Started...",fetch(t,s).then((e=>{this.loadingCallback(e)})).catch((()=>{this.popUp.remove(),this.failureCallback()}))}incComplete(e){this.complete+=e,this.bar.innerText=this.complete,this.bar.value=this.complete}async loadingCallback(e){if(e.ok){const t=await e.json();this.request_id=t.id,this.interval=setInterval((async()=>{const e=await fetch(`/check/${this.request_id}`),t=await e.json();t.complete?(clearInterval(this.interval),t.ok?(this.messages=t.messages,this.completionCallback(t.resource_id)):this.failureCallback(JSON.parse(t.messages))):this.timeElapsed>240&&(clearInterval(this.interval),this.failureCallback("Timeout")),this.status.innerText=this.progressMessages.length?this.progressMessages.pop():this.defaultMessage,this.timeElapsed+=5}),5e3)}}async completionCallback(e){this.complete=100,this.bar.innerText=100,this.bar.value=100;let t,s,a=5;switch(this.status.innerText=`Complete! Redirecting in ${a}.....`,this.action){case"listings#generate":this.nextPath=`/listings/${e}/`;break;case"letters#generate":this.nextPath=`/letters/${e}/`;break;case"profiles#new":t=JSON.parse(this.messages),s=new URLSearchParams(t).toString(),this.nextPath="/profiles/new?"+s;break;case"profiles#edit":t=JSON.parse(this.messages),s=new URLSearchParams(t).toString(),this.nextPath=`/profiles/${e}/edit?`+s+"&m=Profile+Not+Yet+Saved";break;case"express#generate":this.nextPath=`/temp/${e}`;break;case"express-member#generate":this.nextPath=`/letters/${e}`;break;default:this.nextPath="/"}setTimeout((()=>{window.location.href=window.location.origin+this.nextPath}),5e3),setInterval((()=>{this.status.innerText="Complete! Redirecting in "+--a+".".repeat(a)}),990)}failureCallback(t){console.error("Request Failed: ",t.join("\n"));const s=document.getElementById("alert-container");t.forEach((t=>{new e(s,"error",t)})),this.status.innerText="ERROR";const a=document.createElement("button");a.classList.add("btn"),a.classList.add("btn-primary"),a.innerText="Try Again?",a.addEventListener("click",(e=>{this.container.append(this.originalForm),this.bar.remove(),this.status.remove(),this.loadingImage.remove(),a.remove()})),this.container.append(a)}}const s=function(e){e.preventDefault();const s=e.target,a={method:s.querySelector("input[name=_method]")?s.querySelector("input[name=_method]").value:s.method||"GET",body:{},headers:{}};a.headers["Content-Type"]="application/json";const i=s.querySelectorAll("input, textarea, select");let n=new URLSearchParams;i.forEach((e=>{if(e.name)switch(e.type){case"radio":e.checked&&n.append(e.name,e.value);break;case"file":if(a.body.link)break;a.body=e.files[0];const t=document.getElementById("resume-format").value;"PDF"===t?(a.headers["Content-Type"]="application/pdf",n.append("resume-format","PDF")):"DOCX"===t&&(a.headers["Content-Type"]="application/vnd.openxmlformats-officedocument.wordprocessingml.document",n.append("resume-format","DOCX"));break;default:"authenticity_token"===e.name?a.headers["X-CSRF-Token"]=e.value:n.append(e.name,e.value)}})),"application/json"===a.headers["Content-Type"]&&(a.body=JSON.stringify(a.body)),new t(s,s.action+"?"+n.toString(),a,s.dataset?.action)};document.addEventListener("DOMContentLoaded",(()=>{Array.from(document.getElementsByClassName("ajaxForm"))?.forEach((e=>{e.addEventListener("submit",s)}));const t=document.getElementById("alert-container");Array.from(document.getElementsByClassName("balloon-message"))?.forEach((s=>{new e(t,s.dataset.type,s.dataset.text)}))}))})();