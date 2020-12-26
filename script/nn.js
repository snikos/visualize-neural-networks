"use strict";
fetch('chart.json')
  .then( data => data.json() )
  .then( res => {

const CHART_WIDTH = 320;
const CHART_HEIGHT = 200;

//const copy = json;
const copy = res;
const svgNetwork = d3.select('.svgNetwork')
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT)
    .classed('snw', true);

const groupGrip = svgNetwork.append('g');
const groupLine = svgNetwork.append('g');
const groupCirc = svgNetwork.append('g');
const groupMoon = svgNetwork.append('g');
const groupLight= svgNetwork.append('g');

let curArr = copy.chart2;

function setColor(type){
	const bgs = ['#f1c605','#f1c605','#f1c605',"#6cc805","#6cc805","#6cc805","#fe6500","#fe6500","#0298f7","#0298f7","#0298f7","#fe9bf6","#fe9bf6","#fe9bf6"];
	return bgs[type.split('_')[1]];
}

function updateLight(array){

    var arc = d3.arc().innerRadius(40).outerRadius(40);

	groupLight.selectAll('path')
	    .data(array, d=>d)
	    .join('path')
	    .attr('class', 'light')
	    .attr('d', arc({startAngle: 0, endAngle: -(Math.PI/2)}))
	    .attr("transform", "translate(75,75)")
		.attr('stroke', '#999')
		.attr('stroke-width', 1)
		.attr('fill', 'none');
	
	groupLight.selectAll('path').exit().remove();
}

function updateLine(array){
	groupLine.selectAll('line')
	    .data(array, d=>d)
	    .join('line')
	    .attr('class', 'link')
	    .attr('x1', d=>d[0])
	    .attr('y1', d=>d[1])
	    .attr('x2', d=>d[2])
	    .attr('y2', d=>d[3])
	    .attr('stroke-width', 1)
	    .attr('stroke', '#767676');
	    //.attr('stroke', (d) => d.color);
	
	groupLine.selectAll('line').exit().remove();
}

function updateGrip(array){
	groupGrip.selectAll('circle')
		.data(array, data => data)
		.join('circle')
		.attr('r', 6)
		.attr('cx', d=>d[0])
		.attr('cy', d=>d[1]-10)
		.attr('stroke-width', 1)
		.attr('stroke', '#333333')
		.attr('fill', 'none');

	groupGrip.selectAll('circle').exit().remove();
}

function updateCircle(array){
	groupMoon.selectAll('circle')
		.data(array, data => data)
		.join('circle')
		.attr('r', 6)
		.attr('cx', d=>d[0])
		.attr('cy', d=>d[1])
		.attr('stroke-width', 1)
		.attr('stroke', '#333333')
		.attr('fill', 'none');

	groupMoon.selectAll('circle').exit().remove();
}

function updateTriangle(array){
    let triangle = d3.symbol().type(d3.symbolTriangle);
    groupMoon.selectAll('path')
		.data(array, data => data)
		.join('path')
	    .attr('d', triangle.size(60))
	    .attr('transform', (d) => `translate(${d[0]},${d[1]})`)
	    .attr('stroke-width', 1)
	    .attr('stroke', '#333333')
	    .attr('fill', 'none');

	groupMoon.selectAll('path').exit().remove();
}

const typesBox = d3.select('#listTypes');

function showTypes(data){
	const li = typesBox.selectAll('li')
		.data(data, d=>d)
		.enter()
		.append('li')
		.classed('list-group-item', true);

	const sg = li.append('svg')
	.attr('height', 20)
	.attr('width', 20);

	sg.append('circle')
	.attr('r', 10)
	.attr('cx', 10)
	.attr('cy', 10)
	.attr('fill', (d) => {
		return d.color;
	});

	sg.append('circle')
	.attr('r', 6)
	.attr('cx', 10)
	.attr('cy', 10)
	.attr('stroke-width', 1)
	.attr('stroke', (d) => {
		return (d.type === 'typeCircle') ? '#333333' : 'rgba(0,0,0,0)';
	})
	.attr('fill', 'none');

    let triangle = d3.symbol().type(d3.symbolTriangle);
    sg.append('path')
    .attr('d', triangle.size(60))
    .attr('transform', 'translate(10,10)')
    .attr('stroke-width', 1)
    .attr('stroke', (d) => {
    	return (d.type === 'typeTriangle') ? '#333333' : 'rgba(0,0,0,0)';
    })
    .attr('fill', 'none');

	li.append('b')
	.classed('textType', true)
	.text(d=>d.title);

}

//showTypes(json0.typesNN);
showTypes(copy.typesNN);

function updateNet(){
	let lineArray = [];
	let lightArray= [];
	let gripArray = [];
	let circleArray = [];
	let triangleArray = [];
    groupCirc.selectAll('circle')
	    .data(curArr, data => data)
	    .join('circle')
	    .attr('r', 10)
	    .attr('class', 'circles')
	    .attr('cx', (d) => {
	    	if(!!d.arrLine){
		    	d.arrLine.forEach( (el) => {
		    		let x2 = +el.split(':')[0];
		    		let y2 = +el.split(':')[1];
		    		lineArray.push([d.cx, d.cy, x2, y2]);
		    	});
		    }
		    if(!!d.typeSign){
		    	let srType = (text) => {
		    		let word = d.typeSign;
		    		return word.split(' ').includes(text);
		    	};
	    		if( srType('typeLight') ){
	    			lightArray.push([d.cx,d.cy]);
	    		}
	    		if( srType('typeCircle') ){
	    			circleArray.push([d.cx,d.cy]);
	    		}
	    		if( srType('typeTriangle') ){
	    			triangleArray.push([d.cx,d.cy]);
	    		}
	    		if( srType('typeGrip') ){
	    			gripArray.push([d.cx,d.cy]);
	    		}
		    }
	    	return d.cx;
	    })
	    .attr('cy', (d) => {
	    	return d.cy;
	    })
	    .attr('fill', (d) => {
	    	return (!!d.type) ? setColor(d.type) : '#919191';
	    })
	    //.attr('fill', (data) => data.color);


	groupCirc.selectAll('circle').exit().remove();

	updateGrip(gripArray);
	//updateLight(lightArray);
	updateLine(lineArray);
	updateCircle(circleArray);
	updateTriangle(triangleArray);

	titleDesc.textContent = ( curArr[0]['title'] );
}

updateNet();

const arrayExp = Array.from( Object.keys(copy) );
//console.log(arrayExp);

const svgLoader = d3.select('.svgLoader')
    .select('ul');

const result = Array.from( Object.keys(copy) ).splice(1, Object.keys(copy).length-1);
//console.log( result );

const listLi = svgLoader.selectAll('li')
    .data( result )
    .enter()
    .append('li')
    .classed('list-group-item p-1', true);

listLi.append('a')
    .attr('title', 'title')
    .attr('name', (d) => { return ''+d})
    .style('cursor', 'pointer')
    .text(data => data)
    .attr('class', (d) => {
    	if( d === 'chart2' ) return 'list-group-item active';
    	return'list-group-item ';
    })
    .on('click', (ev, data) => {
    	[].forEach.call( Array.from(listLi), (el) => {
    		el.childNodes[0].classList.remove('active')
    	})
		curArr = copy[data];
		//console.log( curArr )
		updateNet();
		ev.target.classList.toggle('active');
		ev.preventDefault();
	});


//coordLines();
function coordLines(){
	svgNetwork
	    .append('line')
	    .attr('class', 'linkX')
	    .attr('x1', 0)
	    .attr('y1', CHART_HEIGHT/2)
	    .attr('x2', CHART_WIDTH)
	    .attr('y2', CHART_HEIGHT/2)
	    .attr('opacity', 1)
	    .attr('stroke-width', 0.4)
	    .attr('stroke', '#767676');
	svgNetwork
	    .append('line')
	    .attr('class', 'linkY')
	    .attr('x1', CHART_WIDTH/2)
	    .attr('y1', 0)
	    .attr('x2', CHART_WIDTH/2)
	    .attr('y2', CHART_HEIGHT)
	    .attr('opacity', 1)
	    .attr('stroke-width', 0.4)
	    .attr('stroke', '#767676');
}
  });