/**
* Anwar Ali-Ahmad (https://github.com/anwaraliahmad)
* Coulomb
* Electrostatics physics demo using Three.js (credits to Mr.Doob, https://github.com/mrdoob)
* MIT Licensed
*/

window.THREE = require("three");
window.OrbitControls = require('three-orbit-controls')(THREE);
window.DAT = require('dat-gui');
import Charge from './modules/charge';
import Stats from './modules/stats.min.js';




//setting up scene to contain everything and camera to view them
let scene = new THREE.Scene();
let camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

//giving the document a WebGL renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0xffffff, .5);

//to allow mouse control of camera
let  controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

//setting up FPS stats
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

class Electr {
  constructor() {
    this.particles = [];
    //scaling the force experienced down so Coulomb interaction between the charge bodies are actually observable
    this.FORCE_DESCALING = 100000000000;
    this.keepUpdating = false;
    this.gui = new DAT.GUI({
      height: 5*32-1
    });
    this.gui.add(this, 'FORCE_DESCALING').min(0).max(100000000000000).step(10000);
    this.gui.add(this, 'keepUpdating');
  }

  create() {

    //adding charges spaced out in a row
    for (let i = 1; i <= 10; i++) {
      //initializing a body with a small mass and charge as to not make it accelerate fast from Coulomb interaction
      let clmbs = .0001*i*Math.pow(-1,i);
      let mass = .000001;
      let color = 0xffff00;
      if (clmbs < 0)
        color = 0x0000ff;
      let charge = new Charge(clmbs, mass,color);
      let theta = i/Math.PI;
      //this will result in a helix of charged bodies
      charge.sphere.position.set(20*Math.cos(theta), 20*Math.sin(theta), i*20-200);
      this.particles.push(charge);
      scene.add(charge.sphere);
      }

    //let there be light
    let light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( -1, -1, -1 );
		scene.add( light );



    this.setUpAxis();

  }

  //to add unit vectors for every axis to the scene
  setUpAxis() {

    var unit_vectors = [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)];
    var length = 2;
    var origin = new THREE.Vector3(0,0,0);
    var hex = [0xffff00, 0x00ced1, 0xdd0a2b]; // yellow (x) blue (y) red (z)

    //Adding a vector (ArrowHelper) representing the axis to the scene for each dimension
    for (var i = 0; i < unit_vectors.length; i++) {
      var arrowHelper = new THREE.ArrowHelper(unit_vectors[i], origin, length, hex[i]);//direction, location, magnitude, color
      scene.add(arrowHelper);
    }

  }



  //find the net electric field experienced at a given point in space
  findElectricField(t_pos, sources) {
    var E_vec = new THREE.Vector3(0, 0 , 0);
    for (var i = 0; i < sources.length; i++) {

        //the position vector between target and source
        let tp = new THREE.Vector3();
        tp.copy(t_pos);
        tp.sub(sources[i].sphere.position);

        //copied, normalized version of the tp vector
        let tph = new THREE.Vector3();
        tph.copy(tp);
        tph.normalize();



        //Coulomb's law
        let e = tph.multiplyScalar(8987551787.37*sources[i].charge/(tp.length()^2));

        //Adding the e-field from the source to the net e-field
        E_vec.add(e);
    }
    return E_vec;
  }

  update() {
    for (var n = 0; n < this.particles.length; n++) {

      if (this.particles[n].isFixed())
        continue;
      let arr = this.particles.slice();
      arr.splice(n, 1);
      //vector for electric field experienced by a charge body
      let E_vec = this.findElectricField(this.particles[n].getSphere().position , arr);
      //acceleration vector from the resulting force experienced from the electric field
      let accel = E_vec.multiplyScalar(this.particles[n].getCharge()/(this.particles[n].getMass()*this.FORCE_DESCALING));
      this.particles[n].getVelocity().add(accel);
      this.particles[n].getSphere().position.add(this.particles[n].velocity);
    }
  }

}



//initalizing the simulation
const electr = new Electr();
electr.create();

function render() {
  requestAnimationFrame(render);
  stats.begin();
  controls.update();//updating camera controls
  if (electr.keepUpdating)
    electr.update();//updating electr engine
  renderer.render( scene, camera );
  stats.end();
}

//initial call to the render loop
render();
