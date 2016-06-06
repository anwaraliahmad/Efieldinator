window.THREE = require("three");
window.OrbitControls = require('three-orbit-controls')(THREE);
window.DAT = require('dat-gui');
import Charge from './modules/charge';




//setting up scene to contain everything and camera to view them
let scene = new THREE.Scene();
let camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

//giving the document a WebGL renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0x000000, 1.0);

//to allow mouse control of camera
let  controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;


class Electr {
  constructor() {
    this.particles = [];
    //scaling the force experienced down so Coulomb interaction between the charge bodies are actually observable
    this.FORCE_DESCALING = 100000000000000;
    this.keepUpdating = false;
    this.gui = new DAT.GUI({
      height: 5*32-1
    });
    this.gui.add(this, 'FORCE_DESCALING').min(0).max(100000000000000).step(10000).onFinishChange(function() {
// refresh based on the new value of params.interation
});;
    this.gui.add(this, 'keepUpdating');
  }

  create() {

    //adding charges spaced out in a row
    for (let i = 0; i < 20; i++) {
      let charge = new Charge(.0001*i*Math.pow(-1,i), .000001);
      let theta = i/Math.PI;
      charge.sphere.position.set(20*Math.cos(theta), 20*Math.sin(theta), 0);
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

		light = new THREE.AmbientLight( 0x222222 );
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

  //updating an arrow helper vector with given values
  updateArrowHelper(arrow_helper, pos, dir, length) {
    arrow_helper.position.set(pos);
    arrow_helper.setDirection(dir);
    arrow_helper.setLength(length);
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


        E_vec.add(e);
    }
    return E_vec;
  }

  update() {
    for (var n = 0; n < this.particles.length; n++) {

      if (this.particles[n].fixed)
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
  controls.update();//updating camera controls
  if (electr.keepUpdating)
    electr.update();//updating electr engine
  renderer.render( scene, camera );

}

//initial call to the render loop
render();
