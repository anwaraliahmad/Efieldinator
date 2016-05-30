window.THREE = require("three");
window.OrbitControls = require('three-orbit-controls')(THREE);

import Charge from './modules/charge';
import Tools from './modules/tools';

let scene = new THREE.Scene();
let camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0x000000, 1.0);


let  controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
/*let evec = new THREE.ArrowHelper(new THREE.Vector3(3,3,3), new THREE.Vector3(0,0,0), 100, 0xffff00);
scene.add(evec);*/
const tools = new Tools(scene);

console.log(controls);
class Electr {
  constructor() {
    this.particles = [];
  }

  create() {


    for (let i = 0; i < 4; i++) {
      let charge = new Charge(.0001*i+.00001, .000001);
      charge.sphere.position.set(20*i, 20*i, 0);
      this.particles.push(charge);
      scene.add(charge.sphere);
    }

    let light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0x002288 );
				light.position.set( -1, -1, -1 );
				scene.add( light );

				light = new THREE.AmbientLight( 0x222222 );
				scene.add( light );

  }

  findElectricField(t_pos, sources) {
    var E_vec = new THREE.Vector3(0, 0 , 0);
    for (var i = 0; i < sources.length; i++) {
        var tp = new THREE.Vector3();
        tp.copy(t_pos);
        tp.sub(sources[i].sphere.position);
        var tph = new THREE.Vector3();
        tph.copy(tp);
        tph.normalize();



        var e;

        e = tph.multiplyScalar(8987551787.37*sources[i].charge/(tp.length()^2));


        E_vec.add(e);
    //    console.log(e);
    }
    return E_vec;
  }

  update() {
	  raycaster.setFromCamera(mouse, camera );
    for (var n = 0; n < this.particles.length; n++) {
      let intersect = raycaster.intersectObject(this.particles[n].getSphere());
      if (intersect.length > 0)
        console.log(intersect);

      if (this.particles[n].fixed)
        continue;
      var arr = this.particles.slice();
      arr.splice(n, 1);
      var E_vec = this.findElectricField(this.particles[n].getSphere().position , arr);
      var accel = E_vec.multiplyScalar(this.particles[n].getCharge()/(this.particles[n].getMass()*600000000000));
      this.particles[n].getVelocity().add(accel);
      this.particles[n].getSphere().position.add(this.particles[n].velocity);

    }
  }

}

function render() {
//  this.update();
  requestAnimationFrame(render);
  controls.update();
  electr.update();
  renderer.render( scene, camera );

}

function onMouseMove(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


document.addEventListener( 'mousemove', onMouseMove, false );

const electr = new Electr();
electr.create();
tools.setUpAxis();
render();
