class Charge  {
  constructor(charge, mass) { //Coulombs and kilograms.
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});
    this.mesh = new THREE.Mesh(geometry, material);
    this.sphere = new THREE.Object3D(); //Using Object3D as base to manage position better
    this.sphere.add(this.mesh);
    this.charge = charge;
    this.mass = mass;
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

}
export default Charge;
