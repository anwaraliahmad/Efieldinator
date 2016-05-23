window.THREE = require("three/three");
import Charge from './modules/charge';


let scene = new THREE.Scene();
let camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 20;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

class Electr {
  constructor() {
    this.particles = [];
  }

  create() {
    let geometry2 = new THREE.PlaneGeometry( 5000, 5000);
    let material2 = new THREE.MeshNormalMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry2, material2 );
    scene.add(plane);

    for (let i = 0; i < 2; i++) {
      let charge = new Charge(1,1);
      this.particles.push(charge);
      scene.add(charge.getSphere());
    }

    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
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

  render() {
    requestAnimationFrame(this.render);
  //  updateForce(6000);
    renderer.render( scene, camera );

  }
}

const electr = new Electr();
electr.create();
electr.render();
