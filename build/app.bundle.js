!function(t){var e={};function i(s){if(e[s])return e[s].exports;var o=e[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(s,o,function(e){return t[e]}.bind(null,o));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=4)}([function(t){t.exports={layout:{canvas:{size:600},main:{width:600,height:380,offsetTop:80,offsetLeft:0},navigation:{width:600,height:80,offsetTop:500,offsetLeft:0},tooltip:{height:70,offsetTop:1}},colors:{shadow:"#e9e8e8",greyLine:"#d0d0d0",greyText:"#8c8c8c",navigationCover:"rgba(234,255,221,0.5)",navigationHandler:"rgba(234,255,221,1)"},fonts:{regular:{fontFamily:"Arial",fontSize:"12px"},highlight:{fontSize:"16px"}}}},,,function(t,e){Number.prototype.between=function(t,e,i){const s=Math.min(t,e),o=Math.max(t,e);return i?this>=s&&this<=o:this>s&&this<o},Array.prototype.findClosestValue=function(t){const e=this.map(e=>Math.abs(e-t)),i=Math.min.apply(Math,e);return this[e.indexOf(i)]},Number.prototype.toFixedNumber=function(t){const e=Math.pow(10,t);return Math.round(this*e)/e}},function(t,e,i){"use strict";i.r(e);i(3);var s=i(0);var o=class{constructor(t){this.data=t,this.animationTime=5,this.targetY=[],this.targetVisibility=!0,this.opacity=1}draw(t){this._needMoveAnimation()&&this._animateTranslation(),this._needFadeAnimation()&&this._animateFade(),this._drawLine(t)}updatePositions(t,e){this.data.positionsX=t.slice(0),this.targetY=e.slice(0)}updateVisibility(t){this.targetVisibility=t}_animateTranslation(){let t=!1;this.data.positionsY=this.data.positionsY.map((e,i)=>{const s=this.targetY[i]-e;return 0!==s&&(t=!0,e=this._recalculatePosition(e,s)),e}),t||(this.targetY=[])}_animateFade(){this.targetVisibility?this.opacity+=.1:this.opacity-=.1,this.opacity=Math.min(this.opacity,1),this.opacity=Math.max(this.opacity,0),this.opacity.between(0,1)||(this.data.visible=this.targetVisibility)}_recalculatePosition(t,e){let i=e/this.animationTime;return e>0?i=Math.min(Math.ceil(i),e):e<0&&(i=Math.max(Math.floor(i),e)),t+=i}_needMoveAnimation(){return this.targetY.length}_needFadeAnimation(){return this.data.visible!==this.targetVisibility}_drawLine(t){t.save(),t.lineWidth=2,t.strokeStyle=this.data.color,t.globalAlpha=this.opacity,t.beginPath();const e=this.data.positionsX[0],i=this.data.positionsY[0];t.moveTo(e,i);for(let e=1;e<this.data.valuesCount;e++){const i=this.data.positionsX[e],s=this.data.positionsY[e];t.lineTo(i,s)}t.stroke(),t.restore()}};var a=class{constructor(t,e){this.index=t,this.color=e,this.visible=!0,this.x=null,this.y=null}setPosition(t,e){this.x=t||null,this.y=e||null}updateVisibility(t){this.visible=t}draw(t){this.x>0&&this.y>0&&this.visible&&(t.save(),t.strokeStyle=this.color,t.fillStyle="#ffffff",t.lineWidth=4,t.beginPath(),t.arc(this.x,this.y,5,0,2*Math.PI),t.stroke(),t.fill(),t.restore())}};var n=class{constructor(t,e,i,s,o){this.minSpaceBetweenVerticalLines=80,this.animationTime=5,this.layout=o,this.positionsX=t,this.captionsX=e,this.originalPositionsY=i.slice(0),this.positionsY=i,this.captionsY=s,this.horizontalLine={offsetLeft:this.layout.offsetLeft+10,length:this.layout.width-20},this.verticalLine={offsetTop:this.layout.offsetTop-20,length:this.layout.height+20},this.xAxisCaptionPositionY=this.layout.offsetTop+this.layout.height+20,this.opacititesX=this.calculateOpacitiesX(),this.hoverPositionX=null,this.targetOpacititesX=[],this.targetPositionsY=[],this.newPositionsY=[],this.newTargetPositionsY=[],this.newCaptionsY=[],this.opacityY=1,this.targetOpacityY=1,this.newOpacityY=0,this.newTargetOpacityY=0}calculateOpacitiesX(){let t=Math.ceil(this.minSpaceBetweenVerticalLines/(this.positionsX[1]-this.positionsX[0]));t=Math.pow(2,Math.round(Math.sqrt(t)));const e=Array(this.positionsX.length).fill(0);for(let i=0;i<=this.positionsX.length;i+=t)e[i]=1;return e}updatePositions(t,e){this.positionsX=t.slice(0),this.targetOpacititesX=this.calculateOpacitiesX(),this.newTargetPositionsY=this.originalPositionsY.slice(0),this.targetOpacityY=0,this.newTargetOpacityY=1,this.newCaptionsY[1]!==e[1]&&(this.newCaptionsY=e.slice(0),this.captionsY[1]>e[1]?(this.targetPositionsY=this.originalPositionsY.map(t=>t-1.1*(this.originalPositionsY[0]-t)),this.newPositionsY=this.originalPositionsY.map(t=>t+.9*(this.originalPositionsY[0]-t))):this.captionsY[1]<e[1]&&(this.targetPositionsY=this.originalPositionsY.map(t=>t+.9*(this.originalPositionsY[0]-t)),this.newPositionsY=this.originalPositionsY.map(t=>t-1.1*(this.originalPositionsY[0]-t))))}setHoverPositionX(t){this.hoverPositionX=t}draw(t){this._needAnimationX()&&this._animateX(),this._needAnimationY()&&(this._animateY(),this._drawGridY(t,this.newPositionsY,this.newCaptionsY,this.newOpacityY)),this._drawGridY(t,this.positionsY,this.captionsY,this.opacityY),this._drawBottomSquare(t),this._drawGridX(t,this.positionsX,this.captionsX,this.opacititesX,!0),null!==this.hoverPositionX&&this._drawVerticalGridLine(t,this.hoverPositionX)}_animateX(){this._animateOpacity("opacititesX","targetOpacititesX")}_animateY(){let t=!1;this.positionsY=this.positionsY.map((e,i)=>{const s=this.targetPositionsY[i]-e;let o=s/this.animationTime;return 0!==s&&(t=!0,s>0?o=Math.min(Math.ceil(o),s):s<0&&(o=Math.max(Math.floor(o),s)),e+=o),e}),this.newPositionsY=this.newPositionsY.map((e,i)=>{const s=this.newTargetPositionsY[i]-e;let o=s/this.animationTime;return 0!==s&&(t=!0,s>0?o=Math.min(Math.ceil(o),s):s<0&&(o=Math.max(Math.floor(o),s)),e+=o),e});let e=this.targetOpacityY-this.opacityY,i=(e/this.animationTime).toFixedNumber(1);0===i&&(this.opacityY=Math.round(this.opacityY),e=0),0!==e&&(t=!0,e>0?i=Math.min(i,e):e<0&&(i=Math.max(i,e)),this.opacityY+=i);let s=this.newTargetOpacityY-this.newOpacityY,o=(s/this.animationTime).toFixedNumber(1);0===o&&(this.newOpacityY=Math.round(this.newOpacityY),s=0),0!==s&&(t=!0,e>0?o=Math.min(o,e):e<0&&(o=Math.max(o,e)),this.newOpacityY+=o),t||(this.positionsY=this.newTargetPositionsY.slice(0),this.captionsY=this.newCaptionsY.slice(0),this.opacityY=this.newOpacityY,this.targetPositionsY=[],this.newPositionsY=[],this.newTargetPositionsY=[])}_animateOpacity(t,e){let i=!1;this[t]=this[t].map((t,s)=>{let o=this[e][s]-t,a=(o/this.animationTime).toFixedNumber(2);return 0===a&&(t=Math.round(t),o=0),0!==o&&(i=!0,o>0?a=Math.min(a,o):o<0&&(a=Math.max(a,o)),t+=a),t}),i||(this[e]=[])}_needAnimationX(){return this.targetOpacititesX.length}_needAnimationY(){return this.targetPositionsY.length}_drawGridX(t,e,i,s,o=!1){t.save();for(let a=0;a<=e.length;a++)t.globalAlpha=s[a],o||this._drawVerticalGridLine(t,e[a]),this._drawGridText(t,i[a],e[a],this.xAxisCaptionPositionY,"center");t.restore()}_drawGridY(t,e,i,s){t.save();for(let o=0;o<e.length;o++)t.globalAlpha=s,this._drawHorizontalGridLine(t,e[o]),this._drawGridText(t,i[o],this.horizontalLine.offsetLeft,e[o]-10,"left");t.restore()}_drawHorizontalGridLine(t,e){t.fillStyle=s.colors.greyLine,t.fillRect(this.horizontalLine.offsetLeft,e-1,this.horizontalLine.length,1)}_drawVerticalGridLine(t,e){t.fillStyle=s.colors.greyLine,t.fillRect(e,this.verticalLine.offsetTop,1,this.verticalLine.length)}_drawGridText(t,e,i,o,a){t.fillStyle=s.colors.greyText,t.font=s.fonts.regular.fontSize+" "+s.fonts.regular.fontFamily,t.lineWidth=1,t.textAlign=a,t.fillText(e,i,o)}_drawBottomSquare(t){t.save(),t.fillStyle="white",t.fillRect(s.layout.main.offsetLeft,s.layout.main.offsetTop+s.layout.main.height,s.layout.main.width,t.canvas.offsetHeight-s.layout.main.height),t.restore()}},r=class{static sortNumbersAsc(t){return t.slice(0).sort((t,e)=>t-e)}static getMinMax(t){return[(t=this.sortNumbersAsc(t))[0],t[t.length-1]]}static getMax(t){return this.sortNumbersAsc(t)[t.length-1]}static isMouseInsideLayout(t,e,i){const{width:s,height:o,offsetTop:a,offsetLeft:n}=i;return t.between(n,n+s)&&e.between(a,a+o)}static formatMonth(t){return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t]}static formatWeekday(t){return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][t]}static formatNumber(t){const e=Math.log(t)/Math.log(1e3)|0;return+(t/Math.pow(1e3,e)).toFixed(2)+("kMGTPEZY"[e-1]||"")}};var h=class{constructor(t,e,i){this.layout=i;const[s,o]=r.getMinMax(t);this.valuesX=t,this.valuesY=e,this.minX=s,this.maxX=o,this.minY=0,this.maxY=r.getMax(e),this.deltaX=this.maxX-this.minX,this.scaleX=1,this.percentsOffsetX=0,this.translateX=0,this.yAxisLinesCount=6}setVisibleRange(t){const[e,i]=t,s=i-e;this.scaleX=1/s,this.percentsOffsetX=e,this.translateX=e*this.layout.width*this.scaleX}setMaxY(t){this.stepY=this._calculateAxisYStep(t),this.maxY=this._calculateMaxY(t)}coordsToPxPosition(t,e){return[this.xCoordToXPxPosition(t),this.yCoordToYPxPosition(e)]}xCoordToXPxPosition(t){return this._coordToPxPosition(t,this.minX,this.deltaX,this.layout.width,this.layout.offsetLeft-this.translateX,this.scaleX)}yCoordToYPxPosition(t){return t=this.maxY-t+this.minY,this._coordToPxPosition(t,this.minY,this.maxY,this.layout.height,this.layout.offsetTop)}pxPositionXToValueX(t){const e=this._pxPositionToCoord(t,this.minX,this.deltaX,this.layout.width,this.percentsOffsetX,this.scaleX);return this.valuesX.findClosestValue(e)}_calculateAxisYStep(t){return Math.ceil(t/this.yAxisLinesCount)}_calculateMaxY(t){return Math.ceil(t/this.stepY)*this.stepY}_coordToPxPosition(t,e,i,s,o,a=1){const n=(t-e)/i;let r=Math.round(n*s);return r*=a,r+=o}_pxPositionToCoord(t,e,i,s,o,a){let n=t/s;return n/=a,n+=o,Math.round(n*i)+e}};var l=class{constructor(t){this.chartsData=t,this.converter=null,this.visibleRange=[0,1],this.visibleCharts=[]}setLayout(t){this.converter=new h(this.getAllValuesX(),this.getAllValuesY(),t)}setVisibleRange(t){this.visibleRange=t,this.converter.setVisibleRange(t),this.converter.setMaxY(this.getMaxVisibleValueY())}getNormalizedChartsData(){const t=[];for(let e=0;e<this.getChartsAmount();e++)t.push(this.prepareChartData(e));return t}getBaseName(){return"Chart "+(this.chartsData.index+1)}getNames(){const t=[];return this.chartsData.columns.forEach(e=>{const i=e[0];this.chartsData.names[i]&&t.push(this.chartsData.names[i])}),t}getColors(){const t=[];return this.chartsData.columns.forEach(e=>{const i=e[0];this.chartsData.colors[i]&&t.push(this.chartsData.colors[i])}),t}getAllValuesX(){return this.getValuesInColumn(this.chartsData.types.x)}getAllValuesY(){const t=this.chartsData.columns.filter(t=>t[0]!==this.chartsData.types.x);let e=[];return t.forEach(t=>e=e.concat(t.slice(1))),e}getMaxVisibleValueY(){const[t,e]=this.visibleRange;let i=null;return this.getNormalizedChartsData().filter(t=>t.visible).forEach(s=>{const o=Math.floor(s.valuesY.length*t),a=Math.ceil(s.valuesY.length*e),n=s.valuesY.slice(o,a),h=r.getMax(n);i=i?Math.max(i,h):h}),i||(i=r.getMax(this.getAllValuesY())),i}getPositionsOnAxisX(){return this.getAllValuesX().map(t=>this.converter.xCoordToXPxPosition(t))}getPositionsOnAxisY(){return this.getCaptionsOnAxisY().map(t=>this.converter.yCoordToYPxPosition(t))}getCaptionsOnAxisX(){return this.getAllValuesX().map(t=>{const e=new Date(t);return r.formatMonth(e.getMonth())+" "+e.getDate()})}getCaptionsOnAxisY(){const t=[];for(let e=this.converter.minY;e<this.converter.maxY;e+=this.converter.stepY)t.push(e);return t}getValuesInColumn(t){return this.chartsData.columns.filter(e=>t===e[0])[0].slice(1)}getChartsAmount(){return this.chartsData.columns.length-1}prepareChartData(t){const e=`y${t}`,i=this.getAllValuesX(),s=this.getValuesInColumn(e),o=i.length,[a,n]=this.calculatePositions(i,s,o);return{index:t,visible:this.visibleCharts.indexOf(t)<0,type:this.chartsData.types[e],color:this.chartsData.colors[e],name:this.chartsData.names[e],valuesCount:o,valuesX:i,valuesY:s,positionsX:a,positionsY:n}}calculatePositions(t,e,i){const s=[],o=[];for(let a=0;a<i;a++){const i=t[a],n=e[a],[r,h]=this.converter.coordsToPxPosition(i,n);s.push(r),o.push(h)}return[s,o]}getHoverPosition(t,e){let i=null;if(r.isMouseInsideLayout(t,e,this.converter.layout)){const e=this.converter.pxPositionXToValueX(t);i=this.converter.valuesX.indexOf(e)}return i}toggleChart(t){this.visibleCharts[t]=this.visibleCharts.indexOf(t)<0?t:null,this.converter.setMaxY(this.getMaxVisibleValueY())}};var c=class{constructor(t){this.offsetTop=s.layout.tooltip.offsetTop,this.position=null,this.captionX=null,this.captionsY=[],this.pixelsPerChar=10,this.minColumnWidth=70,this.updateChartsData(t)}updateChartsData(t){this.chartsData=t,this.chartsDataVisible=t.filter(t=>t.visible),this.calculateTooltipSize()}calculateTooltipSize(){this.width=0,this.chartsDataVisible.forEach(t=>{let e=t.valuesY[t.valuesY.length-1].toString().length*this.pixelsPerChar;e=Math.max(e,this.minColumnWidth),this.width+=e}),this.halfWidth=this.width/2,this.columnWidth=this.width/this.chartsDataVisible.length}setHover(t,e,i){this.position=t,this.captionX=e,this.captionsY=i}draw(t){if(null!==this.position){const e=this.position-this.halfWidth;this._drawRect(t,e),this._drawText(t,e+10,this.captionX)}}_drawRect(t,e){t.save(),t.strokeStyle=s.colors.greyLine,t.fillStyle="white",t.shadowColor=s.colors.shadow,t.shadowOffsetY=1,t.shadowBlur=1,t.beginPath(),t.rect(e,this.offsetTop,this.width,s.layout.tooltip.height),t.stroke(),t.fill(),t.restore()}_drawText(t,e,i){let s=this.offsetTop+20;this._drawDate(t,e,s,i),s+=25;let o=0;this.captionsY.forEach((i,a)=>{const n=this.chartsData[a];n.visible&&(this._drawValue(t,e+o,s,i,n.color),this._drawChartName(t,e+o,s+15,n.name,n.color),o+=this.columnWidth)})}_drawDate(t,e,i,o){t.save(),t.fillStyle="black",t.font=s.fonts.highlight.fontSize+" "+s.fonts.regular.fontFamily,t.fillText(o,e,i),t.restore()}_drawValue(t,e,i,o,a){t.save(),t.fillStyle=a,t.font="bold "+s.fonts.highlight.fontSize+" "+s.fonts.regular.fontFamily,t.fillText(o,e,i),t.restore()}_drawChartName(t,e,i,o,a){t.save(),t.fillStyle=a,t.font=s.fonts.regular.fontSize+" "+s.fonts.regular.fontFamily,t.fillText(o,e,i),t.restore()}};var u=class{constructor(t){const e=t.getBoundingClientRect();this.canvas=t,this.offsetTop=e.top,this.offsetLeft=e.left,this.dataManager=null,this.charts=[],this.hovers=[],this.grid=null,this.tooltip=null}setChartsData(t){return this.dataManager=new l(t),this}setLayout(t){return this.dataManager.setLayout(t),this}setVisibleRange(t){return this.dataManager.setVisibleRange(t),this.updateChartsPositions(),this.grid&&this.updateGrid(),this}createCharts(){return this.dataManager.getNormalizedChartsData().forEach(t=>{switch(t.type){case"line":const e=new o(t);this.charts.push(e);break;default:console.error(`unsupported chart type ${type}`)}}),this.charts}updateChartsPositions(){const t=this.dataManager.getNormalizedChartsData();this.charts.filter(t=>"function"==typeof t.updatePositions).forEach(e=>{const{positionsX:i,positionsY:s}=t[e.data.index];e.updatePositions(i,s)})}updateChartsVisibility(){const t=this.dataManager.getNormalizedChartsData();this.charts.forEach(e=>{const{visible:i}=t[e.data.index];e.updateVisibility(i)}),this.hovers.forEach(e=>{const{visible:i}=t[e.index];e.updateVisibility(i)}),this.tooltip&&this.tooltip.updateChartsData(t),this.updateChartsPositions()}updateGrid(){this.grid.updatePositions(this.dataManager.getPositionsOnAxisX(),this.dataManager.getCaptionsOnAxisY())}createGrid(){return this.grid=new n(this.dataManager.getPositionsOnAxisX(),this.dataManager.getCaptionsOnAxisX(),this.dataManager.getPositionsOnAxisY(),this.dataManager.getCaptionsOnAxisY(),this.dataManager.converter.layout),this.grid}createTooltip(){return this.tooltip=new c(this.charts.map(t=>t.data)),this.tooltip}toggleChart(t){this.dataManager.toggleChart(t),this.updateChartsVisibility(),this.grid&&this.updateGrid()}createHovers(){return this.dataManager.getNormalizedChartsData().forEach(t=>{switch(t.type){case"line":this.hovers.push(new a(t.index,t.color))}}),this._bindHoverEvents(),this.hovers}_bindHoverEvents(){this.canvas.addEventListener("mousemove",t=>this._onMouseMove(t)),this.canvas.addEventListener("mouseleave",t=>this._onMouseLeave(t))}_onMouseMove(t){const e=Math.round(t.clientX-this.offsetLeft+window.scrollX),i=Math.round(t.clientY-this.offsetTop+window.scrollY);this._handleMouseMove(e,i)}_onMouseLeave(){this._handleMouseMove(-100,-100)}_handleMouseMove(t,e){const i=this.dataManager.getHoverPosition(t,e),s=this.dataManager.getAllValuesX()[i],o=this.dataManager.converter.xCoordToXPxPosition(s),a=[];if(this.charts.forEach(t=>{const e=t.data.valuesY[i];a.push(e)}),this.hovers.forEach((t,e)=>{const i=a[e],s=this.dataManager.converter.yCoordToYPxPosition(i);t.setPosition(o,s)}),this.grid&&this.grid.setHoverPositionX(o),this.tooltip){const t=new Date(s),e=r.formatWeekday(t.getDay())+", "+r.formatMonth(t.getMonth())+" "+t.getDate();this.tooltip.setHover(o,e,a)}}};const d=.25,g=.5,p=[],v=[];function f(t,e,i){p[t]=[e,i],v.forEach(t=>t())}function m(t){return p[t]||function(t){p[t]=[d,g]}(t),p[t]}var M=class{constructor(t,e){const i=m();this.chartsFactory=new u(t.canvas).setChartsData(e).setLayout(s.layout.main).setVisibleRange(i),this.ctx=t,this.charts=this.chartsFactory.createCharts(),this.hovers=this.chartsFactory.createHovers(),this.grid=this.chartsFactory.createGrid(),this.tooltip=this.chartsFactory.createTooltip(),this.index=e.index,this._bindEvents()}draw(){this.grid.draw(this.ctx),this.charts.forEach(t=>t.draw(this.ctx)),this.hovers.forEach(t=>t.draw(this.ctx)),this.tooltip.draw(this.ctx)}toggleChart(t){this.chartsFactory.toggleChart(t)}_bindEvents(){var t;t=(()=>this.chartsFactory.setVisibleRange(m(this.index))),v.push(t)}},x=class{constructor(t,e){const[i,o]=m();this.ctx=t,this.chartsFactory=new u(this.ctx.canvas).setChartsData(e).setLayout(s.layout.navigation),this.charts=this.chartsFactory.createCharts(),this.rangeFromPx=this._convertRangePercentsToPx(i),this.rangeToPx=this._convertRangePercentsToPx(o),this.prevRangeMoveMouseX=null,this.deltaRangeMoveMouseX=0,this.mouseBorderWidth=40,this.mouseBorderWidthHalf=Math.round(this.mouseBorderWidth/2),this.prevLeftBorderMoveMouseX=null,this.prevRightBorderMoveMouseX=null,this.deltaLeftBorderMoveMouseX=0,this.deltaRightBorderMoveMouseX=0,this.minVisibleRangeDelta=60,this.index=e.index,this.mouseX=null,this.mouseY=null,this.bindEvents()}bindEvents(){this.clickAndMouseMoveHandler=this.onClickAndMouseMove.bind(this),this.ctx.canvas.addEventListener("mousedown",t=>this.onMouseDown(t),!1),this.ctx.canvas.addEventListener("mouseleave",t=>this.onMouseLeave(t),!1),this.ctx.canvas.addEventListener("mousemove",t=>this.onMouseMove(t),!1),document.addEventListener("mouseup",t=>this.onMouseUp(t),!1)}onMouseDown(t){document.addEventListener("mousemove",this.clickAndMouseMoveHandler,!1),this._actualizeMouseLocalPosition(t),this.prevLeftBorderMoveMouseX=this._isMouseOnLeftRangeBorder()?this.mouseX:null,this.prevRightBorderMoveMouseX=this._isMouseOnRightRangeBorder()?this.mouseX:null,this.prevLeftBorderMoveMouseX||this.prevRightBorderMoveMouseX||(this.prevRangeMoveMouseX=this._isMouseOnRange()?this.mouseX:null)}onMouseMove(t){this._actualizeMouseLocalPosition(t),document.body.style.cursor=this._isMouseOnRangeBorder()?"ew-resize":this._isMouseOnRange()?"grab":"default"}onClickAndMouseMove(t){const e=this._isMouseOutsideOfPage(t);this._actualizeMouseLocalPosition(t),this.prevRangeMoveMouseX&&(this.deltaRangeMoveMouseX=this.mouseX-this.prevRangeMoveMouseX,this._handleRangeMove(),e||(this.prevRangeMoveMouseX=this.mouseX)),this.prevLeftBorderMoveMouseX&&(this.deltaLeftBorderMoveMouseX=this.mouseX-this.prevLeftBorderMoveMouseX,this._handleRangeLeftBorderMove(),e||(this.prevLeftBorderMoveMouseX=this.mouseX)),this.prevRightBorderMoveMouseX&&(this.deltaRightBorderMoveMouseX=this.mouseX-this.prevRightBorderMoveMouseX,this._handleRangeRightBorderMove(),e||(this.prevRightBorderMoveMouseX=this.mouseX))}onMouseLeave(){document.body.style.cursor="default"}onMouseUp(){document.removeEventListener("mousemove",this.clickAndMouseMoveHandler,!1),this.prevRangeMoveMouseX=null,this.prevLeftBorderMoveMouseX=null,this.prevRightBorderMoveMouseX=null}_handleRangeMove(){let t;document.body.style.cursor="grabbing";let e=!1;this.deltaRangeMoveMouseX>0?(t=this._getIncreasingDelta(this.deltaRangeMoveMouseX),e=!0):this.deltaRangeMoveMouseX<0&&(t=this._getDecreasingDelta(this.deltaRangeMoveMouseX),e=!0),e&&(this.rangeFromPx+=t,this.rangeToPx+=t,this._updateRange())}_handleRangeLeftBorderMove(){let t,e=!1;this.deltaLeftBorderMoveMouseX>0?(t=Math.min(this.deltaLeftBorderMoveMouseX,this.rangeToPx-this.minVisibleRangeDelta-this.rangeFromPx),e=!0):this.deltaLeftBorderMoveMouseX<0&&(t=this._getDecreasingDelta(this.deltaLeftBorderMoveMouseX),e=!0),e&&(this.rangeFromPx+=t,this._updateRange())}_handleRangeRightBorderMove(){let t,e=!1;this.deltaRightBorderMoveMouseX>0?(t=this._getIncreasingDelta(this.deltaRightBorderMoveMouseX),e=!0):this.deltaRightBorderMoveMouseX<0&&(t=Math.max(this.deltaRightBorderMoveMouseX,-(this.rangeToPx-this.rangeFromPx-this.minVisibleRangeDelta)),e=!0),e&&(this.rangeToPx+=t,this._updateRange())}_updateRange(){const t=this._convertRangePxToPercents(this.rangeFromPx),e=this._convertRangePxToPercents(this.rangeToPx);f(this.index,t,e)}_isMouseOnRange(){return this.mouseX.between(this.rangeFromPx,this.rangeToPx)&&this._isMouseYInsideLayout()}_isMouseOnRangeBorder(){return this._isMouseOnLeftRangeBorder()||this._isMouseOnRightRangeBorder()}_isMouseOnLeftRangeBorder(){return this.mouseX.between(this.rangeFromPx-this.mouseBorderWidthHalf,this.rangeFromPx+this.mouseBorderWidthHalf)&&this._isMouseYInsideLayout()}_isMouseOnRightRangeBorder(){return this.mouseX.between(this.rangeToPx-this.mouseBorderWidthHalf,this.rangeToPx+this.mouseBorderWidthHalf)&&this._isMouseYInsideLayout()}_isMouseOutsideOfPage(t){return t.clientY<=0||t.clientX<=0||t.clientX>=window.innerWidth||t.clientY>=window.innerHeight}_isMouseYInsideLayout(){const t=this.ctx.canvas.getBoundingClientRect();return this.mouseY.between(s.layout.navigation.offsetTop,t.height)}_getIncreasingDelta(t){return Math.min(s.layout.navigation.width-this.rangeToPx,t)}_getDecreasingDelta(t){return Math.max(-this.rangeFromPx,t)}_convertRangePercentsToPx(t){return t*s.layout.navigation.width}_convertRangePxToPercents(t){return t/s.layout.navigation.width}_actualizeMouseLocalPosition(t){const e=this.ctx.canvas.getBoundingClientRect();this.mouseX=Math.round(t.clientX-e.left),this.mouseY=Math.round(t.clientY-e.top)}draw(){this.drawHandler(),this.charts.forEach(t=>t.draw(this.ctx)),this.drawCover()}drawHandler(){this.drawHandlerTopBottom(s.layout.navigation.offsetTop),this.drawHandlerTopBottom(s.layout.navigation.offsetTop+s.layout.navigation.height-3),this.drawHandlerSide(this.rangeFromPx),this.drawHandlerSide(this.rangeFromPx),this.drawHandlerSide(this.rangeToPx-5)}drawHandlerTopBottom(t){this.ctx.save(),this.ctx.fillStyle=s.colors.navigationHandler,this.ctx.fillRect(this.rangeFromPx,t,this.rangeToPx-this.rangeFromPx,3),this.ctx.restore()}drawHandlerSide(t){this.ctx.save(),this.ctx.fillStyle=s.colors.navigationHandler,this.ctx.fillRect(t,s.layout.navigation.offsetTop,5,s.layout.navigation.height),this.ctx.restore()}drawCover(){const t=s.layout.navigation.width,e=s.layout.navigation.offsetLeft;this.drawCoverPart(e,this.rangeFromPx),this.drawCoverPart(e+this.rangeToPx,t-this.rangeToPx)}drawCoverPart(t,e){this.ctx.save(),this.ctx.fillStyle=s.colors.navigationCover,this.ctx.fillRect(t,s.layout.navigation.offsetTop,e,s.layout.navigation.height),this.ctx.restore()}toggleChart(t){this.chartsFactory.toggleChart(t)}};var y=class{constructor(t){this._init(t),this._bindEvents()}_init(t){const e=new l(t),i=e.getBaseName(),s=e.getNames(),o=e.getColors(),a=e.getChartsAmount(),n=this._createNavButtons(t,i);this._createChartTitle(i);const r=this._createCanvas(),h=this._createChartButtons(s,o,a);this.ctx=r,this.main=new M(r,t),this.navigation=new x(r,t),this.chartButtons=h,this.navButton=n}draw(){this._clear(),this.main.draw(),this.navigation.draw()}_createNavButtons(t,e){const i=document.createElement("button");return i.innerHTML=e,document.getElementById("navigation").appendChild(i),i}_createCanvas(){const t=document.createElement("canvas"),e=Math.min(s.layout.canvas.size,document.getElementById("charts").offsetWidth),i=s.layout.canvas.size,o=2*e,a=2*i;t.width=o,t.height=a,t.style.width=e+"px",t.style.height=i+"px";const n=t.getContext("2d");return n.scale(2,2),document.getElementById("charts").appendChild(t),n}_createChartTitle(t){const e=document.createElement("h1");e.innerHTML=t,document.getElementById("charts").appendChild(e)}_createChartButtons(t,e,i){const s=[],o=document.createElement("div");o.className="chart-buttons",document.getElementById("charts").appendChild(o);for(let a=0;a<i;a++){const i=t[a],n=e[a],r=document.createElement("button");r.className="chart-buttons__button active";const h=document.createElement("span");h.className="chart-buttons__button__checkbox",h.style.backgroundColor=n,r.appendChild(h);const l=document.createElement("span");l.innerHTML=i,r.appendChild(l),o.appendChild(r),r.addEventListener("click",()=>r.classList.toggle("active"),!1),s.push(r)}return s}_clear(){this.ctx.clearRect(0,0,this.ctx.canvas.offsetWidth,this.ctx.canvas.offsetHeight)}_bindEvents(){this.chartButtons.forEach((t,e)=>{t.addEventListener("click",()=>this._toggleChart(e),!1)}),this.navButton.addEventListener("click",()=>this._scrollToChart(),!1)}_toggleChart(t){this.main.toggleChart(t),this.navigation.toggleChart(t)}_scrollToChart(){this.ctx.canvas.scrollIntoView({behavior:"smooth"})}};new class{constructor(t){this.times=[],this.widgets=[],t.forEach((t,e)=>{t.index=e,this.widgets.push(new y(t))}),window.requestAnimationFrame(()=>this.draw())}draw(){this.widgets.forEach(t=>t.draw());const t=performance.now();for(;this.times.length>0&&this.times[0]<=t-1e3;)this.times.shift();this.times.push(t),document.getElementById("fps").innerText=this.times.length,window.requestAnimationFrame(()=>this.draw())}}(window.DATA)}]);