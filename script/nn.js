"use strict";

function failed(err){
	console.log(err);
	titleDesc.innerHTML = '<p class="text-error">Fetch failed loading data</p>';
	return null;
}

fetch('chart.json')
  .then( data => {
  	console.log('File id loaded');
  	return data.json();
  }, err => failed(err) )
  .then( res => {

console.log('procBegin');
const CHART_WIDTH = 320;
const CHART_HEIGHT = 200;

const copy = res;
const svgNetwork = d3.select('.svgNetwork')
    .select('svg')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT)
    .classed('snw', true);

let curArr = copy.chart23;

function setColor(type){
	const bgs = ['#f1c605','#f1c605','#f1c605',"#6cc805","#6cc805","#6cc805","#fe6500","#fe6500","#0298f7","#0298f7","#0298f7","#fe9bf6","#fe9bf6","#fe9bf6"];
	return bgs[type.split('_')[1]];
}

let groupGrip = svgNetwork.append('g');
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

let groupLight= svgNetwork.append('g');
function updateLight(array){
    var arc = d3.arc().innerRadius(50).outerRadius(50);

	groupLight.selectAll('path')
	    .data(array, d=>d)
	    .join('path')
	    .attr('class', 'light')
	    .attr('d', arc({startAngle: 0, endAngle: -(Math.PI/2)}))
	    .attr("transform", (d) => `translate(${d[0]+40},${d[1]+30}) rotate(45)`)
		.attr('stroke', '#999999')
		.attr('stroke-width', 1)
		.attr('fill', 'none');
	
	groupLight.selectAll('path').exit().remove();
}

let groupLine = svgNetwork.append('g');
function updateLine(array){
	groupLine.selectAll('line')
	    .data(array, d=>d)
	    .join('line')
	    .attr('class', 'link')
	    .attr('x1', d=>d[0])
	    .attr('y1', d=>d[1])
	    .attr('x2', d=>d[2])
	    .attr('y2', d=>d[3])
	    //.transition( d => d )
	    //.duration(500)
	    .attr('stroke-width', 1)
	    .attr('stroke', '#767676');
	
	groupLine.selectAll('line').exit().remove();
}

let groupCirc= svgNetwork.append('g');

let groupMoon = svgNetwork.append('g');
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

const groupMoon2 = svgNetwork.append('g');
function updateTriangle(array){
    let triangle = d3.symbol().type(d3.symbolTriangle);
    groupMoon2.selectAll('path')
		.data(array, data => data)
		.join('path')
	    .attr('d', triangle.size(60))
	    .attr('transform', (d) => `translate(${d[0]},${d[1]})`)
	    .attr('stroke-width', 1)
	    .attr('stroke', '#333333')
	    .attr('fill', 'none');

	groupMoon2.selectAll('path').exit().remove();
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
	let lightArray= [];
	let gripArray = [];
	let circleArray = [];
	let triangleArray = [];

	let nextStep = function(array){
		let count = 1;
		let copy = array;
		let goPoint= [];
		copy.forEach( (arr, idx, what) => {
			let len = what.length-1;
			if( idx < len ){
				arr.forEach( (el, i) => {
					if( !Array.isArray(el.arrLine) && el.arrLine === 'mutation' ){
						copy[count].forEach( (nxt) => {
							goPoint.push([el.cx, el.cy, nxt.cx, nxt.cy]);
						});
					}
					if( Array.isArray(el.arrLine) ) {
						el.arrLine.forEach( (m) => {
				    		let x2 = +m.split(':')[0];
				    		let y2 = +m.split(':')[1];
				    		goPoint.push([el.cx, el.cy, x2, y2]);
						})
					}
				});
			}
			count += 1;
		});

		return goPoint;
	}

	let layer1 = groupCirc.selectAll('.layer1')
	    .data(curArr, (d) => d)
	    .join('g')
	    .attr('class', 'layer1');

    layer1.selectAll('circle')
	    .data((d, i, j) => {
	    	//let got = d3.entries(j)[i].key;
	    	return d.map( (data, i, j ) => {
	    	    return data
	    	})
	    	//return d.map( (d) => [d, got] );
	    })
	    .join('circle')
        .attr('r', 10)
        .attr('cx', (d) => {
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
        .attr('cy', (d) => d.cy)
        .attr('fill', (d) => {
        	return (!!d.type) ? setColor(d.type) : '#919191';
        })
        .classed('circ', true);

    groupCirc.selectAll('.layer1').exit().remove();

	updateGrip(gripArray);
	updateLight(lightArray);
	updateLine( nextStep(curArr) );
	updateCircle(circleArray);
	updateTriangle(triangleArray);

	titleDesc.textContent = ( curArr[0][0]['title'] );
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
    	if( d === 'chart23' ) return 'list-group-item active';
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

console.log('procEnd');
  }, err => failed(err))
.finally( () =>
  {
  console.log( 'finall' )
  }
);