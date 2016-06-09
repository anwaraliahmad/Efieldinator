class Charge  {
  constructor(charge, mass, col) { //Coulombs and kilograms.
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshPhongMaterial({color: col});
    this.mesh = new THREE.Mesh(geometry, material);
    this.sphere = new THREE.Object3D(); //Using Object3D as base to manage position better
    this.sphere.add(this.mesh);
    this.charge = charge;
    this.mass = mass;
    this.velocity = new THREE.Vector3(0,0,0);
    this.fixed = false;
  }


  getCharge() {
    return this.charge;
  }

  getMass() {
    return this.mass;
  }

  getSphere() {
    return this.sphere;
  }

  getVelocity() {
    return this.velocity;
  }

  isFixed() {
    return this.fixed;
  }
}
export default Charge;
