window.THREE = require("three");
window.OrbitControls = require('three-orbit-controls')(THREE);

import Charge from './modules/charge';


let scene = new THREE.Scene();
let camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.setClearColor(0x000000, 1.0)


let  controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.autoRotate = true;

console.log(controls);
class Electr {
  constructor() {
    this.particles = [];
  }

  create() {


    for (let i = 0; i < 4; i++) {
      let charge = new Charge(1,1);
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
        tp.sub(sources[i].geometry.position);
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
    for (var n = 0; n < particles.length; n++) {
      if (particles[n].fixed)
        continue;
      var arr = particles.slice();
      arr.splice(n, 1);
      var E_vec = findElectricField(particles[n].geometry.position , arr);
      var accel = E_vec.multiplyScalar(particles[n].charge/(particles[n].mass*frame_rate));
      particles[n].velocity.add(accel);
      particles[n].geometry.position.add(particles[n].velocity);
    }
  }

}

function render() {
//  this.update();
  requestAnimationFrame(render);
  controls.update();
//  updateForce(6000);
  renderer.render( scene, camera );

}

const electr = new Electr();
electr.create();
render();
