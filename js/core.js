



function Particle(velocity, mass, charge, geometry) {
    this.velocity = velocity;
    this.mass = mass;
    this.charge = charge;
    this.geometry = geometry;

}

function FixedSphere(rho, geometry) {
  this.charge_density = rho;
  this.geometry = geometry;
}


function findElectricField(t_pos, sources) {
  var E_vec = new THREE.Vector3(0, 0 , 0);
  for (var i = 0; i < sources.length; i++) {
      var tp = new THREE.Vector3(); 
      tp.copy(t_pos);
//      console.log("r-harpoon: " + t_pos.x + " (x) " +  t_pos.y + " (y) " + t_pos.z + " (z) ");
      tp.sub(sources[i].geometry.position);
      var tph = new THREE.Vector3();
      tph.copy(tp);
      tph.normalize();


      console.log(sources);

      var e = tph.multiplyScalar(8987551787.37*sources[i].charge/(tp.length()^2));

      E_vec.add(e);
    
  }

  return E_vec;
}

function updateForce(frame_rate) {
  for (var n = 0; n < particles.length; n++) {
    var arr = particles.slice();
    arr.splice(n, 1);
    var E_vec = findElectricField(particles[n].geometry.position , arr);
    var accel = E_vec.multiplyScalar(particles[n].charge/(particles[n].mass*frame_rate));
    particles[n].velocity.add(accel);
    particles[n].geometry.position.add(particles[n].velocity);
  }
}
