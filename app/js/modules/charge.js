class Charge  {
  constructor(charge, mass) {
    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let material = new THREE.MeshBasicMaterial({color: 0xffff00});
    this.sphere = new THREE.Mesh( geometry, material);
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
