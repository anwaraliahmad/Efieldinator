window.THREE = require("three/three");
var scene = new THREE.Scene();
var camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 50;

var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshNormalMaterial( {color: 0xff0000} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );


var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var geometry2 = new THREE.PlaneGeometry( 5000, 5000);
var material2 = new THREE.MeshNormalMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry2, material2 );
scene.add( plane );


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );


function render() {
  requestAnimationFrame( render );
//  updateForce(6000);
  renderer.render( scene, camera );

}
render();
